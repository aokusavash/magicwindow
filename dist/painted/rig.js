(function (root) {
  'use strict';
  function mix(a,b,t) { return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}; }
  function smooth(t) { return t*t*(3-2*t); }
  function solve(a,c,upper,lower,bend) {
    var dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy),safe=Math.max(.001,Math.min(upper+lower-.001,Math.max(Math.abs(upper-lower)+.001,d)));
    var ux=d?dx/d:0,uy=d?dy/d:1,along=(upper*upper-lower*lower+safe*safe)/(2*safe),across=Math.sqrt(Math.max(0,upper*upper-along*along));
    return {joint:{x:a.x+ux*along-uy*across*bend,y:a.y+uy*along+ux*across*bend},end:{x:a.x+ux*safe,y:a.y+uy*safe},error:Math.abs(d-safe)};
  }
  function pose(p) {
    var h=p.height,side=p.view==='side',dir=p.direction,step=(p.baseHeight||h)*(side?.30:.14),unit=p.distance/step;
    var feet=[],legLength=h*(side?.48:.54),stanceOffset=0;
    for(var i=0;i<2;i++){
      var u=((unit+i)%2+2)%2,stance=u<1,phase=u%1;
      var offset=stance?step*(.5-phase):step*(-.5+smooth(phase));
      if(stance)stanceOffset=offset;
      var lift=stance?0:Math.sin(Math.PI*phase)*h*.045;
      var lane=side?(i?-2:2):(i?-1:1)*h*.067;
      var walking={x:p.x+p.travelX*offset+lane,y:p.y+p.travelY*offset-lift};
      var resting={x:p.x+(side?(i?-6:6):(i?-1:1)*h*.065),y:p.y};
      feet.push({point:mix(resting,walking,p.walkWeight),stance:stance||p.walkWeight<.01,lift:lift*p.walkWeight});
    }
    var baseline=p.y-(side?h*.019:0)-h*.48*.99;
    var upright=side?p.y-h*.019-Math.sqrt(Math.max(1,Math.pow(legLength*.995,2)-stanceOffset*stanceOffset)):baseline+Math.cos(unit*Math.PI*2)*h*.012;
    var hips={x:p.x,y:baseline+(upright-baseline)*p.walkWeight+h*.078*p.bend};
    var lean=.85*p.bend,torsoLength=h*.30;
    var shoulders={x:hips.x+dir*Math.sin(lean)*torsoLength,y:hips.y-Math.cos(lean)*torsoLength};
    var head={x:shoulders.x+dir*Math.sin(lean)*h*.10,y:shoulders.y-Math.cos(lean)*h*.10+p.breath+p.bend*h*.03};
    var legs=feet.map(function(f,i){
      var hip={x:hips.x+(side?(i?-2:2):(i?-1:1)*h*.052),y:hips.y};
      var ankle={x:f.point.x,y:f.point.y-h*.019};
      var ik=solve(hip,ankle,legLength*.5,legLength*.5,side?-dir:(i?1:-1));
      if(!side)ik.joint={x:(hip.x+ankle.x)*.5+(i?-1:1)*h*.012,y:(hip.y+ankle.y)*.5};
      return {hip:hip,knee:ik.joint,ankle:ik.end,foot:f.point,stance:f.stance,lift:f.lift,error:ik.error};
    });
    var cycle=unit*Math.PI,arms=[];
    for(var j=0;j<2;j++){
      var shoulder={x:shoulders.x+(side?(j?-3:2):(j?-1:1)*h*.10),y:shoulders.y+h*.065};
      var swing=Math.sin(cycle+(j?Math.PI:0))*h*.045*p.walkWeight;
      var hand={x:shoulder.x-dir*swing,y:shoulder.y+h*.284-Math.abs(swing)*.08};
      if(p.bend)hand=mix(hand,{x:hips.x-dir*h*.015,y:hips.y+h*.015},p.bend);
      if(j===0&&p.grip)hand=mix(hand,p.handle,p.grip);
      var ikArm=solve(shoulder,hand,h*.16,h*.16,side?dir:(j?-1:1));
      arms.push({shoulder:shoulder,elbow:ikArm.joint,hand:ikArm.end,error:ikArm.error});
    }
    return {hips:hips,shoulders:shoulders,head:head,legs:legs,arms:arms,lean:lean,
      nose:{x:head.x+dir*h*.095,y:head.y+h*.012},bag:p.id==='neighbor'?{x:arms[0].hand.x,y:arms[0].hand.y}:{x:hips.x-dir*h*.05,y:hips.y+h*.02}};
  }
  function renderer(ctx,images,atlases,torsos){
    function part(image,box,x,y,w,h,angle,pivotX,pivotY){
      ctx.save();ctx.translate(x,y);if(angle)ctx.rotate(angle);
      ctx.drawImage(image,box.x,box.y,box.width,box.height,-w*(pivotX===undefined?.5:pivotX),-h*(pivotY===undefined?0:pivotY),w,h);ctx.restore();
    }
    function bone(image,box,a,b,width){var len=Math.hypot(b.x-a.x,b.y-a.y);part(image,box,a.x,a.y,width,len/.76,Math.atan2(b.y-a.y,b.x-a.x)-Math.PI/2,.5,.12);}
    return function(p){
      var shape=pose(p),image=images[p.id],a=atlases[p.id],h=p.height,side=p.view==='side',dir=p.direction;
      function leg(i){var l=shape.legs[i];bone(image,a[i?12:3],l.hip,l.knee,h*.105);bone(image,a[i?13:4],l.knee,l.ankle,h*.085);
        if(side){ctx.save();ctx.translate(l.foot.x,l.foot.y);ctx.scale(dir,1);part(image,a[5],0,0,h*.15,h*.065,l.stance?0:-.10,.40,.83);ctx.restore();}
        else part(image,a[p.view==='rear'?11:18],l.foot.x,l.foot.y,h*.09,h*.075,0,.5,.85);
      }
      function arm(i){var ar=shape.arms[i];bone(image,a[i?14:1],ar.shoulder,ar.elbow,h*.091);bone(image,a[i?15:2],ar.elbow,ar.hand,h*.076);
        var angle=Math.atan2(ar.hand.y-ar.elbow.y,ar.hand.x-ar.elbow.x)-Math.PI/2;
        part(image,a[i===0&&p.grip>.5?19:10],ar.hand.x,ar.hand.y,h*.047,h*.070,angle,.5,i===0&&p.grip>.5?.5:.1);
      }
      leg(1);arm(1);leg(0);
      ctx.strokeStyle='#d0a17c';ctx.lineWidth=h*.045;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(shape.shoulders.x,shape.shoulders.y+h*.04);ctx.lineTo(shape.head.x,shape.head.y+h*.085);ctx.stroke();
      // A narrowed frontal garment avoids the baked sleeve in the generated side torso.
      var viewIndex=side?2:p.view==='rear'?1:2;
      var box=torsos[p.id][viewIndex];
      ctx.save();ctx.translate(shape.hips.x,shape.hips.y);if(side)ctx.scale(dir,1);ctx.rotate(side?shape.lean:0);
      part(images.torsos,box,0,0,h*(side?.225:.265)*p.turnScale,h*.325,0,.5,.92);ctx.restore();
      var headBox=a[side?6:p.view==='rear'?9:17];
      ctx.save();ctx.translate(shape.head.x,shape.head.y);if(side)ctx.scale(dir,1);
      part(image,headBox,0,0,h*(side?.22:.235)*p.turnScale,h*.235,p.bend*.40,.5,.50);ctx.restore();
      arm(0);
      if(p.id==='neighbor')part(image,a[7],shape.bag.x,shape.bag.y,h*.225,h*.29,Math.sin(p.distance/44)*.025*p.walkWeight,.5,.015);
      else{
        ctx.strokeStyle='#67392f';ctx.lineWidth=h*.011;ctx.beginPath();ctx.moveTo(shape.shoulders.x+dir*h*.055,shape.shoulders.y+h*.04);ctx.lineTo(shape.bag.x,shape.bag.y+h*.04);ctx.stroke();
        part(image,a[7],shape.bag.x,shape.bag.y,h*.18,h*.14,0,.5,0);
      }
      return shape;
    };
  }
  var api={pose:pose,solve:solve,renderer:renderer};root.PaintedRig=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
