const assert=require('node:assert/strict');
global.window=global;
require('../dist/painted/rig.js');require('../dist/painted/walking/gaits.js');require('../dist/painted/walking/layered.js');
const world=require('../dist/painted/alley/world.js'),actor=require('../dist/painted/alley/actor.js');
const occlusion=require('../dist/painted/alley/occlusion.js');
const total=world.at(0).total;
let last,locked=0,diagonals=new Set(),minScale=1;
for(let frame=0;frame<=Math.ceil(total*120);frame++){
  const state=world.at(frame/120),a=actor.pose(state);
  assert(a.p.height>50&&a.p.height<220);
  minScale=Math.min(minScale,a.q.ground.scale);
  [a.q.hips,a.q.head,...a.q.legs.flatMap(l=>Object.values(l)),...a.q.arms.flatMap(l=>Object.values(l))].forEach(p=>assert(Number.isFinite(p.x)&&Number.isFinite(p.y)));
  const facing=actor.facing(state.heading);assert(Math.abs(facing.reduce((n,v)=>n+v.weight,0)-1)<.0002);
  if(last){
    const turn=Math.abs(Math.atan2(Math.sin(state.heading-last.state.heading),Math.cos(state.heading-last.state.heading)));
    assert(turn<.09,`heading snapped by ${turn} radians`);
    assert(Math.hypot(state.x-last.state.x,state.z-last.state.z)<1);
    if(state.walkWeight===1&&last.state.walkWeight===1&&state.sign===last.state.sign){
      a.local.legs.forEach((l,i)=>{
        const prior=last.a.local.legs[i];
        if(l.stance&&prior.stance&&l.phase>prior.phase&&Math.sign(l.pitch)===Math.sign(prior.pitch)){
          const key=l.pitch<0?'heel':'ball',p=a.q.legs[i][key],q=last.a.q.legs[i][key];
          assert(Math.hypot(p.x-q.x,p.y-q.y)<.001,'planted foot slid on the curved ground path');locked++;
        }
      });
    }
  }
  last={state,a};
}
assert(locked>1000);assert(minScale<.45);
for(const heading of [-135,-90,-45,0,45,90,135,180]){
  const start=world.at(0,heading),end=world.at(4,heading),radians=heading*Math.PI/180;
  assert(end.finished);assert(Math.abs((end.x-start.x)-140*Math.sin(radians))<.0001);assert(Math.abs((end.z-start.z)-140*Math.cos(radians))<.0001);
  assert(actor.facing(end.heading).length===1);
  const a=actor.pose(world.at(.8,heading));
  // Arms stay on opposite anatomical shoulders; a far shoulder must remain
  // farther from the camera in BOTH mirrored profile views.
  if(Math.abs(heading)===90){
    const near=heading>0?0:1,far=1-near;
    assert(a.q.arms[far].shoulder.depth>a.q.arms[near].shoulder.depth);
    a.q.arms.forEach(arm=>assert(Math.abs(arm.shoulder.x-a.q.hips.x)/a.p.height<.065,'profile sleeve drifted outside the torso'));
  }
  if(heading===0){
    const shoulderHeight=(a.q.hips.y-a.q.arms[0].shoulder.y)/(182*a.q.hips.scale);
    assert(shoulderHeight>.20&&shoulderHeight<.23,'rear shoulders are hunched up');
    assert(Math.abs(a.q.arms[0].shoulder.y-a.q.arms[1].shoulder.y)<.01);
  }
  if(heading===0||heading===180)assert((a.q.arms[0].shoulder.x-a.q.hips.x)*(a.q.arms[1].shoulder.x-a.q.hips.x)<0,'front/rear arms must attach to opposite sides');
  if(Math.abs(heading)===45||Math.abs(heading)===135)diagonals.add(heading);
}
assert(diagonals.size===4);
assert(world.project(900,200).scale<world.project(900,0).scale);
assert.equal(occlusion.active({z:0},'alley').length,0);
assert.equal(occlusion.active({z:300},45).length,0);
function atGroundRow(y){let lo=0,hi=2000;for(let i=0;i<40;i++){let mid=(lo+hi)/2;if(world.project(1150,mid).y>y)lo=mid;else hi=mid;}return {x:1150,z:(lo+hi)/2};}
for(const direction of [-1,1]){
  const front=occlusion.active({...atGroundRow(730),sign:direction},'alley');
  assert(!front.some(o=>occlusion.contains(o.outline,1156,550)),'pole hid a character still standing in front of its base');
  const between=occlusion.active({...atGroundRow(714),sign:direction},'alley');
  assert(between.some(o=>o.id==='left-shop-and-plants'));
  assert(!between.some(o=>o.id==='pole'),'pole must stand farther into the alley than the pots');
  const behind=occlusion.active({...atGroundRow(700),sign:direction},'alley');
  assert(behind.some(o=>o.id==='pole'),'genuine overlap behind the pole must remain');
}
const masks=occlusion.active({z:300},'alley');
const covered=(x,y)=>masks.some(o=>occlusion.contains(o.outline,x,y));
assert(covered(1156,550),'the actual pole face must cover the actor, including the former unmasked hair strip');
assert(!covered(1170,550),'open alley beside the pole must not become a clipping wall');
assert(covered(1163,645),'foreground leaf extends beyond the pole');
assert(!covered(1168,620),'gap outside the foliage must remain open');
assert(covered(1120,700),'terracotta pot still hides the actor');
assert(covered(1148,695),'pole base still hides the actor');
assert(!covered(1142,712),'pavement below the pole must not amputate a trouser leg');
assert(!covered(1141,705),'gap between pole and pot must remain open');
console.log(`Alley checks pass: eight directions, four diagonals, continuous curved turns/loop, finite projected poses, perspective depth, stopping, and ${locked} planted-foot checks.`);
