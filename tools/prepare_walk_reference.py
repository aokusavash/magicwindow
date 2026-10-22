"""Extract one CMU 07_04 slow-walk cycle from a BVH conversion.

Usage: python3 tools/prepare_walk_reference.py /path/to/07_04.bvh
No network access is performed. See dist/painted/reference/SOURCES.md.
"""
from pathlib import Path
import sys,re,json,hashlib
import numpy as np
source=Path(sys.argv[1]);source_sha=hashlib.sha256(source.read_bytes()).hexdigest()
if source_sha!='320fceb9f8269b8d44f5142385e98e236eccc24cee3728d8227a4933abb82564':
 raise ValueError('Expected the pinned CMU 07_04 BVH conversion; input checksum differs.')
text=source.read_text();hier,motion=text.split('MOTION');tokens=re.findall(r'[^\s{}]+|[{}]',hier);cursor=1;nodes=[];channel=0

def parse(parent=None):
 global cursor,channel
 kind=tokens[cursor];cursor+=1;name=tokens[cursor] if kind!='End' else parent+'End';cursor+=1
 assert tokens[cursor]=='{';cursor+=1;node={'name':name,'parent':parent,'channels':[],'index':channel};nodes.append(node)
 while tokens[cursor]!='}':
  key=tokens[cursor];cursor+=1
  if key=='OFFSET':node['offset']=np.array(list(map(float,tokens[cursor:cursor+3])));cursor+=3
  elif key=='CHANNELS':
   count=int(tokens[cursor]);cursor+=1;node['channels']=tokens[cursor:cursor+count];cursor+=count;node['index']=channel;channel+=count
  elif key in ['JOINT','End']:cursor-=1;parse(name)
  else:raise ValueError(key)
 cursor+=1
parse();lines=motion.strip().splitlines();dt=float(lines[1].split(':')[1]);values=np.array([list(map(float,line.split())) for line in lines[2:]])
assert len(values)==int(lines[0].split(':')[1]) and values.shape[1]==channel

def rotation(axis,angle):
 a=np.deg2rad(angle);c=np.cos(a);s=np.sin(a)
 return {'X':[[1,0,0],[0,c,-s],[0,s,c]],'Y':[[c,0,s],[0,1,0],[-s,0,c]],'Z':[[c,-s,0],[s,c,0],[0,0,1]]}[axis]
positions=[]
for row in values:
 points={};rotations={}
 for n in nodes:
  name=n['name'];local=np.eye(3);offset=n['offset'].copy()
  for key,value in zip(n['channels'],row[n['index']:]):
   if key.endswith('position'):offset['XYZ'.index(key[0])]+=value
   else:local=local@rotation(key[0],value)
  parent=n['parent'];rotations[name]=(rotations[parent] if parent else np.eye(3))@local;points[name]=points[parent]+rotations[parent]@offset if parent else offset
 positions.append(points)
# Chosen consecutive left-foot contacts in the steady middle section. Frame
# numbers here are zero-based. The first/last samples are made periodic below.
start,end=55,231;raw=positions[start:end+1];roots=np.array([p['Hips'] for p in raw]);forward=roots[-1]-roots[0];forward[1]=0;forward/=np.linalg.norm(forward);lateral=np.cross([0,1,0],forward)
height=float(np.mean([p['HeadEnd'][1]-min(p['LeftToeBaseEnd'][1],p['RightToeBaseEnd'][1]) for p in raw]));floor=float(np.mean([min(p['LeftToeBaseEnd'][1],p['RightToeBaseEnd'][1]) for p in raw]))
keys={'hips':'Hips','spine':'Spine','chest':'Neck','head':'Head','crown':'HeadEnd'}
for side,prefix in [('left','Left'),('right','Right')]:
 for joint,bone in [('hip','UpLeg'),('knee','Leg'),('ankle','Foot'),('ball','ToeBase'),('toe','ToeBaseEnd'),('shoulder','Arm'),('elbow','ForeArm'),('hand','Hand'),('tip','FingerBase')]:keys[side+joint.title()]=prefix+bone
samples={}
for key,name in keys.items():
 points=[]
 for i,p in enumerate(raw):
  v=p[name]-(roots[0] if key=='hips' else p['Hips']);points.append([np.dot(v,lateral)/height,(p[name][1]-floor)/height,np.dot(v,forward)/height])
 points=np.array(points);drift=points[-1]-points[0]
 # Remove capture drift continuously, then smooth the loop join with a
 # periodic low-pass Fourier fit. Retain asymmetry within the full two steps.
 points-=np.linspace(0,1,len(points))[:,None]*drift
 periodic=points[:-1];freq=np.fft.rfft(periodic,axis=0);freq[13:]=0;smooth=np.fft.irfft(freq,n=len(periodic),axis=0)
 samples[key]=np.round(smooth,6).tolist()
result={'source':'CMU Graphics Lab, subject 07, trial 04 (slow walk)','sourceUrl':'https://mocap.cs.cmu.edu/search.php?subjectnumber=7','mirrorUrl':'https://github.com/Shriinivas/cmubvh/blob/55588035783a3a6d57a1bb213770c3e18b3e12ee/Sequence-001-009/07/Data/07_04.zip','sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sourceFrames':[start+1,end+1],'sourceFps':round(1/dt,4),'duration':round((end-start)*dt,6),'count':end-start,'height':height,'cycleTravel':float(np.dot(roots[-1]-roots[0],forward)/height),'samples':samples,'events':[{'phase':0,'name':'Contact · left'},{'phase':.10,'name':'Down · left'},{'phase':.25,'name':'Passing · left'},{'phase':.40,'name':'Up · left'},{'phase':.50,'name':'Contact · right'},{'phase':.60,'name':'Down · right'},{'phase':.75,'name':'Passing · right'},{'phase':.90,'name':'Up · right'}],'eventNote':'Approximate animation review landmarks, not measured force-plate events.'}
root=Path(__file__).resolve().parents[1];(root/'dist/painted/reference/capture.js').write_text('window.WalkCapture='+json.dumps(result,separators=(',',':'))+';\n');print(json.dumps({k:v for k,v in result.items() if k!='samples'},indent=2))
