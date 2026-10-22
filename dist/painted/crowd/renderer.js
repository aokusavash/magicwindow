(function(root){
  'use strict';
  function renderer(canvas,images){
    var ctx=canvas.getContext('2d',{alpha:false}),layer=document.createElement('canvas');layer.width=1600;layer.height=900;
    var actorCtx=layer.getContext('2d'),renderActor=root.AlleyActor.renderer(actorCtx,images,root.AlleyFrames,{compact:true}),previousBounds;
    return function(population){
      ctx.drawImage(images.background,0,0,1600,900);
      population.slice().sort(function(a,b){return b.z-a.z||String(a.id||'').localeCompare(String(b.id||''));}).forEach(function(state){
        if(state.inFrame===false||state.hidden)return;
        if(previousBounds)actorCtx.clearRect(previousBounds.x,previousBounds.y,previousBounds.width,previousBounds.height);
        var p=root.AlleyWorld.project(state.x,state.z),height=182*p.scale;
        actorCtx.fillStyle='rgba(44,39,27,.18)';actorCtx.beginPath();actorCtx.ellipse(p.x,p.y+1,height*.14,Math.max(1,height*.014),0,0,Math.PI*2);actorCtx.fill();
        var actor=renderActor(state),b=actor.bounds;previousBounds=b;
        // Mask this person's transparent layer, never repaint the scenery over
        // a scene that already contains other people.
        actorCtx.save();actorCtx.beginPath();actorCtx.rect(b.x,b.y,b.width,b.height);actorCtx.clip();actorCtx.globalCompositeOperation='destination-out';actorCtx.fillStyle='#000';
        root.AlleyOcclusion.active(state,'alley').forEach(function(o){actorCtx.beginPath();o.outline.forEach(function(v,i){if(i)actorCtx.lineTo(v[0],v[1]);else actorCtx.moveTo(v[0],v[1]);});actorCtx.closePath();actorCtx.fill();});actorCtx.restore();
        var x=Math.max(0,b.x),y=Math.max(0,b.y),w=Math.min(1600,b.x+b.width)-x,h=Math.min(900,b.y+b.height)-y;
        if(w>0&&h>0)ctx.drawImage(layer,x,y,w,h,x,y,w,h);
      });
    };
  }
  root.CrowdRenderer={renderer:renderer};
})(typeof window!=='undefined'?window:globalThis);
