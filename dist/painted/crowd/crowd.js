(function(){
  'use strict';
  var canvas=document.getElementById('world'),seconds=0,count=8,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,slow=false,loaded=false,failed=false,last=0,dirty=true,images,renderPopulation,renderMs=0,frames=0;
  function asset(src){return new Promise(function(resolve,reject){var img=new Image();img.onload=function(){resolve(img);};img.onerror=reject;img.src=src;});}
  function draw(){
    if(!loaded)return;var start=performance.now();renderPopulation(CrowdWorld.population(seconds,count));
    var text=count+' walkers · '+(paused?'Paused.':'Independent walks along the street and alley.')+(slow?' Half speed.':'');
    if(document.getElementById('status').textContent!==text)document.getElementById('status').textContent=text;
    renderMs=performance.now()-start;frames++;dirty=false;
  }
  function update(){document.getElementById('pause').textContent=paused?'Play':'Pause';document.getElementById('slow').setAttribute('aria-pressed',String(slow));document.querySelectorAll('[data-count]').forEach(function(b){b.setAttribute('aria-pressed',String(Number(b.dataset.count)===count));});canvas.setAttribute('aria-label',count+' painted residents walk along the shops and into and out of the alley');}
  document.querySelectorAll('[data-count]').forEach(function(b){b.onclick=function(){count=Number(b.dataset.count);dirty=true;update();};});
  document.getElementById('pause').onclick=function(){paused=!paused;dirty=true;update();};document.getElementById('slow').onclick=function(){slow=!slow;dirty=true;update();};document.getElementById('restart').onclick=function(){seconds=0;dirty=true;};
  document.getElementById('fullscreen').onclick=function(){if(canvas.requestFullscreen)canvas.requestFullscreen().catch(function(){document.getElementById('status').textContent='Full screen is unavailable in this browser.';});else document.getElementById('status').textContent='Full screen is unavailable in this browser.';};
  document.addEventListener('visibilitychange',function(){last=0;});
  function tick(now){var dt=last?Math.min(.1,(now-last)/1000):0;last=now;if(!document.hidden){if(!paused)seconds+=dt*(slow?.5:1);if(!paused||dirty)draw();}requestAnimationFrame(tick);}
  window.CrowdStudy={state:function(){return {loaded:loaded,failed:failed,seconds:seconds,count:count,paused:paused,slow:slow,renderMs:renderMs,frames:frames};},inspect:function(t,n){seconds=t;if(n!==undefined)count=n;paused=true;update();draw();}};
  var files={background:'../assets/street.png',sideUpper:'../assets/skin/resident-arms.png',sideLegs:'../assets/skin/resident-layered.png',props:'../assets/rig/resident.png',front:'../assets/directions/front.png',rear:'../assets/directions/rear.png',front45:'../assets/directions/front45.png',rear45:'../assets/directions/rear45.png',legs:'../assets/directions/legs.png'};
  Promise.all(Object.keys(files).map(function(k){return asset(files[k]).then(function(i){return [k,i];});})).then(function(entries){images=Object.fromEntries(entries);renderPopulation=CrowdRenderer.renderer(canvas,images);loaded=true;document.getElementById('loading').hidden=true;draw();}).catch(function(){failed=true;document.getElementById('loading').textContent='The artwork could not load. Please reload to try again.';});
  update();requestAnimationFrame(tick);
})();
