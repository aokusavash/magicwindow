"""Measure alpha bounds of unchanged directional source artwork; no image retouching."""
from pathlib import Path
import json, sys
import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects

root=Path(__file__).resolve().parents[1]/'dist'/'painted'
data={}
for name in ['front45','rear45','front','rear','legs']:
    im=Image.open(root/'assets'/'directions'/(name+'.png'))
    alpha=np.asarray(im)[:,:,3]
    count=4 if name=='legs' else 5
    # Generated layouts are NOT equal cells: several torsos extend into the
    # nominal second cell. Label the whole sheet before assigning left-to-right
    # parts, so a cell boundary can never slice through a head or jacket.
    lab,_=label(alpha>16)
    sizes=np.bincount(lab.ravel());sizes[0]=0
    components=find_objects(lab)
    ids=np.argsort(sizes)[-count:]
    assert min(sizes[i] for i in ids)>3000, (name,'missing painted component')
    boxes=[]
    for i in ids:
        r=components[i-1]
        boxes.append(dict(x=int(r[1].start),y=int(r[0].start),width=int(r[1].stop-r[1].start),height=int(r[0].stop-r[0].start)))
    boxes.sort(key=lambda box:box['x'])
    data[name]=boxes
target=root/'alley'/'frames.js'
if '--check' in sys.argv:
    saved=json.loads(target.read_text().removeprefix('window.AlleyFrames=').strip().removesuffix(';'))
    assert saved==data, 'Directional bounds cut or misidentify a complete painted component; rerun this tool.'
    print('All 24 atlas bounds include their complete painted components, including heads and sleeves.')
else:
    target.write_text('window.AlleyFrames='+json.dumps(data,separators=(',',':'))+';\n')
    print('Measured five directional source atlases without changing PNGs.')
