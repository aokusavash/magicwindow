(function(root){
  'use strict';
  function renderer(canvas,images){
    var scene=document.createElement('canvas'),layer=document.createElement('canvas');scene.width=layer.width=1600;scene.height=layer.height=900;
    var ctx=scene.getContext('2d',{alpha:false}),actorCtx=layer.getContext('2d'),output=canvas.getContext('2d',{alpha:false});
    var drawActor=root.AlleyActor.renderer(actorCtx,images,root.AlleyFrames,{compact:true,pose:root.VisitPose.pose}),previousBounds;
    var d=root.VisitWorld.door;
    function plate(x,y,w,h){ctx.drawImage(images.background,x/1600*images.background.width,y/900*images.background.height,w/1600*images.background.width,h/900*images.background.height,x,y,w,h);}
    function door(open){
      if(open>.0001){ctx.save();ctx.beginPath();ctx.rect(d.x,d.y,d.width,d.height);ctx.clip();ctx.drawImage(images.interior,d.x,d.y,d.width,d.height);
        ctx.drawImage(images.background,d.x/1600*images.background.width,d.y/900*images.background.height,d.width/1600*images.background.width,d.height/900*images.background.height,d.x-d.travel*open,d.y,d.width,d.height);ctx.restore();}
      var hx=d.handleX-d.travel*open;ctx.fillStyle='#443728';ctx.fillRect(hx-3,d.handleY-11,6,22);ctx.fillStyle='#b89559';ctx.fillRect(hx-1,d.handleY-9,3,18);
    }
    function person(state,inside){
      if(state.inFrame===false||state.hidden)return;
      if(previousBounds)actorCtx.clearRect(previousBounds.x,previousBounds.y,previousBounds.width,previousBounds.height);
      if(!inside){var p=state.ground||root.AlleyWorld.project(state.x,state.z),height=182*p.scale;actorCtx.fillStyle='rgba(44,39,27,.18)';actorCtx.beginPath();actorCtx.ellipse(p.x,p.y+1,height*.14,Math.max(1,height*.014),0,0,Math.PI*2);actorCtx.fill();}
      var actor=drawActor(state),b=actor.bounds;previousBounds=b;
      actorCtx.save();actorCtx.beginPath();actorCtx.rect(b.x,b.y,b.width,b.height);actorCtx.clip();
      if(inside){
        // Reveal the SAME resident only through the doorway and the open upper
        // counter window. The painted wall, sill, stools and mullions occlude her.
        actorCtx.globalCompositeOperation='destination-in';actorCtx.fillStyle='#000';actorCtx.beginPath();actorCtx.rect(d.x+d.width-d.travel*state.door+1,d.y+2,d.travel*state.door-3,d.height-1);actorCtx.rect(155,531,104,66);actorCtx.rect(269,531,102,66);actorCtx.fill();
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
      population.filter(function(s){return s.zone==='interior';}).forEach(function(s){person(s,true);});
      if(open>.001){plate(d.x-2,d.y,4,d.height);plate(d.x+d.width-1,d.y,4,d.height);}
      population.filter(function(s){return s.zone!=='interior';}).sort(function(a,b){return b.z-a.z||a.id.localeCompare(b.id);}).forEach(function(s){person(s,false);});
      var crop=focus==='ramen'?{x:0,y:430,w:640,h:360}:focus==='flowers'?{x:350,y:450,w:640,h:360}:{x:0,y:0,w:1600,h:900};
      output.drawImage(scene,crop.x,crop.y,crop.w,crop.h,0,0,1600,900);
    };
  }
  root.VisitRenderer={renderer:renderer};
})(typeof window!=='undefined'?window:globalThis);
