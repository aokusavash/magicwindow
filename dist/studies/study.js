(function(){
  'use strict';
  var canvas=document.getElementById('world'),ctx=canvas.getContext('2d',{alpha:false});
  var M=window.MagicWindowMotion, background=new Image(), loaded=false,failed=false;
  var mode='cutout',pace=1.275,paused=false,seconds=0,last=0,frame=0;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tv=document.body.hasAttribute('data-tv')||new URLSearchParams(location.search).get('tv')==='1';
  if(tv)document.body.setAttribute('data-tv','');
  paused=reduced;
  var status=document.getElementById('status');
  function report(message){status.textContent=message;}
  function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
  function limb(x,y,length,angle,width,color){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,length);ctx.stroke();ctx.restore();}
  function illustratedPerson(point,scale,shirt,skirt,direction,gait,moving,isParent){
    ctx.save();ctx.translate(point.x,point.y);ctx.scale(scale,scale);
    ellipse(0,1,12,2,'rgba(42,39,31,.2)');
    var swing=moving?Math.sin(gait)*.33:0,bob=moving?Math.abs(Math.sin(gait))*.55:0;
    ctx.translate(0,-bob);
    limb(-4,-19,17,swing,4,'#494a43');limb(4,-19,17,-swing,4,'#57574a');
    ellipse(-4-Math.sin(swing)*17,-2,4,2,'#3d3934');ellipse(4+Math.sin(swing)*17,-2,4,2,'#3d3934');
    ctx.fillStyle=skirt;ctx.beginPath();ctx.moveTo(-7,-36);ctx.lineTo(7,-36);ctx.lineTo(11,-17);ctx.lineTo(-11,-17);ctx.closePath();ctx.fill();
    ctx.fillStyle=shirt;ctx.fillRect(-7,-48,14,18);
    limb(-7,-44,17,swing*.7,4,'#c6936c');
    if(isParent){limb(7,-44,15,-.2,4,'#c6936c');}else{limb(7,-44,17,-swing*.7,4,'#c6936c');}
    ellipse(0,-56,7,9,'#d7ad83');ellipse(-direction*2,-61,7,5,'#4a3d30');
    ellipse(direction*5,-55,1,1,'#493c31');
    if(!isParent){ellipse(0,-64,12,2,'#c8aa6d');ellipse(0,-67,7,4,'#d4b774');}
    ctx.restore();
  }
  function pixelPerson(point,scale,shirt,skirt,direction,gait,moving,isParent){
    ctx.save();ctx.translate(Math.round(point.x),Math.round(point.y));ctx.scale(scale*2,scale*2);
    var step=moving?Math.round(Math.sin(gait)*2):0;
    ctx.fillStyle='rgba(42,39,31,.2)';ctx.fillRect(-6,0,12,1);
    ctx.fillStyle='#494a43';ctx.fillRect(-3+step,-9,2,9);ctx.fillRect(1-step,-9,2,9);
    ctx.fillStyle=skirt;ctx.fillRect(-5,-17,10,9);ctx.fillStyle=shirt;ctx.fillRect(-4,-24,8,9);
    ctx.fillStyle='#c6936c';ctx.fillRect(-5,-22,2,8);ctx.fillRect(4,-22,2,8);
    ctx.fillStyle='#d7ad83';ctx.fillRect(-3,-31,6,7);ctx.fillStyle='#4a3d30';ctx.fillRect(-4,-33,7,3);
    ctx.fillStyle='#493c31';ctx.fillRect(direction>0?2:-3,-28,1,1);
    if(!isParent){ctx.fillStyle='#c8aa6d';ctx.fillRect(-6,-34,12,1);ctx.fillStyle='#d4b774';ctx.fillRect(-4,-37,8,3);}
    ctx.restore();
  }
  function dog(point,direction,gait,moving){
    ctx.save();ctx.translate(point.x,point.y);ctx.scale(direction,1);
    var step=moving?Math.sin(gait+1)*3:0;
    ellipse(0,1,14,2,'rgba(42,39,31,.2)');
    if(mode==='pixel'){
      ctx.fillStyle='#7b5737';ctx.fillRect(-9+Math.round(step),-7,3,7);ctx.fillRect(5-Math.round(step),-7,3,7);
      ctx.fillStyle='#b7864d';ctx.fillRect(-13,-17,24,12);ctx.fillRect(8,-24,10,13);ctx.fillStyle='#725333';ctx.fillRect(10,-24,4,9);ctx.fillStyle='#38372b';ctx.fillRect(16,-20,2,2);ctx.fillStyle='#b7864d';ctx.fillRect(-18,-20,7,3);
    }else{
      limb(-7,-8,7,step*.09,3,'#84603d');limb(6,-8,7,-step*.09,3,'#84603d');
      ellipse(0,-13,14,7,'#b7864d');ellipse(12,-20,7,7,'#c1975d');ellipse(10,-22,3,6,'#795535');ellipse(17,-19,1.5,1.5,'#38372b');
      limb(-12,-15,10,2+Math.sin(gait)*.2,3,'#b7864d');
    }
    ctx.strokeStyle='#5b6c55';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(8,-18);ctx.lineTo(12,-13);ctx.stroke();ctx.restore();
  }
  function draw(){
    if(!loaded){ctx.fillStyle='#34483c';ctx.fillRect(0,0,M.width,M.height);return;}
    ctx.drawImage(background,0,0,M.width,M.height);
    var f=M.familyAt(seconds,1),a=M.anchors(f);
    ctx.strokeStyle='#635747';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(a.hand.x,a.hand.y);ctx.quadraticCurveTo((a.hand.x+a.collar.x)/2,Math.max(a.hand.y,a.collar.y)+9,a.collar.x,a.collar.y);ctx.stroke();
    var person=mode==='pixel'?pixelPerson:illustratedPerson;
    person(a.parent,1,'#e5d5b4','#65788a',f.direction,f.gait,f.moving,true);
    person(a.child,.69,'#d39472','#b7795e',f.direction,f.gait+1,f.moving,false);
    dog(a.dog,f.direction,f.gait,f.moving);
    // Ordinary passersby continue independently of the family rehearsal.
    for(var i=0;i<3;i++){
      var x=((seconds*(i%2?-15:12)+i*530+2200)%1820)-110;
      person({x:x,y:M.groundY(x)-4},.82,['#72795b','#9b7665','#698488'][i],'#4c514b',i%2?-1:1,seconds*5+i,true,false);
    }
  }
  function animate(now){
    if(last&&!paused&&!document.hidden)seconds+=Math.min((now-last)/1000,.1)*pace;
    last=now;draw();frame=requestAnimationFrame(animate);
  }
  function setMode(value){mode=value;document.getElementById('pixel').setAttribute('aria-pressed',String(value==='pixel'));document.getElementById('cutout').setAttribute('aria-pressed',String(value==='cutout'));}
  document.getElementById('pixel').onclick=function(){setMode('pixel');};
  document.getElementById('cutout').onclick=function(){setMode('cutout');};
  document.getElementById('pace').onclick=function(){pace=pace===1?1.275:1;this.textContent=pace===1?'Pace: original':'Pace: +27.5%';this.setAttribute('aria-pressed',String(pace!==1));};
  function updatePause(){document.getElementById('pause').textContent=paused?'Play':'Pause';}
  document.getElementById('pause').onclick=function(){paused=!paused;updatePause();};updatePause();
  document.getElementById('fullscreen').onclick=function(){
    var action=document.fullscreenElement?document.exitFullscreen&&document.exitFullscreen():canvas.requestFullscreen&&canvas.requestFullscreen();
    if(action&&action.catch)action.catch(function(){report('Fullscreen is unavailable here. The TV package displays the scene without page controls.');});
  };
  var savedTime=0;
  try{savedTime=Number(localStorage.getItem('magicwindow-study-seconds'))||0;}catch(e){}
  if(tv)seconds=Math.max(0,savedTime);
  function save(){if(tv)try{localStorage.setItem('magicwindow-study-seconds',String(seconds));}catch(e){}}
  function screensaver(active){
    if(window.webapis&&webapis.appcommon)try{
      var states=webapis.appcommon.AppCommonScreenSaverState;
      webapis.appcommon.setScreenSaver(active?states.SCREEN_SAVER_OFF:states.SCREEN_SAVER_ON,function(){},function(){report('Screensaver request was not accepted by this TV.');});
    }catch(e){report('Screensaver behavior needs checking on this TV.');}
  }
  document.addEventListener('visibilitychange',function(){last=0;save();screensaver(!document.hidden&&!paused);});
  document.addEventListener('keydown',function(event){
    if(!tv)return;
    if(event.keyCode===10009||event.key==='Escape'){
      save();screensaver(false);
      if(window.tizen&&tizen.application)tizen.application.getCurrentApplication().exit();
    }else if(event.keyCode===13||event.keyCode===10252){paused=!paused;updatePause();screensaver(!paused);}
    else if(event.keyCode===37||event.keyCode===39)setMode(mode==='pixel'?'cutout':'pixel');
  });
  window.addEventListener('pagehide',function(){save();screensaver(false);});
  background.onload=function(){loaded=true;report('Ready · compare movement styles and original versus faster pace.');screensaver(tv&&!paused);};
  background.onerror=function(){failed=true;report('The background could not load. Keep the artwork beside the study files and reload.');if(tv)document.body.removeAttribute('data-tv');};
  background.src='assets/town-background.jpg';
  window.MagicWindowStudy={getState:function(){return{loaded:loaded,failed:failed,mode:mode,pace:pace,paused:paused,seconds:seconds};}};
  frame=requestAnimationFrame(animate);
})();
