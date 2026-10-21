const assert = require('node:assert/strict');
global.window = global;
const skin = require('../dist/painted/skin.js');
const rig = require('../dist/painted/rig.js');
const {meshes} = require('../dist/painted/walking/layered.js');
for (const [i, mesh] of meshes.entries()) {
  const thigh = i ? 11 : 8;
  // Upper thighs must belong to this leg, with no torso or opposite-leg weights.
  const sample = mesh.vertices.find(v => Math.abs(v[1] / mesh.box.height - .25) < .02);
  assert(sample && sample[2].length === 1 && sample[2][0][0] === thigh);
  assert(mesh.vertices.every(v => v[2].every(([b]) => (b >= thigh && b <= thigh + 2) || b === 14+i)));
  let angles = [], hips = [];
  for (let frame = 0; frame <= 120; frame++) {
    const p = {id:'resident',x:600,y:746,height:182,baseHeight:182,direction:-1,distance:frame,travelX:-1,travelY:0,view:'side',turnScale:1,walkWeight:1,bend:0,breath:0,grip:0};
    const q = rig.pose(p), points = skin.deform(mesh, p, q);
    assert(points.every(v => Number.isFinite(v.x) && Number.isFinite(v.y)));
    // The actual rendered upper-leg edge must rotate, not just the shin.
    const sampleIndex = ratio => mesh.vertices.findIndex(v => Math.abs(v[1]/mesh.box.height-ratio)<.001 && Math.abs(v[0]/mesh.box.width-.5)<.001);
    const a = points[sampleIndex(.10)], b = points[sampleIndex(.35)];
    angles.push(Math.atan2(b.x-a.x,b.y-a.y));
    hips.push(q.hips.y);
  }
  assert(Math.max(...angles)-Math.min(...angles) > .3);
  assert(Math.max(...hips)-Math.min(...hips) > 2);
}
console.log('Independent full-leg weights, visible thigh rotation, finite poses, and retained body rise/fall pass.');
