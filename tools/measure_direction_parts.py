"""Measure alpha bounds of unchanged directional source artwork; no image retouching."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects

root=Path(__file__).resolve().parents[1]/'dist'/'painted'
data={}
for name in ['front45','rear45','front','rear','legs']:
    im=Image.open(root/'assets'/'directions'/(name+'.png'))
    alpha=np.asarray(im)[:,:,3]
    count=4 if name=='legs' else 5
    boxes=[]
    for cell in range(count):
        left=round(im.width*cell/count);right=round(im.width*(cell+1)/count)
        lab,_=label(alpha[:,left:right]>150)
        sizes=np.bincount(lab.ravel());sizes[0]=0
        r=find_objects(lab)[sizes.argmax()-1]
        boxes.append(dict(x=int(left+r[1].start),y=int(r[0].start),width=int(r[1].stop-r[1].start),height=int(r[0].stop-r[0].start)))
    data[name]=boxes
(root/'alley'/'frames.js').write_text('window.AlleyFrames='+json.dumps(data,separators=(',',':'))+';\n')
print('Measured five directional source atlases without changing PNGs.')
