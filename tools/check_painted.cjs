'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const M = require('../dist/painted/world.js');
const R = require('../dist/painted/rig.js');
const one = M.build(327), same = M.build(327), other = M.build(328);
assert.deepEqual(one.at(15), same.at(15), 'a seed reproduces an activity variation');
assert.notDeepEqual(one.at(15), other.at(15), 'a new seed changes activity, not just the displayed label');
let enter = 0, leave = 0, hidden = 0, pauses = 0;
for (let t = 0; t <= 600; t += .1) {
  for (const p of one.at(t)) {
    assert(Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.gait));
    assert(p.door >= 0 && p.door <= 1);
    assert(p.height > 150 && p.height < 190);
    if (p.phase === 'entering') { enter++; assert(p.clip); assert.equal(p.door, 1); }
    if (p.phase === 'exiting') { leave++; assert(p.clip); assert.equal(p.door, 1); }
    if (p.phase === 'inside') { hidden++; assert(p.hidden); }
    if (p.phase === 'flower-smell') { pauses++; assert(!p.moving); assert(p.bend === 1); }
  }
}
assert(enter && leave && hidden && pauses, 'ten-minute sample exercises visits, departures, and pauses');
let plants=0, contacts=0, swing=0, minimumHead=Infinity, maximumHead=-Infinity;
for(let t=0;t<120;t+=1/120){
  const a=one.at(t), b=one.at(t+1/120);
  for(let i=0;i<a.length;i++){
    const p=a[i], next=b[i], pose=R.pose(p), later=R.pose(next);
    assert(pose.legs.every(l=>l.error<.01),'projected legs reach their targets');
    if(p.contact){contacts++;assert(p.grip===1);assert(Math.hypot(pose.arms[0].hand.x-p.handle.x,pose.arms[0].hand.y-p.handle.y)<.01,'gripping hand remains on the moving door handle');}
    if(p.id==='neighbor')assert.deepEqual(pose.bag,pose.arms[0].hand,'tote is a persistent hand attachment');
    if(p.phase==='approaching'||p.phase==='entering')assert.equal(p.view,'rear','depth approach has a rear view');
    if(p.phase==='departing')assert.equal(p.view,'front');
    if(p.phase==='flower-smell')assert(Math.hypot(pose.nose.x-M.flower.x,pose.nose.y-M.flower.y)<15,'flower bend brings the face near the blossom target');
    if(p.phase==='walking'&&next.phase==='walking'&&p.view==='side'&&p.height===next.height&&p.direction===next.direction){
      pose.legs.forEach((leg,j)=>{if(leg.stance&&later.legs[j].stance){plants++;assert(Math.hypot(leg.foot.x-later.legs[j].foot.x,leg.foot.y-later.legs[j].foot.y)<.001,'stance foot stays planted while the body travels');}if(leg.lift>7)swing++;});
      if(p.id==='neighbor'&&t<2){minimumHead=Math.min(minimumHead,pose.head.y);maximumHead=Math.max(maximumHead,pose.head.y);}
    }
  }
}
assert(plants>100&&contacts>100&&swing>100);
assert(maximumHead-minimumHead>2&&maximumHead-minimumHead<14,'body rises and falls through weight transfer');
for (const actor of one.actors) {
  for (let i = 1; i < actor.segments.length; i++) {
    const before = actor.segments[i - 1], after = actor.segments[i];
    assert.deepEqual(before.to, after.from, 'routes are continuous at action boundaries');
    assert(Math.abs(before.start + before.duration - after.start) < 1e-6);
  }
}
const frames = {window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/painted/frames.js'),'utf8'), frames);
for (const name of ['resident','neighbor','idle']) {
  const poses = frames.window.PaintedFrames[name];
  assert.equal(poses.length, name === 'idle' ? 4 : 8);
  assert(poses.every(f => f.width > 0 && f.height > 0 && f.x >= 0 && f.y >= 0));
}
const rigData={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/painted/rig-frames.js'),'utf8'),rigData);
const data=rigData.window.PaintedRigFrames;
const images={resident:{name:'resident'},neighbor:{name:'neighbor'},torsos:{name:'torsos'}};
let calls=[];const fake={save(){},restore(){},translate(){},rotate(){},scale(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},drawImage(...args){calls.push(args);}};
const render=R.renderer(fake,images,data.parts,data.torsos);
for(let t=0;t<120;t+=.25)for(const p of one.at(t)){
  if(p.hidden)continue;calls=[];render(p);const bag=data.parts[p.id][7];
  assert(calls.some(c=>c[0]===images[p.id]&&c[1]===bag.x&&c[2]===bag.y&&c[3]===bag.width&&c[4]===bag.height),'bag is rendered in every visible pose, independently of animation');
}
console.log('Painted checks passed: planted feet, swing clearance, body bounce, hand/door contact, persistent bags, rear/front views, flower reach, seeded routes, and ten-minute activity.');
