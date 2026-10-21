"""Measure atlas cells without changing generated artwork."""
from pathlib import Path
import json
from PIL import Image
import numpy as np
from scipy.ndimage import label, find_objects

ROOT = Path(__file__).resolve().parents[1] / 'dist' / 'painted'
def boxes(path, columns, rows):
    image = Image.open(path).convert('RGBA')
    width, height = image.width / columns, image.height / rows
    parts = []
    for index in range(columns * rows):
        ox, oy = round(index % columns * width), round(index // columns * height)
        right, bottom = round((index % columns + 1) * width), round((index // columns + 1) * height)
        alpha = image.getchannel('A').crop((ox, oy, right, bottom))
        mask = np.asarray(alpha) > 150
        labels, count = label(mask)
        if not count:
            raise ValueError(f'Empty atlas cell: {path.name} {index}')
        sizes = np.bincount(labels.ravel()); sizes[0] = 0
        component = int(sizes.argmax())
        region = find_objects(labels)[component - 1]
        box = (region[1].start, region[0].start, region[1].stop, region[0].stop)
        if not box:
            raise ValueError(f'Empty atlas cell: {path.name} {index}')
        parts.append(dict(x=ox+box[0], y=oy+box[1], width=box[2]-box[0], height=box[3]-box[1]))
    return parts
parts = {name: boxes(ROOT / 'assets' / 'rig' / (name+'.png'), 4, 5) for name in ('resident', 'neighbor')}
torsos = boxes(ROOT / 'assets' / 'rig' / 'torsos.png', 3, 2)
data = dict(parts=parts, torsos=dict(resident=torsos[:3], neighbor=torsos[3:]))
(ROOT / 'rig-frames.js').write_text('window.PaintedRigFrames = '+json.dumps(data,separators=(',', ':'))+';\n')
print('Measured two 20-part atlases and six replacement torso cells; artwork bytes unchanged.')
