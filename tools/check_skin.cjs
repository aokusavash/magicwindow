const assert = require('node:assert/strict');
global.window = global;
require('../dist/painted/skin-data.js');
const skin = require('../dist/painted/skin.js');
const rig = require('../dist/painted/rig.js');
for (const [id, views] of Object.entries(PaintedSkinData)) {
  for (const mesh of Object.values(views)) {
    for (const vertex of mesh.vertices) {
      assert(Math.abs(vertex[2].reduce((n, w) => n + w[1], 0) - 1) < .00002);
      assert(vertex[2].every(([i, w]) => i >= 0 && i < mesh.bones.length && w >= 0));
    }
    assert(mesh.triangles.every(t => t.length === 3 && t.every(i => i >= 0 && i < mesh.vertices.length)));
  }
  for (let frame = 0; frame < 120; frame++) {
    const p = {id, x: 600, y: 730, height: 182, baseHeight: 182, direction: id === 'resident' ? -1 : 1, distance: frame * 2, travelX: 1, travelY: 0, view: 'side', turnScale: 1, walkWeight: 1, bend: 0, breath: 0, grip: 0};
    assert(skin.deform(views.side, p, rig.pose(p)).every(v => Number.isFinite(v.x) && Number.isFinite(v.y)));
  }
}
console.log('Mesh weights, indices, and walking transforms pass; artistic quality is not established.');
