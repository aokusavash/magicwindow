"""Measure alpha bounds for generated sprite sheets; preserve original artwork bytes."""
from pathlib import Path
import json
from PIL import Image

STUDY = Path(__file__).resolve().parents[1] / 'dist' / 'painted'
frames = {}
for name, filename, columns, rows in (
    ('resident', 'resident-walk.png', 4, 2),
    ('neighbor', 'neighbor-walk.png', 4, 2),
    ('idle', 'idle.png', 2, 2),
):
    image = Image.open(STUDY / 'assets' / filename).convert('RGBA')
    cell_width, cell_height = image.width // columns, image.height // rows
    frames[name] = []
    for index in range(columns * rows):
        ox, oy = index % columns * cell_width, index // columns * cell_height
        alpha = image.getchannel('A').crop((ox, oy, ox + cell_width, oy + cell_height))
        bounds = alpha.point(lambda a: 255 if a > 160 else 0).getbbox()
        if not bounds:
            raise ValueError(f'Empty pose: {name} {index}')
        head = alpha.crop((0, int(cell_height * .12), cell_width, int(cell_height * .26))).point(lambda a: 255 if a > 180 else 0).getbbox()
        pivot = (head[0] + head[2]) / 2 if head else cell_width / 2
        frames[name].append(dict(x=ox + bounds[0], y=oy + bounds[1],
                                 width=bounds[2] - bounds[0], height=bounds[3] - bounds[1],
                                 left=bounds[0], pivot=round(pivot, 1)))
(STUDY / 'frames.js').write_text('window.PaintedFrames = ' + json.dumps(frames, separators=(',', ':')) + ';\n')
print('Measured sprite bounds and head anchors; source images unchanged.')
