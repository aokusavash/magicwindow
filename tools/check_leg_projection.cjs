const assert=require('node:assert/strict');
global.window=global;
require('../dist/painted/rig.js');require('../dist/painted/walking/gaits.js');require('../dist/painted/walking/layered.js');
const world=require('../dist/painted/alley/world.js'),actor=require('../dist/painted/alley/actor.js');
let poses=0;
for(const x of [150,750,1250])for(const z of [-77,0,200,650])for(const degrees of [-135,-90,-45,0,45,90,135,180])for(let frame=0;frame<24;frame++){
  const heading=degrees*Math.PI/180,dx=Math.sin(heading),dz=Math.cos(heading);
  const route={sample:s=>({x:x+dx*s,z:z+dz*s,dx,dz})};
  const state={x,z,heading,route,s:0,sign:1,distance:frame*3,walkWeight:1,phase:'direction'},a=actor.pose(state);
  a.q.legs.forEach((leg,i)=>{
    const lateral=(i?-1:1)*182*.055,local=a.local.legs[i];
    const expectedHipX=a.q.hips.x+Math.cos(heading)*lateral*a.q.hips.scale;
    assert(Math.abs(leg.hip.x-expectedHipX)<1e-8,'hip detached from painted pelvis across the screen');
    assert(Math.abs(leg.hip.y-a.q.hips.y)<1e-8,'hip height detached from painted pelvis');
    function raw(k){const n=local[k],p=route.sample(n.x-(i?-2:2));return world.project(p.x+dz*lateral,p.z-dx*lateral,-n.y);}
    // The attachment repair must leave support and shoe targets unchanged.
    for(const k of ['ankle','foot','ball','toe','heel']){
      const p=raw(k);assert(Math.hypot(p.x-leg[k].x,p.y-leg[k].y)<1e-8,'ground target changed');
    }
    const hip=raw('hip'),knee=raw('knee'),ankle=raw('ankle');
    const t=(ankle.y-knee.y)/(ankle.y-hip.y),after=(leg.ankle.y-leg.knee.y)/(leg.ankle.y-leg.hip.y);
    assert(Number.isFinite(after)&&Math.abs(after-t)<1e-8,'knee lost its relative height');
    // The shear must preserve straight landings and the existing knee bend,
    // rather than adding a kink while moving the hip under the jacket.
    const bend=knee.x-(ankle.x+(hip.x-ankle.x)*t);
    const fixedBend=leg.knee.x-(leg.ankle.x+(leg.hip.x-leg.ankle.x)*after);
    assert(Math.abs(bend-fixedBend)<1e-8,'attachment correction changed knee bend');
  });poses++;
}
console.log(`Leg projection: ${poses} poses across left/center/right, four depths and eight headings; pelvis attachments, knee shape and ground targets pass.`);
