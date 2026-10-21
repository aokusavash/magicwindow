(function(root){
  'use strict';
  function targets(p,q,mesh){
    var h=p.height,side=p.view==='side',dir=p.direction;
    var headAngle=p.bend*.4;
    var list=[[q.hips,q.shoulders],[q.head,{x:q.head.x+dir*Math.sin(headAngle)*h*.07,y:q.head.y-Math.cos(headAngle)*h*.07}]];
    q.arms.forEach(function(a){var dx=a.hand.x-a.elbow.x,dy=a.hand.y-a.elbow.y,d=Math.hypot(dx,dy)||1;list.push([a.shoulder,a.elbow],[a.elbow,a.hand],[a.hand,{x:a.hand.x+dx/d*h*.035,y:a.hand.y+dy/d*h*.035}]);});
    q.legs.forEach(function(l,index){
      var rest=mesh.bones[index?13:10],length=Math.hypot(rest[1][0]-rest[0][0],rest[1][1]-rest[0][1])*h/(mesh.referenceHeight||mesh.box.height);
      var foot=side?[l.foot,l.ball||{x:l.foot.x+dir*length,y:l.foot.y}]:[{x:l.foot.x,y:l.foot.y-length},l.foot];
      list.push([l.hip,l.knee],[l.knee,l.ankle],foot);
    });
    if(mesh.bones.length>14)q.legs.forEach(function(l,i){
      var a=list[i?13:10][1],rest=mesh.bones[14+i],length=Math.hypot(rest[1][0]-rest[0][0],rest[1][1]-rest[0][1])*h/(mesh.referenceHeight||mesh.box.height);
      list.push([l.ball||a,l.toe||{x:a.x+dir*length,y:a.y}]);
    });
    return list;
  }
  function deform(mesh,p,q){
    var aim=targets(p,q,mesh),widthScale=p.height/(mesh.referenceHeight||mesh.box.height),mirror=p.view==='side'?p.direction:1;
    var matrices=mesh.bones.map(function(b,i){
      var rx=b[1][0]-b[0][0],ry=b[1][1]-b[0][1],rd=Math.hypot(rx,ry)||1;
      var a=aim[i][0],c=aim[i][1],dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy)||1;
      return {rx:rx/rd,ry:ry/rd,dx:dx/d,dy:dy/d,length:d/rd,ox:b[0][0],oy:b[0][1],x:a.x,y:a.y};
    });
    return mesh.vertices.map(function(v){var x=0,y=0,total=0;
      v[2].forEach(function(w){var m=matrices[w[0]],vx=v[0]-m.ox,vy=v[1]-m.oy,along=(vx*m.rx+vy*m.ry)*m.length,across=(-vx*m.ry+vy*m.rx)*widthScale*mirror;
        x+=(m.x+m.dx*along-m.dy*across)*w[1];y+=(m.y+m.dy*along+m.dx*across)*w[1];total+=w[1];});
      x/=total;y/=total;
      if(p.turnScale!==1)x=p.x+(x-p.x)*p.turnScale;
      return {x:x,y:y};
    });
  }
  function triangle(ctx,texture,source,dest,padding){
    padding=padding===undefined?.18:padding;
    var s0=source[0],s1=source[1],s2=source[2],d0=dest[0],d1=dest[1],d2=dest[2];
    var sx1=s1[0]-s0[0],sy1=s1[1]-s0[1],sx2=s2[0]-s0[0],sy2=s2[1]-s0[1],det=sx1*sy2-sx2*sy1;
    if(Math.abs(det)<.0001)return;
    var dx1=d1.x-d0.x,dy1=d1.y-d0.y,dx2=d2.x-d0.x,dy2=d2.y-d0.y;
    var a=(dx1*sy2-dx2*sy1)/det,c=(dx2*sx1-dx1*sx2)/det,b=(dy1*sy2-dy2*sy1)/det,d=(dy2*sx1-dy1*sx2)/det;
    var e=d0.x-a*s0[0]-c*s0[1],f=d0.y-b*s0[0]-d*s0[1];
    var center={x:(d0.x+d1.x+d2.x)/3,y:(d0.y+d1.y+d2.y)/3};
    ctx.save();ctx.beginPath();dest.forEach(function(v,i){var dx=v.x-center.x,dy=v.y-center.y,len=Math.hypot(dx,dy)||1;var x=v.x+dx/len*padding,y=v.y+dy/len*padding;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.closePath();ctx.clip();
    ctx.transform(a,b,c,d,e,f);ctx.drawImage(texture,0,0);ctx.restore();
  }
  function renderer(ctx,images,data){
    var textures={};
    Object.keys(data).forEach(function(name){textures[name]={};Object.keys(data[name]).forEach(function(view){var box=data[name][view].box,c=document.createElement('canvas');c.width=box.width;c.height=box.height;c.getContext('2d').drawImage(images[name],box.x,box.y,box.width,box.height,0,0,box.width,box.height);textures[name][view]=c;});});
    return function(p,q){var mesh=data[p.id][p.view],points=deform(mesh,p,q),texture=textures[p.id][p.view];
      mesh.triangles.forEach(function(t){triangle(ctx,texture,t.map(function(i){return mesh.vertices[i];}),t.map(function(i){return points[i];}));});
    };
  }
  var api={renderer:renderer,deform:deform,targets:targets,triangle:triangle};root.PaintedSkin=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
