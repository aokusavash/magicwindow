const assert=require('node:assert/strict');
global.window=global;
require('../dist/painted/rig.js');require('../dist/painted/walking/gaits.js');require('../dist/painted/walking/layered.js');
const world=require('../dist/painted/alley/world.js'),actor=require('../dist/painted/alley/actor.js');
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
  if(Math.abs(heading)===45||Math.abs(heading)===135)diagonals.add(heading);
}
assert(diagonals.size===4);
assert(world.project(900,200).scale<world.project(900,0).scale);
console.log(`Alley checks pass: eight directions, four diagonals, continuous curved turns/loop, finite projected poses, perspective depth, stopping, and ${locked} planted-foot checks.`);
