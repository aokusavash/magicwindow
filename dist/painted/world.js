(function (root) {
  'use strict';
  var W = 1600, H = 900;
  var door = { x: 59, y: 472, width: 84, height: 232, footX: 92, footY: 703, handleX: 134, handleY: 592 };
  var flower = { x: 478, y: 628 };
  function random(seed) {
    var n = seed >>> 0;
    return function () { n += 0x6D2B79F5; var t = n; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function build(seed) {
    var rng = random(seed), actors = [], firstEntrance = 0, firstFlower = 0;
    function actor(id, initial, speed, height) {
      var a = { id: id, height: height, segments: [], clock: 0, point: initial, facing: 1, stride: 0 };
      a.add = function (target, duration, phase, options) {
        options = options || {};
        var dx = target.x - a.point.x, dy = target.y - a.point.y;
        if (options.facing) a.facing = options.facing;
        else if (Math.abs(dx) > .1) a.facing = dx > 0 ? 1 : -1;
        var distance = Math.hypot(dx, dy);
        var s = { start: a.clock, duration: duration, from: a.point, to: target, phase: phase,
          direction: a.facing, stride: a.stride, distance: distance, options: options };
        a.segments.push(s); a.stride += distance; a.clock += duration; a.point = target;
        return s;
      };
      a.walk = function (x, y, phase, options) { return a.add({ x: x, y: y }, Math.hypot(x - a.point.x, y - a.point.y) / speed, phase || 'walking', options); };
      a.wait = function (duration, phase, options) { return a.add(a.point, duration, phase, options); };
      actors.push(a); return a;
    }
    var customer = actor('resident', { x: 1440, y: 746 }, 71 + rng() * 8, 182);
    for (var cycle = 0; cycle < 24; cycle++) {
      customer.walk(545, 746);
      customer.wait(.35, 'settling');
      var flowerStart = customer.wait(1.25, 'flower-lean', { facing: -1 });
      if (cycle === 0) firstFlower = flowerStart.start - 1;
      customer.wait(2.5 + rng() * 1.5, 'flower-smell');
      customer.wait(1.1, 'flower-recover');
      if (cycle === 0 || rng() > .36) {
        customer.walk(173, 746);
        customer.wait(.35, 'settling');
        var turn = customer.wait(.55, 'turn-away', { fromView: 'side', view: 'rear' });
        if (cycle === 0) firstEntrance = turn.start - 1;
        customer.add({ x: 173, y: 703 }, 1.6, 'approaching', { view: 'rear', ease: true });
        customer.wait(.55, 'turn-door', { fromView: 'rear', view: 'side', facing: -1 });
        customer.wait(.75, 'reach', { facing: -1 });
        customer.add({ x: 92, y: 703 }, 2.1, 'opening', { facing: -1, ease: true });
        customer.wait(.45, 'release', { door: 1 });
        customer.wait(.5, 'turn-inside', { door: 1, fromView: 'side', view: 'rear' });
        customer.add({ x: 92, y: 671 }, 1.5, 'entering', { door: 1, view: 'rear', clip: true });
        customer.wait(.4, 'turn-corner', { door: 1, fromView: 'rear', view: 'side', facing: 1, clip: true });
        customer.add({ x: 194, y: 671 }, 1.65, 'entering-corner', { door: 1, view: 'side', facing: 1, clip: true });
        customer.wait(14 + rng() * 14, 'inside', { door: 1, hidden: true });
        customer.add({ x: 92, y: 671 }, 1.65, 'exiting-corner', { door: 1, view: 'side', facing: -1, clip: true });
        customer.wait(.4, 'turn-out', { door: 1, fromView: 'side', view: 'front', clip: true });
        customer.add({ x: 92, y: 703 }, 1.5, 'exiting', { door: 1, view: 'front', clip: true });
        customer.wait(.5, 'turn-close', { door: 1, fromView: 'front', view: 'side', facing: -1 });
        customer.wait(.7, 'reach-close', { door: 1 });
        customer.add({ x: 173, y: 703 }, 2.1, 'closing', { facing: -1, ease: true });
        customer.wait(.45, 'release-close');
        customer.wait(.5, 'turn-street', { fromView: 'side', view: 'front' });
        customer.add({ x: 173, y: 746 }, 1.6, 'departing', { view: 'front', ease: true });
        customer.wait(.5, 'turn-right', { fromView: 'front', view: 'side', facing: 1 });
      }
      customer.walk(1680, 746);
      customer.wait(5 + rng() * 12, 'offscreen');
      customer.walk(1440, 746);
    }
    var passer = actor('neighbor', { x: 150, y: 730 }, 65 + rng() * 11, 178);
    for (var trip = 0; trip < 70; trip++) {
      passer.walk(trip % 2 === 0 ? 1680 : -80, 730);
      passer.wait(4 + rng() * 18, 'offscreen');
    }
    passer.walk(150, 730);
    function sampleActor(a, seconds) {
      var t = Math.max(0, seconds) % a.clock, s = a.segments[a.segments.length - 1];
      for (var i = 0; i < a.segments.length; i++) if (t < a.segments[i].start + a.segments[i].duration) { s = a.segments[i]; break; }
      var p = Math.max(0, Math.min(1, (t - s.start) / s.duration)), eased = smooth(p), travel = s.options.ease ? eased : p;
      var x = lerp(s.from.x, s.to.x, travel), y = lerp(s.from.y, s.to.y, travel);
      var openness = s.options.door || 0;
      if (s.phase === 'opening') openness = eased;
      if (s.phase === 'closing') openness = 1 - eased;
      var contact = s.phase === 'opening' || s.phase === 'closing';
      var grip = contact ? 1 : 0;
      if (s.phase === 'reach' || s.phase === 'reach-close') grip = eased;
      if (s.phase === 'release' || s.phase === 'release-close') grip = 1 - eased;
      var bend = 0;
      if (s.phase === 'flower-lean') bend = eased;
      if (s.phase === 'flower-smell') bend = 1;
      if (s.phase === 'flower-recover') bend = 1 - eased;
      var v = s.options.view || 'side', turnScale = 1;
      if (s.options.fromView) { v = p < .5 ? s.options.fromView : v; turnScale = .5 + .5 * Math.abs(Math.cos(p * Math.PI)); }
      return { id: a.id, x: x, y: y, baseHeight: a.height, height: a.height * lerp(.87, 1, Math.max(0, Math.min(1, (y - 671) / 75))),
        direction: s.direction, moving: s.distance > .1, distance: s.stride + s.distance * travel,
        travelX: s.distance ? (s.to.x - s.from.x) / s.distance : s.direction,
        travelY: s.distance ? (s.to.y - s.from.y) / s.distance : 0,
        gait: (s.stride + s.distance * travel) / 131, phase: s.phase, progress: p,
        hidden: !!s.options.hidden, clip: !!s.options.clip, door: openness, view: v, turnScale: turnScale,
        walkWeight: s.phase === 'settling' ? 1 - eased : s.distance > .1 ? 1 : 0,
        bend: bend, breath: s.phase === 'flower-smell' ? Math.sin((t - s.start) * 2.1) * .7 : 0,
        grip: grip, contact: contact, handle: { x: door.handleX - door.width * openness, y: door.handleY } };
    }
    return { seed: seed >>> 0, actors: actors, entranceTime: firstEntrance, flowerTime: firstFlower,
      at: function (seconds) { return actors.map(function (a) { return sampleActor(a, seconds); }); } };
  }
  var api = { width: W, height: H, door: door, flower: flower, build: build, random: random, smooth: smooth };
  root.PaintedWorld = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
