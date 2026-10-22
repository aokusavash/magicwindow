"""Measure atlas parts from alpha; retain the original generated PNG bytes."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy import ndimage
root=Path(__file__).resolve().parents[1]
settings={'blouse':[0,.385,.640,1],'child':[0,.430,.685,1],'yukata':[0,.294,.514,.706,1]}
views=['front','front45','side','rear45','rear'];result={}
for name,cuts in settings.items():
 im=Image.open(root/f'dist/painted/assets/cast/{name}.png');alpha=np.array(im)[:,:,3];h,w=alpha.shape;frames={}
 def components(x0,y0,x1,y1):
  mask=alpha[y0:y1,x0:x1]>128;labels,n=ndimage.label(mask);boxes=[]
  for label,slices in enumerate(ndimage.find_objects(labels),1):
   if slices is None:continue
   ys,xs=slices;area=int((labels[slices]==label).sum())
   if area<80:continue
   boxes.append((area,{'x':int(x0+xs.start),'y':int(y0+ys.start),'width':int(xs.stop-xs.start),'height':int(ys.stop-ys.start)}))
  return sorted(boxes,reverse=True,key=lambda b:b[0])
 for col,view in enumerate(views):
  parts=[];x0=round(w*col/5);x1=round(w*(col+1)/5)
  for row in range(len(cuts)-1):
   found=components(x0,round(h*cuts[row]),x1,round(h*cuts[row+1]))
   if not found:raise ValueError(f'{name} {view} row{row}: no part')
   boxes=[b for _,b in found[:2]]
   if row in [1,2]:
    if len(boxes)==1:
     b=boxes[0]
     if b['width']>(x1-x0)*.60:
      mid=b['x']+b['width']//2
      left=components(b['x'],b['y'],mid,b['y']+b['height']);right=components(mid,b['y'],b['x']+b['width'],b['y']+b['height']);boxes=[left[0][1],right[0][1]]
     else:boxes=[b,dict(b)]
    boxes.sort(key=lambda b:b['x']);parts.append(boxes)
   else:parts.append(found[0][1])
  frame={'body':parts[0],'arms':parts[1],'legs':parts[2],'neckCut':(.53 if name=='child' else .40 if name=='yukata' else .51)}
  def center(b,y):
   yy=b['y']+round(b['height']*y);strip=alpha[max(b['y'],yy-2):min(b['y']+b['height'],yy+3),b['x']:b['x']+b['width']]>128
   _,xx=np.where(strip);return float(xx.mean()/b['width']) if len(xx) else .5
  ankle={'blouse':.85,'child':.77,'yukata':.78}[name]
  frame['legAnchors']=[{'hipX':center(b,.06),'kneeX':center(b,(ankle+.06)/2),'ankleX':center(b,ankle),'ankleY':ankle} for b in parts[2]]
  frame['armAnchors']=[{'shoulderX':center(b,.10),'elbowX':center(b,.50),'handX':center(b,.78),'tipX':center(b,.97)} for b in parts[1]]
  if len(parts)>3:frame['garment']=parts[3]
  frames[view]=frame
 result[name]=frames
print(json.dumps({k:{v:{p:([b['width'] for b in x] if isinstance(x,list) and all('width' in b for b in x) else x if isinstance(x,list) else x['width'] if isinstance(x,dict) else x) for p,x in f.items()} for v,f in z.items()} for k,z in result.items()}))
(root/'dist/painted/cast/frames.js').write_text('window.CastFrames='+json.dumps(result,separators=(',',':'))+';\n')
