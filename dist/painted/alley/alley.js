(function(){
  'use strict';
  var canvas=document.getElementById('world'),ctx=canvas.getContext('2d',{alpha:false}),seconds=0,last=0,mode='alley',loaded=false,failed=false;
  var paused=matchMedia('(prefers-reduced-motion: reduce)').matches,closeup=false,slow=false,guides=false,dirty=true,images,renderActor;
  function asset(src){return new Promise(function(resolve,reject){var i=new Image();i.onload=function(){resolve(i);};i.onerror=reject;i.src=src;});}
  function poly(points){ctx.beginPath();points.forEach(function(p,i){if(i)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);});ctx.closePath();}
  function foreground(state){
    AlleyOcclusion.active(state,mode).forEach(function(o){ctx.save();poly(o.outline);ctx.clip();ctx.drawImage(images.background,0,0,1600,900);ctx.restore();});
  }
  function draw(){
    if(!loaded)return;var state=AlleyWorld.at(seconds,mode),ground=AlleyWorld.project(state.x,state.z);
    ctx.drawImage(images.background,0,0,1600,900);
    if(guides){ctx.strokeStyle='rgba(255,237,154,.8)';ctx.lineWidth=3;ctx.setLineDash([6,7]);ctx.beginPath();for(var s=0;s<=state.route.length;s+=5){var p=state.route.sample(s),a=AlleyWorld.project(p.x,p.z);if(s)ctx.lineTo(a.x,a.y);else ctx.moveTo(a.x,a.y);}ctx.stroke();ctx.setLineDash([]);}
    ctx.fillStyle='rgba(44,39,27,.18)';ctx.beginPath();ctx.ellipse(ground.x,ground.y+1,182*ground.scale*.14,Math.max(1,182*ground.scale*.014),0,0,Math.PI*2);ctx.fill();
    renderActor(state);foreground(state);
    if(closeup){var sx=Math.max(0,Math.min(960,ground.x-320)),sy=Math.max(0,Math.min(540,ground.y-182*ground.scale*.5-180));ctx.drawImage(canvas,sx,sy,640,360,0,0,1600,900);}
    var labels={'street':'Along the street','alley-away':'Turning away and heading into the alley','hidden-turn':'Around the hidden corner','alley-toward':'Returning toward the street','street-turn':'Pausing before the next trip','direction':'Individual direction test'};
    document.getElementById('status').textContent=labels[state.phase]+(state.finished?' · End of this direction test.':'')+(slow?' · Half speed.':'');
    dirty=false;if(state.finished&&!paused){paused=true;update();}
  }
  function update(){
    document.getElementById('pause').textContent=paused?'Play':'Pause';document.getElementById('closeup').textContent=closeup?'View full street':'Close-up';
    document.getElementById('slow').setAttribute('aria-pressed',String(slow));document.getElementById('guides').setAttribute('aria-pressed',String(guides));
    document.getElementById('trip').setAttribute('aria-pressed',String(mode==='alley'));
    document.querySelectorAll('[data-heading]').forEach(function(b){b.setAttribute('aria-pressed',String(mode===Number(b.dataset.heading)));});
  }
  function start(t,next){seconds=t;mode=next===undefined?'alley':next;paused=false;dirty=true;update();}
  document.getElementById('trip').onclick=function(){start(0);};document.getElementById('turn').onclick=function(){start(4.7);};
  document.getElementById('return').onclick=function(){var duration=AlleyWorld.travel(0,AlleyWorld.path.length,79.2).duration;start(duration+2+(AlleyWorld.path.length-450)/79.2+.45);};
  document.getElementById('pause').onclick=function(){if(paused&&AlleyWorld.at(seconds,mode).finished)seconds=0;paused=!paused;dirty=true;update();};document.getElementById('closeup').onclick=function(){closeup=!closeup;dirty=true;update();};
  document.getElementById('slow').onclick=function(){slow=!slow;dirty=true;update();};document.getElementById('guides').onclick=function(){guides=!guides;dirty=true;update();};
  document.getElementById('restart').onclick=function(){start(0,mode);};document.querySelectorAll('[data-heading]').forEach(function(b){b.onclick=function(){start(0,Number(b.dataset.heading));};});
  document.addEventListener('visibilitychange',function(){last=0;});
  function tick(now){var dt=last?Math.min(.1,(now-last)/1000):0;last=now;if(!document.hidden){if(!paused)seconds+=dt*(slow?.5:1);if(!paused||dirty)draw();}requestAnimationFrame(tick);}
  window.AlleyStudy={state:function(){return {loaded:loaded,failed:failed,seconds:seconds,mode:mode,paused:paused,closeup:closeup,slow:slow,guides:guides,phase:AlleyWorld.at(seconds,mode).phase};},inspect:function(t,next){seconds=t;mode=next===undefined?'alley':next;paused=true;dirty=true;update();draw();}};
  var files={background:'../assets/street.png',sideUpper:'../assets/skin/resident-arms.png',sideLegs:'../assets/skin/resident-layered.png',props:'../assets/rig/resident.png',front:'../assets/directions/front.png',rear:'../assets/directions/rear.png',front45:'../assets/directions/front45.png',rear45:'../assets/directions/rear45.png',legs:'../assets/directions/legs.png'};
  Promise.all(Object.keys(files).map(function(k){return asset(files[k]).then(function(i){return [k,i];});})).then(function(entries){images=Object.fromEntries(entries);renderActor=AlleyActor.renderer(ctx,images,AlleyFrames);loaded=true;document.getElementById('loading').hidden=true;draw();}).catch(function(){failed=true;document.getElementById('loading').textContent='The artwork could not load. Please reload to try again.';});
  update();requestAnimationFrame(tick);
})();
