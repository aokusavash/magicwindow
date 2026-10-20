/* Geometry and behavior checks that do not require a browser or Samsung SDK. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const M = require('../dist/studies/motion.js');

// Sample several complete routes, including both directions and pauses.
for (const pace of [1, 1.275]) {
  let paused = false, reversed = false, previous;
  for (let t = 0; t <= 900; t += .1) {
    const f = M.familyAt(t, pace), a = M.anchors(f);
    assert(f.x >= 240 && f.x <= 1360);
    assert(Number.isFinite(f.gait));
    assert(Math.hypot(a.hand.x - a.collar.x, a.hand.y - a.collar.y) < 95);
    for (const key of ['parent', 'child', 'dog']) assert.equal(a[key].y, M.groundY(a[key].x));
    if (previous) assert(Math.abs(f.x - previous.x) < 2, 'route must not jump at reversal');
    paused ||= !f.moving; reversed ||= f.direction < 0; previous = f;
  }
  assert(paused && reversed, 'route must include pauses and both directions');
}
const normal = M.familyAt(1, 1).x - M.familyAt(0, 1).x;
const faster = M.familyAt(1, 1.275).x - M.familyAt(0, 1.275).x;
assert(Math.abs(faster / normal - 1.275) < 1e-8);

// Exercise application event paths with a fake canvas. This is not a visual test.
function smoke({tv = false, storageFails = false, imageFails = false, reduced = false} = {}) {
  const listeners = {}, nodes = {}, attributes = new Set(tv ? ['data-tv'] : []);
  let raf, loadedImage, exited = false, saver;
  const context = new Proxy({}, {get: (target, key) => target[key] || (() => {})});
  const node = () => ({textContent: '', setAttribute() {}});
  const body = {hasAttribute: key => attributes.has(key),setAttribute: key => attributes.add(key),removeAttribute: key => attributes.delete(key)};
  const canvas = {...node(), getContext: () => context, requestFullscreen: () => Promise.resolve()};
  for (const id of ['status', 'pixel', 'cutout', 'pace', 'pause', 'fullscreen']) nodes[id] = node();
  nodes.world = canvas;
  const document = {body,hidden:false,getElementById:id=>nodes[id],addEventListener:(name,fn)=>listeners[name]=fn};
  const sandbox = {
    document, location:{search:''},URLSearchParams,Math,Number,String,
    requestAnimationFrame:fn=>{raf=fn;return 1;},
    localStorage:{getItem(){if(storageFails)throw Error('blocked');return null;},setItem(){if(storageFails)throw Error('blocked');}},
    Image:function(){loadedImage=this;},
    tizen:{application:{getCurrentApplication:()=>({exit(){exited=true;}})}},
    webapis:{appcommon:{AppCommonScreenSaverState:{SCREEN_SAVER_OFF:0,SCREEN_SAVER_ON:1},setScreenSaver(value,done){saver=value;done();}}}
  };
  sandbox.window={MagicWindowMotion:M,matchMedia:()=>({matches:reduced}),addEventListener:(name,fn)=>listeners[name]=fn,webapis:sandbox.webapis,tizen:sandbox.tizen};
  vm.runInNewContext(fs.readFileSync(require.resolve('../dist/studies/study.js'),'utf8'),sandbox);
  if(imageFails)loadedImage.onerror();else loadedImage.onload();
  raf(1);raf(101);
  const app=sandbox.window.MagicWindowStudy;
  assert.equal(app.getState().loaded,!imageFails);
  if(imageFails){assert(!attributes.has('data-tv'));return;}
  nodes.pixel.onclick();assert.equal(app.getState().mode,'pixel');raf(201);
  nodes.cutout.onclick();assert.equal(app.getState().mode,'cutout');raf(301);
  const before=app.getState().seconds;
  nodes.pace.onclick.call(nodes.pace);assert.equal(app.getState().pace,1);assert.equal(app.getState().seconds,before);
  document.hidden=true;listeners.visibilitychange();raf(401);raf(501);assert.equal(app.getState().seconds,before);
  document.hidden=false;listeners.visibilitychange();
  if(tv){listeners.keydown({keyCode:10009});assert(exited);assert.equal(saver,1);}
  if(reduced)assert(app.getState().paused);
}
smoke();smoke({tv:true});smoke({tv:true,storageFails:true});smoke({tv:true,imageFails:true});smoke({reduced:true});
console.log('Movement geometry and application event checks passed. No browser or physical-TV validation performed.');
