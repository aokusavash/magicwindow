(function (root) {
  'use strict';
  var W = 1600, H = 900;
  // Measured against the generated clean plate, not inferred from an image prompt.
  var door = { x: 59, y: 472, width: 84, height: 232, footX: 104, footY: 703 };
  function random(seed) {
    var n = seed >>> 0;
    return function () { n += 0x6D2B79F5; var t = n; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function build(seed) {
    var rng = random(seed), actors = [], firstEntrance = 0;
    function actor(id, initial, speed, height) {
      var a = { id: id, height: height, segments: [], clock: 0, point: initial, facing: 1, stride: 0 };
      a.add = function (target, duration, phase, options) {
        var dx = target.x - a.point.x, dy = target.y - a.point.y;
        if (Math.abs(dx) > 0.1) a.facing = dx > 0 ? 1 : -1;
        var distance = Math.hypot(dx, dy);
        var s = { start: a.clock, duration: duration, from: a.point, to: target, phase: phase,
          direction: a.facing, stride: a.stride, distance: distance, options: options || {} };
        a.segments.push(s); a.stride += distance; a.clock += duration; a.point = target;
        return s;
      };
      a.walk = function (x, y, phase, options) {
        return a.add({ x: x, y: y }, Math.hypot(x - a.point.x, y - a.point.y) / speed, phase || 'walking', options);
      };
      a.wait = function (seconds, phase, options) { return a.add(a.point, seconds, phase || 'pausing', options); };
      actors.push(a); return a;
    }
    var customer = actor('resident', { x: 1440, y: 746 }, 71 + rng() * 8, 182);
    for (var cycle = 0; cycle < 28; cycle++) {
      customer.walk(572, 746);
      customer.wait(1.5 + rng() * 6, 'browsing');
      if (cycle === 0 || rng() > 0.36) {
        customer.walk(104, 746);
        customer.add({ x: 104, y: 703 }, 1.6, 'approaching');
        var opening = customer.wait(1.2, 'opening');
        if (cycle === 0) firstEntrance = opening.start - 4;
        customer.add({ x: 25, y: 703 }, 1.7, 'entering', { clip: true });
        customer.wait(18 + rng() * 22, 'inside', { hidden: true });
        customer.wait(1.2, 'opening-inside', { hidden: true });
        customer.add({ x: 104, y: 703 }, 1.7, 'exiting', { clip: true });
        customer.add({ x: 123, y: 746 }, 1.7, 'departing');
      }
      customer.walk(1680, 746);
      customer.wait(5 + rng() * 12, 'offscreen');
      customer.walk(1440, 746);
    }
    var passer = actor('neighbor', { x: 150, y: 730 }, 65 + rng() * 11, 178);
    for (var trip = 0; trip < 70; trip++) {
      passer.walk(trip % 2 === 0 ? 1680 : -80, 730);
      passer.wait(4 + rng() * 18, 'offscreen');
      // The changing pauses make the two residents meet at different places.
    }
    passer.walk(150, 730); // Close the long schedule without a position jump.
    function sampleActor(a, seconds) {
      var t = Math.max(0, seconds) % a.clock;
      var s = a.segments[a.segments.length - 1];
      for (var i = 0; i < a.segments.length; i++) if (t < a.segments[i].start + a.segments[i].duration) { s = a.segments[i]; break; }
      var p = Math.max(0, Math.min(1, (t - s.start) / s.duration));
      var x = lerp(s.from.x, s.to.x, p), y = lerp(s.from.y, s.to.y, p);
      var openness = 0;
      if (s.phase === 'opening' || s.phase === 'opening-inside') openness = smooth(p);
      else if (s.phase === 'entering') openness = 1;
      else if (s.phase === 'inside') openness = 1 - smooth(Math.min(1, (t - s.start) / 1.4));
      else if (s.phase === 'exiting') openness = 1;
      else if (s.phase === 'departing') openness = 1 - smooth(p);
      return { id: a.id, x: x, y: y, height: a.height * lerp(.91, 1, Math.max(0, Math.min(1, (y - 703) / 43))),
        direction: s.direction, moving: s.distance > .1, gait: (s.stride + s.distance * p) / 85,
        phase: s.phase, hidden: !!s.options.hidden, clip: !!s.options.clip, door: openness };
    }
    return { seed: seed >>> 0, actors: actors, entranceTime: firstEntrance,
      at: function (seconds) { return actors.map(function (a) { return sampleActor(a, seconds); }); } };
  }
  var api = { width: W, height: H, door: door, build: build, random: random };
  root.PaintedWorld = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
