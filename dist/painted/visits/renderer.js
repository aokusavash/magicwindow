(function(root){
  'use strict';
  function renderer(canvas,images,options){
    var scene=document.createElement('canvas'),layer=document.createElement('canvas');scene.width=layer.width=1600;scene.height=layer.height=900;
    var ctx=scene.getContext('2d',{alpha:false}),actorCtx=layer.getContext('2d'),output=canvas.getContext('2d',{alpha:false});
    var drawActor=options&&options.actorRenderer?options.actorRenderer(actorCtx):root.AlleyActor.renderer(actorCtx,images,root.AlleyFrames,{compact:true,pose:root.VisitPose.pose}),previousBounds;
    var d=root.VisitWorld.door;
    // Local entrance study: opaque architecture, moving leaf and fixed
    // transparent props. No lantern or foliage is sampled into the leaf.
    function asset(box,x,y,w,h){ctx.drawImage(images.entrance,box[0],box[1],box[2],box[3],x,y,w,h);}
    function foreground(){
      if(!images.entrance)return;
      asset([906,118,259,776],43,468,39,117);
      asset([1224,405,417,506],0,575,101,137);
    }
    function door(open){
      if(images.entrance){
        asset([164,171,247,690],50,468,98,240);
        ctx.save();ctx.beginPath();ctx.rect(d.x,d.y,d.width,d.height);ctx.clip();
        ctx.drawImage(images.interior,d.x,d.y,d.width,d.height);
        asset([560,168,273,736],d.x-d.travel*open,d.y,d.width,d.height);ctx.restore();
      }else if(open>.0001){
        ctx.save();ctx.beginPath();ctx.rect(d.x,d.y,d.width,d.height);ctx.clip();ctx.drawImage(images.interior,d.x,d.y,d.width,d.height);ctx.restore();
      }
      var hx=d.handleX-d.travel*open;ctx.fillStyle='#443728';ctx.fillRect(hx-3,d.handleY-11,6,22);ctx.fillStyle='#b89559';ctx.fillRect(hx-1,d.handleY-9,3,18);
    }
    function meal(actor){
      var m=actor.meal;if(!m||m.hidden||m.alpha<.001)return;
      var x=m.bowl.x,y=m.bowl.y,c=actorCtx;
      c.save();c.globalAlpha=m.alpha;
      var glaze=c.createLinearGradient(x,y-3,x+3,y+8);glaze.addColorStop(0,'#f0dfb7');glaze.addColorStop(.6,'#d7bc89');glaze.addColorStop(1,'#91603e');
      c.save();c.translate(x,y);c.scale(1,1-.25*m.sip);c.translate(-x,-y);
      c.fillStyle=glaze;c.beginPath();c.moveTo(x-10,y);c.quadraticCurveTo(x-8,y+8,x,y+8);c.quadraticCurveTo(x+8,y+8,x+10,y);c.fill();
      c.fillStyle='#f7e3b8';c.beginPath();c.ellipse(x,y,10,3,0,0,Math.PI*2);c.fill();c.fillStyle=m.broth>.1?'#a66c32':'#e4cc9f';c.beginPath();c.ellipse(x,y,8,2,0,0,Math.PI*2);c.fill();
      c.save();c.globalAlpha*=m.broth;c.strokeStyle='#e9c36c';c.lineWidth=.7;for(var i=0;i<3;i++){c.beginPath();c.ellipse(x-3+i*3,y,2.5,1,0,0,Math.PI*1.6);c.stroke();}
      c.fillStyle='#477443';c.fillRect(x+3,y-1.5,2,1.5);c.fillRect(x-5,y-.5,2,1.5);c.restore();c.restore();
      c.strokeStyle='rgba(238,218,181,.3)';c.lineWidth=.65;
      for(var i=0;i<2;i++){var sway=Math.sin(m.time*1.3+i*2)*1.1;c.beginPath();c.moveTo(x-3+i*5,y-4);c.bezierCurveTo(x+sway+i*3,y-9,x-5-sway+i*4,y-12,x-2+i*4,y-17);c.stroke();}
      if(m.lift>.15&&m.noodle>.05){
        c.strokeStyle='#e8ca7b';c.lineWidth=.65;var end=m.tip.y+(Math.min(y-2,m.tip.y+4+m.lift*9)-m.tip.y)*m.noodle;
        for(var i=0;i<2;i++){c.beginPath();c.moveTo(m.tip.x+i*1.5,m.tip.y+1);c.bezierCurveTo(m.tip.x+2+i,m.tip.y+6,m.tip.x-2+i,end-3,m.tip.x+i,end);c.stroke();}
      }
      c.save();c.globalAlpha*=m.chopsticks;c.strokeStyle='#68452d';c.lineWidth=.8;c.lineCap='round';
      for(var i=0;i<2;i++){c.beginPath();c.moveTo(m.hand.x-2+i*1.8,m.hand.y-1);c.lineTo(m.tip.x+i*.7,m.tip.y);c.stroke();}c.restore();
      if(m.finish>.001){c.globalAlpha=m.alpha*m.finish;c.strokeStyle='#68452d';c.lineWidth=.8;for(var i=0;i<2;i++){c.beginPath();c.moveTo(m.tableBowl.x+12,m.tableBowl.y+2+i*1.5);c.lineTo(m.tableBowl.x+25,m.tableBowl.y+i*1.5);c.stroke();}}c.restore();
    }
    function person(state,inside){
      if(state.inFrame===false||state.hidden)return;
      if(previousBounds)actorCtx.clearRect(previousBounds.x,previousBounds.y,previousBounds.width,previousBounds.height);
      if(!inside){var p=state.ground||root.AlleyWorld.project(state.x,state.z),height=state.height||182*p.scale;actorCtx.fillStyle='rgba(44,39,27,.18)';actorCtx.beginPath();actorCtx.ellipse(p.x,p.y+1-(state.seat||0)*16,height*.14,Math.max(1,height*.014),0,0,Math.PI*2);actorCtx.fill();}
      var actor=drawActor(state),b=actor.bounds;previousBounds=b;meal(actor);
      actorCtx.save();actorCtx.beginPath();actorCtx.rect(b.x,b.y,b.width,b.height);actorCtx.clip();
      if(inside){
        // Reveal the SAME resident only through the doorway and the open upper
        // counter window. The painted wall, sill, stools and mullions occlude her.
        actorCtx.globalCompositeOperation='destination-in';actorCtx.fillStyle='#000';actorCtx.beginPath();if(d.travel*state.door>3)actorCtx.rect(d.x+d.width-d.travel*state.door+1,d.y+2,d.travel*state.door-3,d.height-1);actorCtx.rect(155,531,104,66);actorCtx.rect(269,531,102,66);actorCtx.fill();
        actorCtx.globalCompositeOperation='source-atop';actorCtx.fillStyle='rgba(227,157,64,.10)';actorCtx.fillRect(b.x,b.y,b.width,b.height);
      }else if(state.zone===undefined){
        // Alley masks describe the buildings beside THAT passage. A visitor
        // on the ramen doorstep must not inherit the alley's broad frontage
        // mask simply because both ground positions have similar depth.
        actorCtx.globalCompositeOperation='destination-out';actorCtx.fillStyle='#000';root.AlleyOcclusion.active(state,'alley').forEach(function(o){actorCtx.beginPath();o.outline.forEach(function(v,i){if(i)actorCtx.lineTo(v[0],v[1]);else actorCtx.moveTo(v[0],v[1]);});actorCtx.closePath();actorCtx.fill();});
      }actorCtx.restore();
      var x=Math.max(0,b.x),y=Math.max(0,b.y),w=Math.min(1600,b.x+b.width)-x,h=Math.min(900,b.y+b.height)-y;if(w>0&&h>0)ctx.drawImage(layer,x,y,w,h,x,y,w,h);
    }
    return function(population,focus){
      ctx.drawImage(images.background,0,0,1600,900);var visitor=population.find(function(s){return s.id==='ramen-visitor';}),open=visitor?visitor.door:0;door(open);
      if(options&&options.seats)options.seats(ctx,population);
      population.filter(function(s){return s.zone==='interior';}).forEach(function(s){person(s,true);});
      var outside=population.filter(function(s){return s.zone!=='interior';}).sort(function(a,b){return b.z-a.z||a.id.localeCompare(b.id);});
      outside.filter(function(s){return (s.ground||root.AlleyWorld.project(s.x,s.z)).y<716;}).forEach(function(s){person(s,false);});
      foreground();
      outside.filter(function(s){return (s.ground||root.AlleyWorld.project(s.x,s.z)).y>=716;}).forEach(function(s){person(s,false);});
      var crop=typeof focus==='object'?focus:focus==='ramen'?{x:0,y:430,w:640,h:360}:focus==='flowers'?{x:350,y:450,w:640,h:360}:{x:0,y:0,w:1600,h:900};
      output.drawImage(scene,crop.x,crop.y,crop.w,crop.h,0,0,1600,900);
    };
  }
  root.VisitRenderer={renderer:renderer};
})(typeof window!=='undefined'?window:globalThis);
