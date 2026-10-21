(function () {
  'use strict';
  var M = window.PaintedWorld, canvas = document.getElementById('world'), ctx = canvas.getContext('2d', { alpha: false });
  var params = new URLSearchParams(location.search);
  function newSeed() { return window.crypto && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] : Math.floor(Math.random() * 4294967296); }
  var supplied = Number(params.get('seed')), seed = params.has('seed') && Number.isFinite(supplied) ? supplied >>> 0 : newSeed();
  var world = M.build(seed), seconds = 0, last = 0, loaded = false, failed = false;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches, paused = reduced;
  var look = 'afternoon', tone = 0, wet = 0, dirty = true, background = new Image(), idle = new Image();
  var rigImages = {}, drawRig, interior = new Image(), closeup = '';
  var status = document.getElementById('status'), loading = document.getElementById('loading');
  var drops = [], rng = M.random(8128);
  for (var i = 0; i < 150; i++) drops.push({ x: rng() * 1900, y: rng() * 1100, v: 400 + rng() * 320, length: 11 + rng() * 15, alpha: .12 + rng() * .18 });
  function ellipse(x, y, rx, ry, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
  function asset(src) { return new Promise(function (resolve, reject) { var image = new Image(); image.onload = function () { resolve(image); }; image.onerror = function () { reject(new Error(src)); }; image.src = src; }); }
  function updatePause() { document.getElementById('pause').textContent = paused ? 'Play' : 'Pause'; document.getElementById('pause').setAttribute('aria-pressed', String(paused)); }
  function setCloseup(value){closeup=value;document.getElementById('closeup').textContent='Close-up: '+(closeup||'off');dirty=true;}
  function setLook(value) {
    if (!['afternoon', 'evening', 'rain'].includes(value)) return;
    look = value; dirty = true;
    document.querySelectorAll('[data-look]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.look === value)); });
  }
  function sprite(image, frame, person, alpha) {
    var unit = person.height / frame.height;
    ctx.save(); ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    ctx.translate(person.x, person.y); ctx.scale(person.direction, 1);
    ctx.drawImage(image, frame.x, frame.y, frame.width, frame.height,
      (frame.left - frame.pivot) * unit, -person.height, frame.width * unit, person.height);
    ctx.restore();
  }
  function resident(p) {
    if (p.hidden || p.x < -100 || p.x > M.width + 100) return;
    ctx.save();
    if (p.clip) { ctx.beginPath(); ctx.rect(M.door.x + 2, M.door.y + 3, M.door.width - 4, M.door.height - 1); ctx.clip(); }
    if (!p.clip) ellipse(p.x, p.y + 1, p.height * .14, 3, 'rgba(44,39,27,.22)');
    drawRig(p);
    ctx.restore();
  }
  function restaurantDoor(p, afterPeople) {
    var d = M.door, open = p.door;
    if (!afterPeople) {
      if (open > .001) {
        ctx.save();ctx.beginPath();ctx.rect(d.x, d.y, d.width, d.height);ctx.clip();
        ctx.drawImage(interior, d.x, d.y, d.width, d.height);
        ctx.fillStyle = 'rgba(24,19,11,.22)';ctx.fillRect(d.x,d.y,4,d.height);
        ctx.drawImage(background, d.x / M.width * background.width, d.y / M.height * background.height,
          d.width / M.width * background.width, d.height / M.height * background.height,
          d.x - d.width * open, d.y, d.width, d.height);
        ctx.restore();
      }
      var hx = d.handleX - d.width * open;
      ctx.fillStyle = '#443728';ctx.fillRect(hx-3,d.handleY-11,6,22);
      ctx.fillStyle = '#b89559';ctx.fillRect(hx-1,d.handleY-9,3,18);
    } else if (open > .001) {
      [d.x - 3, d.x + d.width - 1].forEach(function (x) {
        ctx.drawImage(background, x / M.width * background.width, d.y / M.height * background.height,
          4 / M.width * background.width, d.height / M.height * background.height, x, d.y, 4, d.height);
      });
    }
  }
  function cook() {
    ctx.save();ctx.beginPath();ctx.rect(153, 525, 195, 59);ctx.clip();
    var serve = Math.sin(seconds * .45) > .5;
    sprite(idle, window.PaintedFrames.idle[serve ? 3 : 2], { x: 251, y: 710, height: 166, direction: 1 });
    ctx.restore();
  }
  function steam(x, y, size, phase) {
    ctx.save();ctx.lineWidth = size * .11;ctx.lineCap = 'round';
    for (var i = 0; i < 5; i++) {
      var p = (seconds * .13 + i / 5 + phase) % 1;
      ctx.strokeStyle = 'rgba(255,246,221,' + ((1 - p) * .13) + ')';
      ctx.beginPath();
      for (var j = 0; j <= 10; j++) {
        var f = j / 10, xx = x + Math.sin(f * 5 + p * 4 + phase) * size * .16 + p * size * .22;
        var yy = y - p * size - f * size * .35;
        if (j === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  function atmosphere() {
    steam(87, 132, 55, .2);steam(232, 565, 29, .7);
    if (tone > .001) {
      ctx.fillStyle = 'rgba(19,35,63,' + (tone * .57) + ')';ctx.fillRect(0, 0, M.width, M.height);
      ctx.fillStyle = 'rgba(11,15,32,' + (tone * .25) + ')';ctx.fillRect(0, 0, M.width, M.height);
      ctx.save();ctx.globalCompositeOperation = 'screen';
      [[255, 536, 110, 115], [564, 560, 100, 100], [870, 565, 130, 95], [1451, 533, 100, 100], [1509, 307, 70, 75]].forEach(function (w) {
        var g = ctx.createRadialGradient(w[0], w[1], 0, w[0], w[1], w[2]);
        g.addColorStop(0, 'rgba(255,182,72,' + tone * .3 + ')');g.addColorStop(1, 'rgba(255,182,72,0)');
        ctx.fillStyle = g;ctx.fillRect(w[0] - w[2], w[1] - w[2], w[2] * 2, w[2] * 2);
      });ctx.restore();
    }
    if (wet > .001) {
      ctx.fillStyle = 'rgba(35,64,74,' + wet * .2 + ')';ctx.fillRect(0, 0, M.width, M.height);
      ctx.save();ctx.beginPath();ctx.rect(0, 735, M.width, 165);ctx.clip();
      ctx.fillStyle = 'rgba(149,179,179,' + wet * .14 + ')';ctx.fillRect(0, 735, M.width, 165);
      for (var k = 0; k < 22; k++) {
        var x = (k * 197.7) % M.width, y = 752 + (k * 43.1) % 144, t = (seconds * .75 + k * .13) % 1;
        ctx.strokeStyle = 'rgba(216,226,218,' + wet * (1 - t) * .24 + ')';ctx.lineWidth = .8;
        ctx.beginPath();ctx.ellipse(x, y, 2 + t * 10, .5 + t * 2, 0, 0, Math.PI * 2);ctx.stroke();
      }ctx.restore();
      drops.forEach(function (d) {
        var y = (d.y + seconds * d.v) % 1100 - 100, x = (d.x - seconds * 90 % 1900 + 1900) % 1900 - 150;
        ctx.strokeStyle = 'rgba(217,229,228,' + wet * d.alpha + ')';ctx.lineWidth = .9;
        ctx.beginPath();ctx.moveTo(x, y);ctx.lineTo(x - 3, y + d.length);ctx.stroke();
      });
    }
  }
  function draw() {
    if (!loaded) return;
    ctx.drawImage(background, 0, 0, M.width, M.height);
    var people = world.at(seconds), customer = people[0];
    restaurantDoor(customer, false);cook();
    people.sort(function (a, b) { return a.y - b.y; }).forEach(resident);
    restaurantDoor(customer, true);atmosphere();
    if(closeup){
      var focus=people.find(function(p){return p.id===closeup;})||customer;
      var sw=480,sh=270,fx=focus.hidden?100:focus.x,fy=focus.hidden?620:focus.y-focus.height*.44;
      var sx=Math.max(0,Math.min(M.width-sw,fx-sw/2)),sy=Math.max(0,Math.min(M.height-sh,fy-sh/2));
      ctx.drawImage(canvas,sx,sy,sw,sh,0,0,M.width,M.height);
    }
    dirty = false;
  }
  function animate(now) {
    var dt = last ? Math.min((now - last) / 1000, .1) : 0;last = now;
    if (!document.hidden) {
      if (!paused) seconds += dt;
      var targetTone = look === 'evening' ? 1 : look === 'rain' ? .36 : 0;
      var targetWet = look === 'rain' ? 1 : 0;
      var changing = Math.abs(targetTone - tone) > .001 || Math.abs(targetWet - wet) > .001;
      tone += (targetTone - tone) * Math.min(1, dt * 2);wet += (targetWet - wet) * Math.min(1, dt * 2);
      if (!paused || dirty || changing) draw();
    }
    requestAnimationFrame(animate);
  }
  document.querySelectorAll('[data-look]').forEach(function (button) { button.onclick = function () { setLook(button.dataset.look); }; });
  document.getElementById('pause').onclick = function () { paused = !paused;updatePause();dirty = true; };
  document.getElementById('entrance').onclick = function () { seconds = world.entranceTime;paused = false;updatePause();if(closeup)setCloseup('resident');dirty = true;status.textContent = 'Entrance test · follow the woman to the doorway at the far left of the ramen shop.'; };
  document.getElementById('flower').onclick = function () { seconds=world.flowerTime;paused=false;updatePause();if(closeup)setCloseup('resident');dirty=true;status.textContent='Flower test · watch the resident settle, bend toward the blossoms, and stand up again.'; };
  document.getElementById('closeup').onclick = function () { setCloseup(closeup===''?'resident':closeup==='resident'?'neighbor':''); };
  document.getElementById('variation').onclick = function () { seed = newSeed();world = M.build(seed);seconds = 0;dirty = true;status.textContent = 'New variation · changed walking speeds, pauses, and later shop visits.'; };
  document.getElementById('fullscreen').onclick = function () {
    var p = document.fullscreenElement ? document.exitFullscreen && document.exitFullscreen() : canvas.requestFullscreen && canvas.requestFullscreen();
    if (p && p.catch) p.catch(function () { status.textContent = 'Fullscreen is unavailable in this browser. The scene still fits the page.'; });
  };
  document.addEventListener('visibilitychange', function () { last = 0;dirty = true; });
  window.PaintedStudy = {
    state: function () { return { loaded: loaded, failed: failed, seconds: seconds, seed: seed, paused: paused, look: look, closeup: closeup, residents: world.at(seconds), entranceTime: world.entranceTime, flowerTime:world.flowerTime }; },
    inspect: function (t, value, focus) { if (Number.isFinite(t)) seconds = Math.max(0, t);paused = true;updatePause();if (value) setLook(value);if(focus!==undefined)setCloseup(focus);tone = look === 'evening' ? 1 : look === 'rain' ? .36 : 0;wet = look === 'rain' ? 1 : 0;dirty = true;draw(); }
  };
  updatePause();
  Promise.all([asset('assets/street.png'),asset('assets/idle.png'),asset('assets/rig/resident.png'),asset('assets/rig/neighbor.png'),asset('assets/rig/torsos.png'),asset('assets/rig/interior.png')]).then(function (images) {
    background=images[0];idle=images[1];rigImages.resident=images[2];rigImages.neighbor=images[3];rigImages.torsos=images[4];interior=images[5];
    drawRig=window.PaintedRig.renderer(ctx,rigImages,window.PaintedRigFrames.parts,window.PaintedRigFrames.torsos);loaded=true;
    loading.hidden = true;status.textContent = reduced ? 'Ready · paused to respect reduced-motion preferences. Press Play to explore.' : 'Ready · two painted residents with variable routines. Weather presets are visual studies.';
    draw();
  }).catch(function () { failed = true;loading.textContent = 'The artwork could not load. Please reload to try again.';status.textContent = 'Some artwork is missing or unavailable; the preview has not started.'; });
  requestAnimationFrame(animate);
})();
