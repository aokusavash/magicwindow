(function(){
  'use strict';
  var canvas=document.getElementById('world'),ctx=canvas.getContext('2d',{alpha:false});
  var scene=document.createElement('canvas');scene.width=1600;scene.height=900;
  var brush=scene.getContext('2d',{alpha:false}),seconds=0,last=0,loaded=false,failed=false;
  var stacked=matchMedia('(max-width:760px)').matches;
  var person='resident',surface='layered',gait='everyday',compare=true,slow=false,closeup=true;
  var paused=matchMedia('(prefers-reduced-motion: reduce)').matches,dirty=true,images={},drawSkin,drawParts,drawLayered,cost=[];
  var loading=document.getElementById('loading'),profiles=window.PaintedGaits.profiles;
  function asset(src){return new Promise(function(resolve,reject){var im=new Image();im.onload=function(){resolve(im);};im.onerror=reject;im.src=src;});}
  function point(t,key){var speed=profiles[key].speed,dir=person==='resident'?-1:1;return {id:person,gait:key,x:800+dir*t*speed,y:person==='resident'?746:730,height:person==='resident'?182:178,baseHeight:person==='resident'?182:178,direction:dir,distance:t*speed+120,travelX:dir,travelY:0,view:'side',turnScale:1,walkWeight:1,bend:0,breath:0,grip:0,phase:'walking'};}
  function prop(p,q){
    var atlas=window.PaintedRigFrames.parts[p.id],b=atlas[7],x=q.bag.x,y=q.bag.y,w=p.height*.18,h=p.height*.14;
    if(p.id==='neighbor'){
      var mesh=window.PaintedSkinData[p.id].side,a=mesh.bones[4][0];
      var palm=window.PaintedSkin.deform({box:mesh.box,bones:mesh.bones,vertices:[[a[0],a[1],[[0,1]]]]},p,q)[0];
      x=palm.x;y=palm.y;w=p.height*.225;h=p.height*.29;
    }else{brush.strokeStyle='#67392f';brush.lineWidth=p.height*.011;brush.beginPath();brush.moveTo(q.shoulders.x+p.direction*p.height*.055,q.shoulders.y+p.height*.04);brush.lineTo(x,y+p.height*.04);brush.stroke();}
    brush.drawImage(images[p.id],b.x,b.y,b.width,b.height,x-w/2,y,w,h);
  }
  function render(key){
    var p=point(seconds,key),q=surface==='layered'?window.PaintedGaits.pose(p,window.PaintedLayered.meshes):window.PaintedRig.pose(p);
    // Follow the walker; scenery and planted feet move together past the camera.
    var camera=800-p.x,offset=((camera%1600)+1600)%1600;
    brush.drawImage(images.background,offset,0,1600,900);brush.drawImage(images.background,offset-1600,0,1600,900);
    brush.save();brush.translate(camera,0);
    brush.fillStyle='rgba(44,39,27,.20)';brush.beginPath();brush.ellipse(p.x,p.y+1,p.height*.14,3,0,0,Math.PI*2);brush.fill();
    if(surface==='layered'){drawLayered(p,q);prop(p,q);}else if(surface==='skin'){drawSkin(p,q);prop(p,q);}else drawParts(p);
    brush.restore();return p;
  }
  function draw(){
    if(!loaded)return;var start=performance.now(),height=compare&&stacked?2700:900;
    if(canvas.height!==height){canvas.height=height;canvas.parentElement.style.aspectRatio='1600 / '+height;}
    if(compare){
      ['stroll','everyday','brisk'].forEach(function(key,i){
        var p=render(key),width=1600/3,sourceWidth=320*width/900;
        var x=stacked?0:i*width,y=stacked?i*900:0;
        if(stacked){width=1600;ctx.drawImage(scene,560,p.y-p.height*.45-135,480,270,0,y,1600,900);}
        else ctx.drawImage(scene,800-sourceWidth/2,p.y-235,sourceWidth,320,x,0,width,900);
        ctx.fillStyle='rgba(243,238,228,.94)';ctx.fillRect(x+18,y+18,width-36,stacked?110:70);
        ctx.fillStyle='#343b32';ctx.font=stacked?'58px Georgia':'24px Georgia';ctx.textAlign='center';ctx.fillText(profiles[key].label,x+width/2,y+(stacked?91:61));
        if(i){ctx.fillStyle='#f3eee4';if(stacked)ctx.fillRect(0,y-3,1600,6);else ctx.fillRect(x-3,0,6,900);}
      });
    }else{
      var p=render(gait);if(closeup)ctx.drawImage(scene,560,p.y-p.height*.45-135,480,270,0,0,1600,900);else ctx.drawImage(scene,0,0);
    }
    cost.push(performance.now()-start);if(cost.length>90)cost.shift();dirty=false;
  }
  function update(){
    canvas.setAttribute('aria-label',compare?'Three strides on the same painted resident: A Stroll, B Everyday, C Brisk':profiles[gait].label+' on a painted resident walking through a Japanese street');
    document.querySelectorAll('[data-surface]').forEach(function(el){el.setAttribute('aria-pressed',String(el.dataset.surface===surface));});
    document.querySelectorAll('[data-person]').forEach(function(el){el.setAttribute('aria-pressed',String(el.dataset.person===person));});
    document.querySelectorAll('[data-gait]').forEach(function(el){el.setAttribute('aria-pressed',String(!compare&&el.dataset.gait===gait));});
    document.getElementById('pause').textContent=paused?'Play':'Pause';
    document.getElementById('closeup').textContent=compare||closeup?'View full street':'Close-up';
    document.getElementById('compare').textContent=compare?'View one walk':'Compare three walks';
    document.getElementById('compare').setAttribute('aria-pressed',String(compare));
    document.getElementById('slow').setAttribute('aria-pressed',String(slow));
    document.getElementById('status').textContent=(compare?'Three strides, same person and artwork. Cameras follow each walk.':profiles[gait].label+' · '+(surface==='layered'?'Whole-leg layers':'Earlier artwork treatment'))+(slow?' · Half-speed playback.':' · Normal speed.');
  }
  function tick(now){var dt=last?Math.min(.1,(now-last)/1000):0;last=now;if(!document.hidden){if(!paused)seconds+=dt*(slow?.5:1);if(!paused||dirty)draw();}requestAnimationFrame(tick);}
  document.querySelectorAll('[data-surface]').forEach(function(b){b.onclick=function(){surface=b.dataset.surface;if(surface!=='layered')gait='previous';compare=false;if(surface==='layered')person='resident';update();dirty=true;};});
  document.querySelectorAll('[data-person]').forEach(function(b){b.onclick=function(){person=b.dataset.person;compare=false;if(person==='neighbor'&&surface==='layered'){surface='skin';gait='previous';}update();dirty=true;};});
  document.querySelectorAll('[data-gait]').forEach(function(b){b.onclick=function(){gait=b.dataset.gait;surface='layered';person='resident';compare=false;update();dirty=true;};});
  document.getElementById('compare').onclick=function(){compare=!compare;if(compare){surface='layered';person='resident';}update();dirty=true;};
  document.getElementById('pause').onclick=function(){paused=!paused;dirty=true;update();};
  document.getElementById('slow').onclick=function(){slow=!slow;update();};
  document.getElementById('closeup').onclick=function(){if(compare){compare=false;closeup=false;}else closeup=!closeup;dirty=true;update();};
  document.getElementById('restart').onclick=function(){seconds=0;dirty=true;};
  window.addEventListener('resize',function(){stacked=matchMedia('(max-width:760px)').matches;dirty=true;});
  document.addEventListener('visibilitychange',function(){last=0;});
  window.WalkingStudy={state:function(){return {loaded:loaded,failed:failed,seconds:seconds,person:person,surface:surface,gait:gait,compare:compare,slow:slow,paused:paused,closeup:closeup,averageDrawMs:cost.length?cost.reduce(function(a,b){return a+b;},0)/cost.length:0};},inspect:function(t,who,method,key){seconds=t;if(who)person=who;if(method)surface=method;if(key)gait=key;if(surface!=='layered')gait='previous';if(surface==='layered')person='resident';compare=false;paused=true;update();dirty=true;draw();}};
  Promise.all([asset('../assets/street.png'),asset('../assets/rig/resident.png'),asset('../assets/rig/neighbor.png'),asset('../assets/rig/torsos.png'),asset('../assets/skin/resident.png'),asset('../assets/skin/neighbor.png'),asset('../assets/skin/resident-layered.png')]).then(function(a){
    images={background:a[0],resident:a[1],neighbor:a[2],torsos:a[3]};
    drawParts=window.PaintedRig.renderer(brush,images,window.PaintedRigFrames.parts,window.PaintedRigFrames.torsos);
    drawSkin=window.PaintedSkin.renderer(brush,{resident:a[4],neighbor:a[5]},window.PaintedSkinData);
    drawLayered=window.PaintedLayered.renderer(brush,a[6]);loaded=true;loading.hidden=true;update();draw();
  }).catch(function(){failed=true;loading.textContent='The artwork could not load. Please reload to try again.';});
  update();requestAnimationFrame(tick);
})();
