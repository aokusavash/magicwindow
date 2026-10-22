const assert=require('node:assert/strict');global.window=global;
for(const n of ['rig','walking/gaits','walking/layered','alley/world','alley/actor','crowd/world','visits/world','visits/pose','cast/world','cast/frames','reference/capture','reference/motion'])require('../dist/painted/'+n+'.js');
let poses=0,contacts=0,swings=0,armChanges=0,maxJoin=0;
assert.equal(WalkCapture.sourceFrames[0],56);assert.equal(WalkCapture.count,176);assert(WalkCapture.duration>1.4&&WalkCapture.duration<1.6);
for(const points of Object.values(WalkCapture.samples)){assert.equal(points.length,176);assert(points.flat().every(Number.isFinite));}
for(const id of ['original','blouse'])for(const angle of [0,45,90,135,180,-45,-90,-135]){
 let last;
 for(let f=0;f<240;f++){
  let s=CastWorld.dress(AlleyWorld.at(1+f/120,angle),id),a=ReferenceWalk.actor(s),b=AlleyActor.pose(s);poses++;
  let points=[a.q.hips,a.q.head,...a.q.legs.flatMap(l=>[l.hip,l.knee,l.ankle,l.foot]),...a.q.arms.flatMap(l=>[l.shoulder,l.elbow,l.hand])];assert(points.every(p=>Number.isFinite(p.x+p.y)));
  a.local.legs.forEach((l,i)=>{
   assert(l.error<.01,'reference knee solve must remain reachable');assert(l.lift>=-1e-8&&l.lift<182*.031,'quiet swing clearance');
   if(l.stance&&s.walkWeight===1){for(const k of ['ankle','foot','heel','ball','toe'])assert.deepEqual(a.q.legs[i][k],b.q.legs[i][k],'support path must stay unchanged');contacts++;}
   else if(Math.hypot(a.q.legs[i].ankle.x-b.q.legs[i].ankle.x,a.q.legs[i].ankle.y-b.q.legs[i].ankle.y)>.05)swings++;
   if(last&&s.walkWeight===1&&last.s.walkWeight===1){let old=last.a.local.legs[i];if(l.stance&&old.stance&&l.phase>old.phase&&Math.sign(l.pitch)===Math.sign(old.pitch)){let k=l.pitch<0?'heel':'ball';assert(Math.hypot(a.q.legs[i][k].x-last.a.q.legs[i][k].x,a.q.legs[i][k].y-last.a.q.legs[i][k].y)<.003,'support foot slid');}}
  });
  if(Math.hypot(a.q.arms[0].hand.x-b.q.arms[0].hand.x,a.q.arms[0].hand.y-b.q.arms[0].hand.y)>.5)armChanges++;
  last={s,a};
 }
 const duration=182*CastWorld.profiles[id].scale*.57/65;
 for(const phase of [0,.5,.62,.12]){
  let t=duration*(1+phase),a=ReferenceWalk.actor(ReferenceWalk.state(t-1e-6,id,angle)),b=ReferenceWalk.actor(ReferenceWalk.state(t+1e-6,id,angle));
  let p=a.q.legs.flatMap(l=>[l.knee,l.ankle]),q=b.q.legs.flatMap(l=>[l.knee,l.ankle]);p.forEach((v,i)=>{let jump=Math.hypot(v.x-q[i].x,v.y-q[i].y);maxJoin=Math.max(maxJoin,jump);assert(jump<.01,'loop/contact join popped');});
 }
}
assert(swings>200&&armChanges>1000,'capture must visibly affect swing and arms');
assert(contacts>1000);console.log(JSON.stringify({poses,plantedSupportSamples:contacts,capturedSwingSamples:swings,capturedArmSamples:armChanges,maximumJoinPixels:maxJoin}));
