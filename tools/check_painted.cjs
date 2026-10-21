'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const M = require('../dist/painted/world.js');
const one = M.build(327), same = M.build(327), other = M.build(328);
assert.deepEqual(one.at(15), same.at(15), 'a seed reproduces an activity variation');
assert.notDeepEqual(one.at(15), other.at(15), 'a new seed changes activity, not just the displayed label');
let enter = 0, leave = 0, hidden = 0, pauses = 0;
for (let t = 0; t <= 600; t += .1) {
  for (const p of one.at(t)) {
    assert(Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.gait));
    assert(p.door >= 0 && p.door <= 1);
    assert(p.height > 160 && p.height < 190);
    if (p.phase === 'entering') { enter++; assert(p.clip); assert.equal(p.door, 1); }
    if (p.phase === 'exiting') { leave++; assert(p.clip); assert.equal(p.door, 1); }
    if (p.phase === 'inside') { hidden++; assert(p.hidden); }
    if (p.phase === 'browsing') { pauses++; assert(!p.moving); }
  }
}
assert(enter && leave && hidden && pauses, 'ten-minute sample exercises visits, departures, and pauses');
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
console.log('Painted activity checks passed: seeded variation, continuous routes, doorway lifecycle, ten-minute activity, and pose manifests.');
