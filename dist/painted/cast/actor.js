(function(root){
  'use strict';
  var names=['front','front45','side','rear45','rear'];
  function crop(image,b){var c=document.createElement('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(image,b.x,b.y,b.width,b.height,0,0,b.width,b.height);return c;}
  function views(image,frames,profile){
    var out={};names.forEach(function(name){
      var f=frames[name],data={body:{image:image,box:f.body,pivot:name==='side'?.56:name==='front45'?.56:name==='rear45'?.54:.5,height:profile.id==='child'?.62:.54,neckCut:f.neckCut},arms:[],legs:[]};
      if(profile.bodyWidth)data.body.widthScale=profile.bodyWidth;
      if(profile.bodyHeight)data.body.height=profile.bodyHeight;
      if(profile.id==='tall'&&f.waistX)data.body.pivot=f.waistX;
      if(profile.headBack)data.body.headBack=profile.headBack[name]||0;
      f.arms.forEach(function(b,i){var mesh=root.AlleyActor.buildMesh(b,'arm',i,name,f.armAnchors[i]);mesh.widthScale=profile.armWidth||(profile.id==='child'?.82:.95);data.arms.push({mesh:mesh,texture:crop(image,b)});});
      f.legs.forEach(function(b,i){
        var anchors=f.legAnchors[i],mesh=root.AlleyActor.buildMesh(b,'leg',i,name,anchors),cut=anchors.ankleY,texture=crop(image,b);mesh.widthScale=profile.legWidth||(profile.id==='child'?.60:profile.id==='yukata'?.65:.9);
        texture.getContext('2d').clearRect(0,b.height*cut,b.width,b.height);
        data.legs.push({mesh:mesh,texture:texture,shoe:{image:image,box:b,ankleY:cut,ankleX:anchors.ankleX,contactRoll:profile.contactFeet&&name==='side',widthScale:profile.shoeWidth||(profile.id==='child'?.55:profile.id==='yukata'?.55:.83),heightScale:.05*(cut-.06)/(.48*(1-cut))}});
      });
      if(f.garment)data.garment={image:image,box:f.garment};out[name]=data;
    });return out;
  }
  function garment(ctx,item,actor,state,name){
    var q=actor.q,h=actor.p.height,b=item.box;
    var side=Math.abs(Math.sin(state.heading)),width=h*(.16-.045*side);
    var hemX=(q.legs[0].ankle.x+q.legs[1].ankle.x)/2,hemY=(q.legs[0].ankle.y+q.legs[1].ankle.y)/2-h*.012;
    var sway=Math.sin(state.distance/(182*(state.bodyScale||1))/.3*Math.PI)*h*.012*state.walkWeight;
    var hemWidth=width+Math.min(h*.045,Math.abs(q.legs[0].ankle.x-q.legs[1].ankle.x)*.12);
    var texture=item.texture||(item.texture=crop(item.image,b)),nx=4,ny=8;
    function point(col,row){var t=row/ny,u=col/nx,center=q.hips.x+(hemX-q.hips.x)*t+sway*t*t,w=width+(hemWidth-width)*t;return [center+(u-.5)*w*2,q.hips.y-h*.025+(hemY-q.hips.y+h*.025)*t+Math.sin(u*Math.PI)*h*.006*t*t];}
    for(var y=0;y<ny;y++)for(var x=0;x<nx;x++){
      var source=[[b.width*x/nx,b.height*y/ny],[b.width*(x+1)/nx,b.height*y/ny],[b.width*(x+1)/nx,b.height*(y+1)/ny],[b.width*x/nx,b.height*(y+1)/ny]],target=[point(x,y),point(x+1,y),point(x+1,y+1),point(x,y+1)];
      // Mirroring is geometry, not a second independently generated garment.
      if(actor.p.direction<0)target=target.map(function(p){return [2*(q.hips.x+(hemX-q.hips.x)*(p[1]-q.hips.y)/(hemY-q.hips.y||1))-p[0],p[1]];});
      [[0,1,2],[0,2,3]].forEach(function(t){root.PaintedSkin.triangle(ctx,texture,t.map(function(i){return source[i];}),t.map(function(i){return {x:target[i][0],y:target[i][1]};}),.5);});
    }
  }
  function renderer(ctx,images,manifests){
    var renderers={};root.CastWorld.ids.forEach(function(id){
      var p=root.CastWorld.profiles[id],opts={compact:true,pose:root.VisitPose.pose,hideBag:!!p.hideBag};
      if(p.art){opts.views=views(images[p.art],manifests[p.art],p);opts.paintGarment=garment;}
      renderers[id]=root.AlleyActor.renderer(ctx,p.art?{}:images,root.AlleyFrames,opts);
    });return function(state){return renderers[state.character||'original'](state);};
  }
  function seats(ctx,population){population.forEach(function(s){if(s.character==='child'&&s.table==='outside'&&s.seat>0){ctx.fillStyle='#8f7450';ctx.fillRect(218,612,28,11);ctx.fillStyle='#d3aa69';ctx.fillRect(218,610,28,4);}});}
  root.CastActor={renderer:renderer,views:views,garment:garment,seats:seats};
})(typeof window!=='undefined'?window:globalThis);
