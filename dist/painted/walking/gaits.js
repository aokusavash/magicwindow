(function(root){
  'use strict';
  var profiles={
    stroll:{label:'A · Stroll',speed:68,step:.245,duty:.64,lift:.014,heel:10,push:20},
    everyday:{label:'B · Everyday',speed:88,step:.285,duty:.62,lift:.018,heel:12,push:24},
    brisk:{label:'C · Brisk',speed:118,step:.34,duty:.60,lift:.026,heel:14,push:28},
    previous:{label:'Previous stride',speed:72,step:.30,duty:.50,lift:.045,heel:0,push:0}
  };
  function smooth(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}
  function pose(p,meshes){
    var q=root.PaintedRig.pose(p),g=profiles[p.gait]||profiles.everyday;
    if(p.gait==='previous')return q;
    var h=p.height,dir=p.direction,step=h*g.step,legLength=h*.48,unit=p.distance/(2*step);
    var legs=[0,1].map(function(i){
      var phase=((unit+i*.5)%1+1)%1,stance=phase<g.duty,t=stance?phase/g.duty:(phase-g.duty)/(1-g.duty);
      // Hermite swing matches the planted foot's world velocity at both ends.
      var tangent=-2*step*(1-g.duty);
      var offset=stance?step*(g.duty-2*phase):-step*g.duty+2*step*g.duty*smooth(t)+tangent*(t-3*t*t+2*t*t*t);
      var clearance=stance?0:h*g.lift*Math.pow(Math.sin(Math.PI*t),2);
      var pitch=stance?(-g.heel*(1-smooth(t/.18))+g.push*smooth((t-.72)/.28)):(g.push+( -g.heel-g.push)*smooth(t));
      pitch*=Math.PI/180;
      var m=meshes[i],scale=h/m.referenceHeight,w=m.box.width;
      var heelLength=w*.37*scale,ballLength=w*.30*scale,toeLength=w*.28*scale,ankleHeight=m.box.height*.09*scale;
      var anchor={x:p.x+dir*offset+(i?-2:2),y:p.y-clearance};
      var pivot=pitch<0?-heelLength:ballLength;
      var foot={x:anchor.x+dir*pivot*(1-Math.cos(pitch)),y:anchor.y-pivot*Math.sin(pitch)};
      var ball={x:foot.x+dir*ballLength*Math.cos(pitch),y:foot.y+ballLength*Math.sin(pitch)};
      var toePitch=stance?(pitch<0?pitch:0):pitch*(pitch<0?1:.4*Math.pow(Math.sin(Math.PI*t),2));
      var toe={x:ball.x+dir*toeLength*Math.cos(toePitch),y:ball.y+toeLength*Math.sin(toePitch)};
      var heel={x:foot.x-dir*heelLength*Math.cos(pitch),y:foot.y-heelLength*Math.sin(pitch)};
      var ankle={x:foot.x+dir*Math.sin(pitch)*ankleHeight,y:foot.y-Math.cos(pitch)*ankleHeight};
      return {hip:{x:p.x+(i?-2:2),y:0},ankle:ankle,foot:foot,ball:ball,toe:toe,heel:heel,stance:stance,lift:clearance,phase:phase,pitch:pitch,anchor:anchor};
    });
    // Both legs remain reachable; the supporting leg sets the gentle body arc.
    var hipsY=Math.max.apply(null,legs.map(function(l){var dx=l.ankle.x-l.hip.x;return l.ankle.y-Math.sqrt(Math.max(1,Math.pow(legLength*.995,2)-dx*dx));}));
    var dy=hipsY-q.hips.y;q.hips.y=hipsY;
    [q.shoulders,q.head,q.nose,q.bag].forEach(function(a){a.y+=dy;});
    q.arms.forEach(function(a){[a.shoulder,a.elbow,a.hand].forEach(function(v){v.y+=dy;});});
    legs.forEach(function(l){l.hip.y=hipsY;var ik=root.PaintedRig.solve(l.hip,l.ankle,legLength*.5,legLength*.5,-dir);l.knee=ik.joint;l.error=ik.error;});
    q.legs=legs;return q;
  }
  var api={profiles:profiles,pose:pose};root.PaintedGaits=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
