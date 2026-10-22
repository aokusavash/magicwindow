(function(root){
  'use strict';
  var H=182,views=['rear','rear45','side','front45','front'];
  function mix(a,b,t){return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
  function pose(state){
    var H=182*(state.bodyScale||1),proportions=state.proportions||{};
    var local=root.PaintedGaits.pose({id:'resident',gait:'relaxed',x:0,y:0,height:H,baseHeight:H,direction:1,distance:state.distance,travelX:1,travelY:0,view:'side',turnScale:1,walkWeight:1,bend:0,breath:0,grip:0,armSwing:state.walkWeight>.01},root.PaintedLayered.meshes);
    var w=state.walkWeight,dy=(-H*.525-local.hips.y)*(1-w);local.hips.y+=dy;
    [local.shoulders,local.head,local.nose,local.bag].forEach(function(p){p.y+=dy;});
    local.legs.forEach(function(l,i){
      var x=-H*.0125+(i?-2:2),m=root.PaintedLayered.meshes[i],scale=H/m.referenceHeight,ball=m.box.width*.30*scale,toe=m.box.width*.28*scale;
      var rest={hip:{x:x,y:local.hips.y},knee:{x:x+H*.008,y:(local.hips.y-H*.05)/2},ankle:{x:x,y:-H*.05},foot:{x:x,y:0},ball:{x:x+ball,y:0},toe:{x:x+ball+toe,y:0},heel:{x:x-m.box.width*.37*scale,y:0}};
      Object.keys(rest).forEach(function(k){var walking={x:l[k].x,y:l[k].y+dy*(k==='hip'?1:0)};l[k]=mix(rest[k],walking,w);});
    });
    local.arms.forEach(function(a){Object.keys(a).forEach(function(k){if(a[k]&&typeof a[k]==='object')a[k].y+=dy;});});
    if(proportions.legs&&proportions.legs!==1){
      var settle=local.hips.y*(proportions.legs-1);local.hips.y+=settle;
      local.legs.forEach(function(l){['hip','knee','ankle','foot','ball','toe','heel'].forEach(function(k){l[k].y*=proportions.legs;});});
      [local.shoulders,local.head,local.nose,local.bag].forEach(function(p){p.y+=settle;});
      local.arms.forEach(function(a){['shoulder','elbow','hand','tip'].forEach(function(k){a[k].y+=settle;});});
    }
    if(proportions.headRise){local.head.y-=H*proportions.headRise;local.nose.y-=H*proportions.headRise;}
    if(proportions.arms)local.arms.forEach(function(a){['elbow','hand','tip'].forEach(function(k){a[k].x=a.shoulder.x+(a[k].x-a.shoulder.x)*proportions.arms;a[k].y=a.shoulder.y+(a[k].y-a.shoulder.y)*proportions.arms;});});
    function point(node,lateral,bias){
      var along=node.x-(bias||0),p=state.route.sample(state.s+state.sign*along),nx=p.dz*state.sign,nz=-p.dx*state.sign;
      if(state.phase==='hidden-turn'||state.phase==='street-turn'){p={x:state.x+Math.sin(state.heading)*along,z:state.z+Math.cos(state.heading)*along};nx=Math.cos(state.heading);nz=-Math.sin(state.heading);}
      var x=p.x+nx*lateral,z=p.z+nz*lateral,center=root.AlleyWorld.project(p.x,p.z,-node.y);
      var projected=root.AlleyWorld.project(x,z,-node.y);
      // These painted characters use a flat camera-facing body, not a fully
      // modeled volume. Project the route in perspective, but keep body-width
      // offsets in its local image plane. Projecting each foot's lateral depth
      // toward the scene's off-center vanishing point shifted one foot forward
      // and the other backward, creating a growing limp on the left. Evaluate
      // this at the foot's route position, so a planted contact stays fixed.
      projected.x=center.x+nx*lateral*center.scale;
      return Object.assign(projected,{depth:z});
    }
    var q={hips:point(local.hips,0),shoulders:point(local.shoulders,0),head:point(local.head,0),legs:[],arms:[]};
    local.legs.forEach(function(l,i){
      var out={},lateral=(i?-1:1)*H*.055;
      ['hip','knee','ankle','foot','ball','toe','heel'].forEach(function(k){out[k]=point(l[k],lateral,i?-2:2);});
      // The painted pelvis is flat, just like the torso. Off-axis perspective
      // on its two hip roots pulled them apart toward the left of the street.
      // Attach both roots in the torso's camera plane, tapering the correction
      // through the knee to zero at the ankle. This affine shear preserves a
      // straight leg and leaves the projected ground targets untouched.
      var dx=q.hips.x+Math.cos(state.heading)*lateral*q.hips.scale-out.hip.x,dy=q.hips.y-out.hip.y;
      var kneeWeight=(out.ankle.y-out.knee.y)/(out.ankle.y-out.hip.y);
      out.hip.x+=dx;out.hip.y+=dy;
      out.knee.x+=dx*kneeWeight;out.knee.y+=dy*kneeWeight;
      q.legs.push(out);
    });
    local.arms.forEach(function(a,i){
      // Both anatomical shoulders share a fore/aft plane. The old far-shoulder
      // offset put its entire sleeve in front of the chest when facing right.
      var out={},fore=local.hips.x-H*.01-H*.045*Math.abs(Math.sin(state.heading)),bias=a.shoulder.x-fore;
      var settle=H*.025*Math.pow(Math.max(0,Math.cos(state.heading)),2);
      ['shoulder','elbow','hand','tip'].forEach(function(k){
        var n={x:a.shoulder.x+(a[k].x-a.shoulder.x)*w,y:a[k].y+settle},lateral=(i?-1:1)*H*.095*(proportions.width||1),p=point(n,lateral,bias),scale=q.hips.scale,along=n.x-bias-local.hips.x;
        // The torso is a painted billboard. Project its attached arms in that
        // same local camera plane: full off-axis perspective on only the arms
        // pulled the far sleeve outside the jacket, especially facing left.
        // Retain world depth for overlaps and route-based targets for feet.
        p.x=q.hips.x+(Math.sin(state.heading)*along+Math.cos(state.heading)*lateral)*scale;
        p.y=q.hips.y+(n.y-local.hips.y)*scale;out[k]=p;
      });q.arms.push(out);
    });
    var c=root.AlleyWorld.project(state.x,state.z),sin=Math.sin(state.heading);
    q.bag=point(local.bag,H*.11);q.bagBehind=sin<0;q.ground=c;
    return {p:{id:'resident',x:c.x,y:c.y,height:H*c.scale,baseHeight:H*c.scale,direction:sin<0?-1:1,view:'side',turnScale:1,bend:0},q:q,local:local};
  }
  function facing(angle){
    var a=Math.abs(Math.atan2(Math.sin(angle),Math.cos(angle))),unit=a/(Math.PI/4),lo=Math.min(3,Math.floor(unit)),weight=root.AlleyWorld.ease((unit-lo-.25)/.5);
    return [{name:views[lo],weight:1-weight},{name:views[lo+1],weight:weight}].filter(function(v){return v.weight>.0001;});
  }
  function buildMesh(box,kind,index,name,registration){
    registration=registration||{};
    var w=box.width,h=box.height,b=kind==='arm'?(index?5:2):(index?11:8),bones=Array.from({length:kind==='arm'?14:16},function(){return [[0,0],[0,1]];}),vertices=[],triangles=[],nx=kind==='arm'?1:4,ny=20;
    if(kind==='arm'){
      [0,1].forEach(function(i){var a=i?5:2;var sx=w*(registration.shoulderX||.44),ex=w*(registration.elbowX||.44),hx=w*(registration.handX||.54),tx=w*(registration.tipX||.60);bones[a]=[[sx,h*.10],[ex,h*.50]];bones[a+1]=[[ex,h*.50],[hx,h*.78]];bones[a+2]=[[hx,h*.78],[tx,h*.99]];});
    }else{
      var quarter=name==='front45'||name==='rear45'||name==='side',rear=name==='rear'||name==='rear45';
      var ankleY=registration.ankleY||(name==='front45'?.86:name==='front'?.89:name==='rear45'?.90:.91);
      var hip=[w*(registration.hipX||(quarter?.62:.50)),h*.06],knee=[w*(registration.kneeX||(quarter?.46:.50)),h*((ankleY+.06)/2)],ankle=[w*(registration.ankleX||(quarter?.30:.50)),h*ankleY];
      var sole=quarter?[w*.28,h*(rear?.99:.94)]:[w*.50,h*(rear?1:.965)],ball=quarter?[w*.67,h*(rear?.965:.975)]:[w*.50,h*(rear?.96:.99)],toe=quarter?[w*.98,h*(rear?.94:.995)]:[w*.50,h*(rear?.94:1)];
      [0,1].forEach(function(i){var a=i?11:8;bones[a]=[hip,knee];bones[a+1]=[knee,ankle];bones[a+2]=[sole,ball];bones[14+i]=[ball,toe];});
    }
    for(var row=0;row<=ny;row++)for(var col=0;col<=nx;col++){
      var t=row/ny,e=kind==='arm'?root.AlleyWorld.ease((t-.43)/.14):root.AlleyWorld.ease((t-.43)/.12),f=kind==='arm'?root.AlleyWorld.ease((t-.74)/.10):root.AlleyWorld.ease((t-(ankleY-.03))/.05),weights;
      if(kind==='arm')weights=[[b,(1-e)*(1-f)],[b+1,e*(1-f)],[b+2,f]];
      else{weights=[[b,1-e],[b+1,e]];}
      vertices.push([w*col/nx,h*t,weights.filter(function(a){return a[1]>0;})]);
    }
    for(var y=0;y<ny;y++)for(var x=0;x<nx;x++){var a=y*(nx+1)+x;triangles.push([a,a+1,a+nx+2],[a,a+nx+2,a+nx+1]);}
    return {box:box,bones:bones,vertices:vertices,triangles:triangles,referenceHeight:kind==='arm'?h*.90/.35:h*(ankleY-.06)/.48};
  }
  function renderer(ctx,images,frames,options){
    var compact=options&&options.compact,width=compact?256:1600,height=compact?384:900,ox=0,oy=0;
    var piece=document.createElement('canvas'),blend=document.createElement('canvas'),torso=document.createElement('canvas'),legLayer=document.createElement('canvas');
    [piece,blend,torso,legLayer].forEach(function(c){c.width=width;c.height=height;});
    var brush=piece.getContext('2d'),composite=blend.getContext('2d'),torsoBrush=torso.getContext('2d'),legBrush=legLayer.getContext('2d'),cache={},commands=[];
    // Keep the source torso coverage beneath moving sleeves. Trimming away
    // baked sleeves without underpaint exposed the scenery through her jacket.
    function compactMesh(m){
      if(!compact)return m;
      // Within a run of identical bone weights the painting is one affine
      // surface. Intermediate rows add draw calls without changing its shape.
      // Keep every changing-weight row, including knees, ankles and toe flex.
      var stride=1;while(stride<m.vertices.length&&m.vertices[stride][1]===m.vertices[0][1])stride++;
      var rows=m.vertices.length/stride,keys=[],keep=[0],triangles=[];
      for(var r=0;r<rows;r++)keys.push(JSON.stringify(m.vertices.slice(r*stride,(r+1)*stride).map(function(v){return v[2];})));
      for(var r=1;r<rows-1;r++)if(keys[r]!==keys[r-1]||keys[r]!==keys[r+1])keep.push(r);
      keep.push(rows-1);
      for(var r=1;r<keep.length;r++){
        var first=keep[r-1]*stride,last=keep[r]*stride,key=JSON.stringify(m.vertices[first][2]);
        var affine=keys[keep[r-1]]===keys[keep[r]]&&m.vertices.slice(first,first+stride).every(function(v){return JSON.stringify(v[2])===key;});
        if(affine)triangles.push([first,first+stride-1,last+stride-1],[first,last+stride-1,last]);
        else for(var c=0;c<stride-1;c++){var a=first+c,b=last+c;triangles.push([a,a+1,b+1],[a,b+1,b]);}
      }
      return Object.assign({},m,{triangles:triangles});
    }
    function crop(image,box){var c=document.createElement('canvas');c.width=box.width;c.height=box.height;c.getContext('2d').drawImage(image,box.x,box.y,box.width,box.height,0,0,box.width,box.height);return c;}
    views.forEach(function(name){
      var data={arms:[],legs:[]};
      if(options&&options.views){cache[name]=options.views[name];if(compact){cache[name].arms.forEach(function(a){a.mesh=compactMesh(a.mesh);});cache[name].legs.forEach(function(l){l.mesh=compactMesh(l.mesh);});}return;}
      if(name==='side'){
        data.body={image:images.sideUpper,box:{x:205,y:31,width:429,height:819},pivot:264/429};
        [0,1].forEach(function(i){data.arms.push({mesh:root.PaintedLayered.arms[i],texture:crop(images.sideUpper,root.PaintedLayered.arms[i].box)});data.legs.push({mesh:root.PaintedLayered.meshes[i],texture:crop(images.sideLegs,root.PaintedLayered.meshes[i].box)});});
      }else{
        data.body={image:images[name],box:frames[name][0],pivot:name==='rear45'?.58:name==='front45'?.64:.50};
        var legBox=frames.legs[{front45:0,rear45:1,front:2,rear:3}[name]];
        [0,1].forEach(function(i){
          data.arms.push({mesh:buildMesh(frames[name][1+i],'arm',i,name),texture:crop(images[name],frames[name][1+i])});
          var texture=crop(images.legs,legBox),cut=name==='front45'?.86:name==='front'?.89:name==='rear45'?.90:.91;
          texture.getContext('2d').clearRect(0,legBox.height*cut,legBox.width,legBox.height);
          data.legs.push({mesh:buildMesh(legBox,'leg',i,name),texture:texture,shoe:{image:images.legs,box:legBox,ankleY:cut,ankleX:name.indexOf('45')>=0?.30:.50}});
        });
      }if(compact){data.arms.forEach(function(a){a.mesh=compactMesh(a.mesh);});data.legs.forEach(function(l){l.mesh=compactMesh(l.mesh);});}cache[name]=data;
    });
    function mesh(item,p,q,physical){
      // Rebind a source left/right limb to the physical leg/arm it depicts.
      var target=q;
      if(physical!==undefined){target=Object.assign({},q,{legs:[q.legs[physical],q.legs[physical]],arms:[q.arms[physical],q.arms[physical]]});}
      var points=root.PaintedSkin.deform(item.mesh,p,target),isArm=item.mesh.bones.length===14,limb=isArm?q.arms[physical]:q.legs[physical];
      // A painted limb is one continuous surface. Sorting its individual
      // triangles through the torso produced horizontal holes and stripes.
      var depth=isArm?(limb.shoulder.depth+limb.elbow.depth+limb.hand.depth)/3:(limb.hip.depth+limb.knee.depth+limb.ankle.depth)/3;
      commands.push({depth:depth,paint:function(){
        var targetBrush=isArm?brush:legBrush;
        if(!isArm)legBrush.clearRect(ox,oy,width,height);
        item.mesh.triangles.forEach(function(t){root.PaintedSkin.triangle(targetBrush,item.texture,t.map(function(i){return item.mesh.vertices[i];}),t.map(function(i){return points[i];}),.65);});
        if(!isArm){
          // Cloth coverage is not anatomical depth: the jacket stays over the
          // trouser roots even when a stepping leg comes nearer the camera.
          // Use its actual alpha silhouette, preserving holes/open space and
          // keeping arm/leg/bag depth ordering unchanged everywhere else.
          legBrush.globalCompositeOperation='destination-out';legBrush.drawImage(torso,ox,oy);legBrush.globalCompositeOperation='source-over';
          brush.drawImage(legLayer,ox,oy);
        }
      }});
    }
    function bag(p,q){var b=root.PaintedRigFrames.parts.resident[7],h=p.height,w=h*.18;brush.drawImage(images.props,b.x,b.y,b.width,b.height,q.bag.x-w/2,q.bag.y,w,h*.14);}
    function view(name,actor,state){
      var p=actor.p,q=actor.q,data=cache[name],back=Math.cos(state.heading)>0,mirror=p.direction<0,source0=(back?1:0)^(mirror?1:0);
      var near=Math.sin(state.heading)>=0?0:1,far=1-near;
      commands=[];
      var body=actor.cleanBody&&name==='rear45'&&images.contactBody?{image:images.contactBody,box:{x:102,y:27,width:360,height:713},pivot:.58}:data.body;
      // Seated actions need a torso without the resting sleeves painted in.
      // These optional assets leave the accepted walking renderer unchanged.
      if(actor.diningBody&&name==='front'&&images.frontMealBody)body={image:images.frontMealBody,box:{x:144,y:19,width:372,height:666},pivot:.50};
      if(actor.diningBody&&name==='rear'&&images.rearMealBody)body={image:images.rearMealBody,box:{x:122,y:28,width:367,height:709},pivot:.50};
      var bodyBox=body.box,bodyScale=p.height*(body.height||.54)/bodyBox.height;
      torsoBrush.clearRect(ox,oy,width,height);torsoBrush.save();torsoBrush.translate(q.hips.x,q.hips.y+p.height*.02);if(actor.lean)torsoBrush.rotate(actor.lean);torsoBrush.scale(p.direction*bodyScale,bodyScale);
      if(actor.headDip&&actor.diningBody&&(name==='front'||name==='rear')){
        // The head is part of the source portrait. Articulate it at the neck
        // over the stationary collar; overlap covers the join during the nod.
        var cut=bodyBox.height*(body.neckCut||(name==='front'?.49:.455)),neck=-bodyBox.height+cut;
        torsoBrush.drawImage(body.image,bodyBox.x,bodyBox.y+cut,bodyBox.width,bodyBox.height-cut,-bodyBox.width*body.pivot,neck,bodyBox.width,bodyBox.height-cut);
        torsoBrush.save();torsoBrush.translate(0,neck+p.height*.025*actor.headDip/bodyScale);torsoBrush.scale(1,1-.035*actor.headDip);
        torsoBrush.drawImage(body.image,bodyBox.x,bodyBox.y,bodyBox.width,cut,-bodyBox.width*body.pivot,-cut,bodyBox.width,cut);torsoBrush.restore();
      }else torsoBrush.drawImage(body.image,bodyBox.x,bodyBox.y,bodyBox.width,bodyBox.height,-bodyBox.width*body.pivot,-bodyBox.height,bodyBox.width,bodyBox.height);
      torsoBrush.restore();
      if(options&&options.paintGarment&&data.garment){torsoBrush.save();torsoBrush.globalCompositeOperation='destination-over';options.paintGarment(torsoBrush,data.garment,actor,state,name);torsoBrush.restore();}
      [far,near].forEach(function(i){
        var source=name==='side'?(i===near?0:1):(i===0?source0:1-source0),item=data.legs[source];mesh(item,p,q,i);
        if(item.shoe){var shoe=item.shoe,b=shoe.box,cut=shoe.ankleY-.025,scale=p.height/item.mesh.referenceHeight,ankle=q.legs[i].ankle,roll=actor.local.legs[i].pitch*state.walkWeight*Math.sin(Math.abs(state.heading))*.35;
          commands.push({depth:ankle.depth,paint:function(){brush.save();brush.translate(ankle.x,ankle.y);brush.rotate(p.direction*roll);brush.scale(p.direction*scale*(shoe.widthScale||1),scale*(shoe.heightScale||1));brush.drawImage(shoe.image,b.x,b.y+b.height*cut,b.width,b.height*(1-cut),-b.width*shoe.ankleX,-b.height*(shoe.ankleY-cut),b.width,b.height*(1-cut));brush.restore();}});
        }
      });
      mesh(data.arms[name==='side'?1:(far===0?source0:1-source0)],p,q,far);
      commands.push({depth:q.hips.depth,paint:function(){
        brush.drawImage(torso,ox,oy);
        // Front/quarter/side paintings already carry the shoulder strap. Only
        // add the absent rear strap, rather than drawing a second one from the
        // middle of her neck over every view.
        if(!(options&&options.hideBag)&&(name==='rear'||name==='rear45')){brush.strokeStyle='#67392f';brush.lineWidth=p.height*.011;brush.beginPath();brush.moveTo(q.arms[1].shoulder.x,q.arms[1].shoulder.y);brush.lineTo(q.bag.x,q.bag.y+p.height*.03);brush.stroke();}
      }});
      mesh(data.arms[name==='side'?0:(near===0?source0:1-source0)],p,q,near);
      // Sort the visible face of this bulky prop, not its suspension point.
      // Otherwise the entire bag can disappear INSIDE the near trouser leg.
      if(!(options&&options.hideBag))commands.push({depth:q.bag.depth-H*.09,paint:function(){bag(p,q);}});
      commands.sort(function(a,b){return b.depth-a.depth;}).forEach(function(c){c.paint();});
    }
    return function(state){
      var actor=options&&options.pose?options.pose(state):pose(state);ox=compact?Math.floor(actor.p.x-width/2):0;oy=compact?Math.floor(actor.p.y-actor.p.height*1.10-12):0;
      if(compact&&options&&options.views)oy=Math.min(oy,Math.floor(actor.q.hips.y-actor.p.height*.76-16));
      [brush,torsoBrush,legBrush].forEach(function(c){c.setTransform(1,0,0,1,-ox,-oy);});
      composite.clearRect(0,0,width,height);composite.globalCompositeOperation='lighter';
      facing(state.heading).forEach(function(v){brush.clearRect(ox,oy,width,height);view(v.name,actor,state);composite.globalAlpha=v.weight;composite.drawImage(piece,0,0);});
      composite.globalAlpha=1;ctx.drawImage(blend,ox,oy);actor.bounds={x:ox,y:oy,width:width,height:height};return actor;
    };
  }
  var api={pose:pose,facing:facing,renderer:renderer,buildMesh:buildMesh};root.AlleyActor=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
