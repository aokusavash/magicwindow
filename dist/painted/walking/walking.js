(function(){
  'use strict';
  var canvas=document.getElementById('world'),ctx=canvas.getContext('2d',{alpha:false}),seconds=0,last=0,loaded=false,failed=false;
  var person='resident',surface='skin',closeup=true,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,dirty=true,images={},drawSkin,drawParts;
  var status=document.getElementById('status'),loading=document.getElementById('loading'),cost=[];
  function asset(src){return new Promise(function(resolve,reject){var im=new Image();im.onload=function(){resolve(im);};im.onerror=reject;im.src=src;});}
  function point(t){var speed=person==='resident'?72:67,dir=person==='resident'?-1:1;return {id:person,x:dir>0?((200+t*speed)%1850)-100:1700-((300+t*speed)%1850),y:person==='resident'?746:730,height:person==='resident'?182:178,baseHeight:person==='resident'?182:178,direction:dir,distance:t*speed+120,travelX:dir,travelY:0,view:'side',turnScale:1,walkWeight:1,bend:0,breath:0,grip:0,phase:'walking'};}
  function prop(p,q){var atlas=window.PaintedRigFrames.parts[p.id],b=atlas[7],x=q.bag.x,y=q.bag.y,w=p.height*.18,h=p.height*.14;
    if(p.id==='neighbor'){
      var mesh=window.PaintedSkinData[p.id].side,a=mesh.bones[4][0];
      var palm=window.PaintedSkin.deform({box:mesh.box,bones:mesh.bones,vertices:[[a[0],a[1],[[0,1]]]]},p,q)[0];
      x=palm.x;y=palm.y;w=p.height*.225;h=p.height*.29;
    }else{ctx.strokeStyle='#67392f';ctx.lineWidth=p.height*.011;ctx.beginPath();ctx.moveTo(q.shoulders.x+p.direction*p.height*.055,q.shoulders.y+p.height*.04);ctx.lineTo(x,y+p.height*.04);ctx.stroke();}
    ctx.drawImage(images[p.id],b.x,b.y,b.width,b.height,x-w/2,y,w,h);
  }
  function draw(){if(!loaded)return;var start=performance.now(),p=point(seconds),q=window.PaintedRig.pose(p);ctx.drawImage(images.background,0,0,1600,900);
    ctx.fillStyle='rgba(44,39,27,.20)';ctx.beginPath();ctx.ellipse(p.x,p.y+1,p.height*.14,3,0,0,Math.PI*2);ctx.fill();
    if(surface==='skin'){drawSkin(p,q);prop(p,q);}else drawParts(p);
    if(closeup){var sx=Math.max(0,Math.min(1120,p.x-240)),sy=Math.max(0,Math.min(630,p.y-p.height*.45-135));ctx.drawImage(canvas,sx,sy,480,270,0,0,1600,900);}
    cost.push(performance.now()-start);if(cost.length>90)cost.shift();dirty=false;
  }
  function update(){document.getElementById('pause').textContent=paused?'Play':'Pause';document.getElementById('closeup').textContent=closeup?'View full street':'Close-up';}
  function tick(now){var dt=last?Math.min(.1,(now-last)/1000):0;last=now;if(!document.hidden){if(!paused)seconds+=dt;if(!paused||dirty)draw();}requestAnimationFrame(tick);}
  document.querySelectorAll('[data-surface]').forEach(function(b){b.onclick=function(){surface=b.dataset.surface;document.querySelectorAll('[data-surface]').forEach(function(el){el.setAttribute('aria-pressed',String(el.dataset.surface===surface));});dirty=true;};});
  document.querySelectorAll('[data-person]').forEach(function(b){b.onclick=function(){person=b.dataset.person;document.querySelectorAll('[data-person]').forEach(function(el){el.setAttribute('aria-pressed',String(el.dataset.person===person));});dirty=true;};});
  document.getElementById('pause').onclick=function(){paused=!paused;dirty=true;update();};document.getElementById('closeup').onclick=function(){closeup=!closeup;dirty=true;update();};document.getElementById('restart').onclick=function(){seconds=0;dirty=true;};
  document.addEventListener('visibilitychange',function(){last=0;});
  window.WalkingStudy={state:function(){return {loaded:loaded,failed:failed,seconds:seconds,person:person,surface:surface,paused:paused,closeup:closeup,averageDrawMs:cost.length?cost.reduce(function(a,b){return a+b;},0)/cost.length:0};},inspect:function(t,who,method){seconds=t;if(who)person=who;if(method)surface=method;paused=true;update();dirty=true;draw();}};
  Promise.all([asset('../assets/street.png'),asset('../assets/rig/resident.png'),asset('../assets/rig/neighbor.png'),asset('../assets/rig/torsos.png'),asset('../assets/skin/resident.png'),asset('../assets/skin/neighbor.png')]).then(function(a){images={background:a[0],resident:a[1],neighbor:a[2],torsos:a[3]};drawParts=window.PaintedRig.renderer(ctx,images,window.PaintedRigFrames.parts,window.PaintedRigFrames.torsos);drawSkin=window.PaintedSkin.renderer(ctx,{resident:a[4],neighbor:a[5]},window.PaintedSkinData);loaded=true;loading.hidden=true;status.textContent='Walking-only comparison · the full street interactions remain a separate study.';draw();}).catch(function(){failed=true;loading.textContent='The artwork could not load. Please reload to try again.';});
  update();requestAnimationFrame(tick);
})();
