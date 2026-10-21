"""Build measured, weighted meshes over unchanged whole-figure artwork."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects

ROOT = Path(__file__).resolve().parents[1] / 'dist' / 'painted'
NAMES = ['torso','head','upper0','lower0','hand0','upper1','lower1','hand1','thigh0','shin0','foot0','thigh1','shin1','foot1']
def smooth(t):
    t = max(0, min(1, t))
    return t*t*(3-2*t)
def distance(p, a, b):
    d = b-a
    t = np.clip(np.dot(p-a,d)/(np.dot(d,d) or 1),0,1)
    return float(np.linalg.norm(p-(a+d*t)))
def build(name):
    image = Image.open(ROOT/'assets'/'skin'/(name+'.png')).convert('RGBA')
    alpha = np.asarray(image)[:,:,3]
    lab, _ = label(alpha>150)
    sizes = np.bincount(lab.ravel());sizes[0]=0
    components = sizes.argsort()[-3:]
    regions = find_objects(lab)
    boxes = sorted([(regions[i-1][1].start, regions[i-1][0].start, regions[i-1][1].stop, regions[i-1][0].stop) for i in components])
    result = {}
    for view,box in zip(['side','rear','front'],boxes):
        x,y,right,bottom=box;w,h=right-x,bottom-y
        if view=='side':
            head=(.50,.095);shoulder=(.52,.24);hip=(.52,.505)
            arms=[[(.36,.245),(.35,.407),(.44,.55)],[(.77,.245),(.84,.40),(.87,.54)]]
            legs=[[(.40,.50),(.31,.74),(.27,.951),(.30,.987),(.62,.987)],[(.68,.50),(.61,.72),(.63,.932),(.65,.956),(.96,.956)]]
            if name=='neighbor':
                legs=[[(.38,.50),(.27,.73),(.23,.943),(.25,.987),(.62,.987)],[(.68,.50),(.59,.72),(.63,.935),(.65,.956),(.96,.956)]]
        else:
            head=(.5,.085);shoulder=(.5,.24);hip=(.5,.505)
            arms=[[(.77,.245),(.86,.40),(.92,.55)],[(.23,.245),(.14,.40),(.08,.55)]]
            legs=[[(.65,.50),(.70,.74),(.75,.94),(.75,.94),(.77,.99)],[(.35,.50),(.30,.74),(.25,.94),(.25,.94),(.23,.99)]]
        def point(p): return np.array([p[0]*w,p[1]*h])
        bones=[(point(hip),point(shoulder)),(point(head),point((head[0],head[1]-.07)))]
        for arm in arms:
            a,b,c=map(point,arm);bones.extend([(a,b),(b,c),(c,c+np.array([0,h*.035]))])
        for leg in legs:
            a,b,c,d,e=map(point,leg);bones.extend([(a,b),(b,c),(d,e)])
        def limb_weights(p,indices):
            v=np.array([1/(distance(p,*bones[i])+h*.025)**4 for i in indices]);v/=v.sum()
            return {i:float(weight) for i,weight in zip(indices,v)}
        def weights(p):
            rel=p[1]/h
            if rel<.15:return [[1,1]]
            if rel<.245:
                a=smooth((rel-.15)/.095);return [[1,1-a],[0,a]]
            # Deliberately conservative walking study: retain the painted upper body,
            # including its overlapping arms, as one surface. Large reaches need
            # properly separated, underpainted arm layers rather than this shortcut.
            if rel<.58:return [[0,1]]
            indices=[8,9,10] if min(distance(p,*bones[i]) for i in [8,9,10])<min(distance(p,*bones[i]) for i in [11,12,13]) else [11,12,13]
            group=limb_weights(p,indices);amount=smooth((rel-.58)/.10)
            out={k:v*amount for k,v in group.items()};out[0]=1-amount
            return [[int(k),round(v,6)] for k,v in out.items() if v>.00001]
        nx=max(5,round(w/(h/26)));ny=26
        vertices=[]
        for row in range(ny+1):
            for column in range(nx+1):
                p=np.array([column*w/nx,row*h/ny]);vertices.append([round(float(p[0]),3),round(float(p[1]),3),weights(p)])
        triangles=[]
        for row in range(ny):
            for column in range(nx):
                xx0,xx1=round(x+column*w/nx),round(x+(column+1)*w/nx)
                yy0,yy1=round(y+row*h/ny),round(y+(row+1)*h/ny)
                if not (alpha[yy0:yy1,xx0:xx1]>80).any():continue
                a=row*(nx+1)+column;b=a+1;c=a+nx+1;d=c+1
                triangles.extend([[a,b,d],[a,d,c]])
        result[view]=dict(box=dict(x=x,y=y,width=w,height=h),bones=[[[round(float(v),3) for v in a],[round(float(v),3) for v in b]] for a,b in bones],vertices=vertices,triangles=triangles)
    return result
data={name:build(name) for name in ['resident','neighbor']}
(ROOT/'skin-data.js').write_text('window.PaintedSkinData='+json.dumps(data,separators=(',',':'))+';\n')
print('Built connected whole-figure meshes:',{n:{v:len(m['triangles']) for v,m in views.items()} for n,views in data.items()})
