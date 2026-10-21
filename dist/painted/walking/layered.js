(function(root){
  'use strict';
  // Complete leg paintings, each with its own silhouette and hidden hip coverage.
  // Neither leg shares vertices or texture pixels with the opposite leg.
  var boxes=[{x:813,y:68,width:219,height:786},{x:1323,y:69,width:228,height:785}];
  function smooth(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}
  function mesh(box,index){
    var w=box.width,h=box.height,hip=[w*.41,h*.06],knee=[w*.40,h*.49],ankle=[w*.40,h*.91],sole=[w*.40,h],ball=[w*.70,h];
    var bones=Array.from({length:16},function(){return [[0,0],[0,1]];});
    [0,1].forEach(function(i){var b=i?11:8;bones[b]=[hip,knee];bones[b+1]=[knee,ankle];bones[b+2]=[sole,ball];bones[14+i]=[ball,[w*.98,h]];});
    var b=index?11:8,vertices=[],triangles=[],nx=4,ny=20;
    for(var row=0;row<=ny;row++)for(var col=0;col<=nx;col++){
      var t=row/ny,k=smooth((t-.43)/.12),f=smooth((t-.88)/.05),toe=smooth((col/nx-.64)/.14);
      vertices.push([w*col/nx,h*t,[[b,(1-k)*(1-f)],[b+1,k*(1-f)],[b+2,f*(1-toe)],[14+index,f*toe]].filter(function(a){return a[1]>0;})]);
    }
    for(var y=0;y<ny;y++)for(var x=0;x<nx;x++){var a=y*(nx+1)+x;triangles.push([a,a+1,a+nx+2],[a,a+nx+2,a+nx+1]);}
    return {box:box,bones:bones,vertices:vertices,triangles:triangles,referenceHeight:h*.85/.48};
  }
  var meshes=boxes.map(mesh);
  function armMesh(box,index){
    var w=box.width,h=box.height,b=index?5:2,shoulder=[w*.44,h*.10],elbow=[w*.44,h*.50],hand=[w*.54,h*.78],tip=[w*.60,h*.99];
    var bones=Array.from({length:14},function(){return [[0,0],[0,1]];}),vertices=[],triangles=[],nx=1,ny=20;
    [0,1].forEach(function(i){var a=i?5:2;bones[a]=[shoulder,elbow];bones[a+1]=[elbow,hand];bones[a+2]=[hand,tip];});
    for(var y=0;y<=ny;y++)for(var x=0;x<=nx;x++){
      var t=y/ny,e=smooth((t-.43)/.14),f=smooth((t-.74)/.10);
      vertices.push([w*x/nx,h*t,[[b,(1-e)*(1-f)],[b+1,e*(1-f)],[b+2,f]].filter(function(a){return a[1]>0;})]);
    }
    for(var r=0;r<ny;r++)for(var c=0;c<nx;c++){var a=r*(nx+1)+c;triangles.push([a,a+1,a+nx+2],[a,a+nx+2,a+nx+1]);}
    return {box:box,bones:bones,vertices:vertices,triangles:triangles,referenceHeight:h*.90/.35};
  }
  var arms=[{x:865,y:165,width:215,height:681},{x:1376,y:169,width:210,height:677}].map(armMesh);
  function renderer(ctx,image,upperImage){
    var textures=boxes.map(function(b){var c=document.createElement('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(image,b.x,b.y,b.width,b.height,0,0,b.width,b.height);return c;});
    var armTextures=upperImage?arms.map(function(m){var b=m.box,c=document.createElement('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(upperImage,b.x,b.y,b.width,b.height,0,0,b.width,b.height);return c;}):[];
    function paint(m,texture,p,q){var points=root.PaintedSkin.deform(m,p,q);m.triangles.forEach(function(t){root.PaintedSkin.triangle(ctx,texture,t.map(function(v){return m.vertices[v];}),t.map(function(v){return points[v];}),.65);});}
    return function(p,q){
      [1,0].forEach(function(i){paint(meshes[i],textures[i],p,q);});
      if(upperImage&&p.gait!=='previous'){
        paint(arms[1],armTextures[1],p,q);
        var bodyScale=p.height*.54/819;
        ctx.save();ctx.translate(q.hips.x,q.hips.y+p.height*.02);ctx.scale(p.direction*bodyScale,bodyScale);
        ctx.drawImage(upperImage,205,31,429,819,-264,-819,429,819);ctx.restore();
        paint(arms[0],armTextures[0],p,q);return;
      }
      // One connected upper painting; resting arms intentionally remain unchanged.
      var scale=p.height/1142;
      ctx.save();ctx.translate(q.hips.x,q.hips.y);ctx.scale(p.direction*scale,scale);
      ctx.drawImage(image,210,29,345,803,-205,-571,345,803);ctx.restore();
    };
  }
  var api={renderer:renderer,meshes:meshes,arms:arms};root.PaintedLayered=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
