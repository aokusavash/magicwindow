(function(root){
  'use strict';
  var profiles={
    stroll:{label:'A · Stroll',speed:68,step:.245,duty:.64,lift:.014,heel:10,push:20,landingBend:6,arm:.11},
    everyday:{label:'B · Everyday',speed:88,step:.285,duty:.62,lift:.018,heel:12,push:24,landingBend:7,arm:.16},
    brisk:{label:'C · Brisk',speed:118,step:.34,duty:.60,lift:.026,heel:14,push:28,landingBend:9,arm:.20},
    previous:{label:'Previous stride',speed:72,step:.30,duty:.50,lift:.045,heel:0,push:0}
  };
  // Keep the accepted Everyday walk intact; Relaxed is a small variation of it.
  profiles.relaxed=Object.assign({},profiles.everyday,{label:'Relaxed',speed:profiles.everyday.speed*.90,bounceScale:.90});
  function smooth(t){t=Math.max(0,Math.min(1,t));return t*t*t*(10+t*(-15+6*t));}
  function pose(p,meshes){
    var q=root.PaintedRig.pose(p),g=profiles[p.gait]||profiles.everyday;
    if(p.gait==='previous')return q;
    if(p.gaitTuning)g=Object.assign({},g,p.gaitTuning);
    var h=p.height,dir=p.direction,step=h*g.step,legLength=h*.48,unit=p.distance/(2*step),rootX=p.x-dir*h*.0125;
    var legs=[0,1].map(function(i){
      var phase=((unit+i*.5)%1+1)%1,stance=phase<g.duty,t=stance?phase/g.duty:(phase-g.duty)/(1-g.duty);
      // Quintic swing matches velocity AND acceleration at ground-contact joins.
      var tangent=-2*step*(1-g.duty);
      var offset=stance?step*(g.duty-2*phase):-step*g.duty+tangent*t+(2*step*g.duty-tangent)*smooth(t);
      var clearance=stance?0:h*g.lift*64*Math.pow(t*(1-t),3);
      var pitch=stance?(-g.heel*(1-smooth(t/.18))+g.push*smooth((t-.72)/.28)):(g.push+( -g.heel-g.push)*smooth(t));
      pitch*=Math.PI/180;
      var m=meshes[i],scale=h/m.referenceHeight,w=m.box.width;
      var heelLength=w*.37*scale,ballLength=w*.30*scale,toeLength=w*.28*scale,ankleHeight=m.box.height*.09*scale;
      var anchor={x:rootX+dir*offset+(i?-2:2),y:p.y-clearance};
      var pivot=stance?(pitch<0?-heelLength:ballLength):-heelLength+(ballLength+heelLength)*smooth((pitch+.06)/.12);
      var foot={x:anchor.x+dir*pivot*(1-Math.cos(pitch)),y:anchor.y-pivot*Math.sin(pitch)};
      var ball={x:foot.x+dir*ballLength*Math.cos(pitch),y:foot.y+ballLength*Math.sin(pitch)};
      var toeBlend=smooth((pitch+.05)/.10);
      var toePitch=stance?(pitch<0?pitch:0):pitch*(1-toeBlend+toeBlend*.4*Math.pow(Math.sin(Math.PI*t),2));
      var toe={x:ball.x+dir*toeLength*Math.cos(toePitch),y:ball.y+toeLength*Math.sin(toePitch)};
      var heel={x:foot.x-dir*heelLength*Math.cos(pitch),y:foot.y-heelLength*Math.sin(pitch)};
      var ankle={x:foot.x+dir*Math.sin(pitch)*ankleHeight,y:foot.y-Math.cos(pitch)*ankleHeight};
      return {hip:{x:rootX+(i?-2:2),y:0},ankle:ankle,foot:foot,ball:ball,toe:toe,heel:heel,stance:stance,lift:clearance,phase:phase,pitch:pitch,anchor:anchor};
    });
    // Both legs remain reachable; the supporting leg sets the gentle body arc.
    var limits=legs.map(function(l){var dx=l.ankle.x-l.hip.x;return l.ankle.y-Math.sqrt(Math.max(1,Math.pow(legLength*.995,2)-dx*dx));});
    var hipsY=(limits[0]+limits[1]+Math.hypot(limits[0]-limits[1],h*.012))/2;
    // Settle slightly lower to trim the vertical arc while keeping both feet reachable.
    hipsY=(p.y-h*.49)+(hipsY-(p.y-h*.49))*.80*(g.bounceScale||1);
    var dy=hipsY-q.hips.y;q.hips.y=hipsY;
    [q.shoulders,q.head,q.nose,q.bag].forEach(function(a){a.y+=dy;});
    q.arms.forEach(function(a){[a.shoulder,a.elbow,a.hand].forEach(function(v){v.y+=dy;});});
    legs.forEach(function(l){
      l.hip.y=hipsY;var ik=root.PaintedRig.solve(l.hip,l.ankle,legLength*.5,legLength*.5,-dir);
      var t=l.stance?l.phase/g.duty:(l.phase-g.duty)/(1-g.duty);
      var landingHold=g.landingHold===undefined?.18:g.landingHold,landingRelease=g.landingRelease||.22;
      var extension=p.straightLanding===false?0:(l.stance?1-smooth((t-landingHold)/landingRelease):smooth((t-.72)/.22));
      var dx=l.ankle.x-l.hip.x,dy=l.ankle.y-l.hip.y,d=Math.hypot(dx,dy)||1;
      var bend=d*.5*Math.tan(g.landingBend*Math.PI/360),side=-dir;
      var landing={x:(l.hip.x+l.ankle.x)/2-dy/d*bend*side,y:(l.hip.y+l.ankle.y)/2+dx/d*bend*side};
      // An authored silhouette correction, not a change to planted feet or body height.
      // Small limb-length flexibility keeps the quiet body path through near extension.
      l.knee={x:ik.joint.x+(landing.x-ik.joint.x)*extension,y:ik.joint.y+(landing.y-ik.joint.y)*extension};
      l.extensionWeight=extension;l.error=ik.error;
    });
    q.legs=legs;
    q.arms=[0,1].map(function(i){
      var phase=unit*Math.PI*2+i*Math.PI,amplitude=p.armSwing===false?0:g.arm;
      var angle=-amplitude*Math.cos(phase-.12),forearm=angle+.12+amplitude*.20*Math.sin(phase-.45);
      var shoulder={x:q.hips.x+dir*h*(i?.035:-.055),y:q.hips.y-h*.243};
      var elbow={x:shoulder.x+dir*Math.sin(angle)*h*.16,y:shoulder.y+Math.cos(angle)*h*.16};
      var hand={x:elbow.x+dir*Math.sin(forearm)*h*.125,y:elbow.y+Math.cos(forearm)*h*.125};
      return {shoulder:shoulder,elbow:elbow,hand:hand,tip:{x:hand.x+dir*Math.sin(forearm)*h*.065,y:hand.y+Math.cos(forearm)*h*.065},angle:angle};
    });return q;
  }
  var api={profiles:profiles,pose:pose};root.PaintedGaits=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
