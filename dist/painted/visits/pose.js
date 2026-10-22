(function(root){
  'use strict';
  function rotate(p,origin,angle){var x=p.x-origin.x,y=p.y-origin.y,c=Math.cos(angle),s=Math.sin(angle);p.x=origin.x+x*c-y*s;p.y=origin.y+x*s+y*c;}
  function pose(state){
    var actor=root.AlleyActor.pose(state),q=actor.q,h=actor.p.height;
    if(state.browse||state.counter){
      var settle=root.AlleyWorld.ease(state.progress/.18)*root.AlleyWorld.ease((1-state.progress)/.18);
      actor.lean=(state.browse?-.40+.006*state.idle:.008*state.idle)*settle;
      var origin={x:q.hips.x,y:q.hips.y},dx=state.browse?h*.015*settle:0,dy=state.browse?h*.018*settle:0;
      q.hips.x+=dx;q.hips.y+=dy;
      q.legs.forEach(function(l){var t=(l.ankle.y-l.knee.y)/(l.ankle.y-l.hip.y);l.hip.x+=dx;l.hip.y+=dy;l.knee.x+=dx*t;l.knee.y+=dy*t;});
      [q.shoulders,q.head].forEach(function(p){rotate(p,origin,actor.lean);p.x+=dx;p.y+=dy;});q.bag.x+=dx;q.bag.y+=dy;
      // The shoulders follow the bend; the relaxed arms hang mostly downward.
      q.arms.forEach(function(a){
        var old={x:a.shoulder.x,y:a.shoulder.y};rotate(a.shoulder,origin,actor.lean);a.shoulder.x+=dx;a.shoulder.y+=dy;
        ['elbow','hand','tip'].forEach(function(k){rotate(a[k],old,actor.lean*.25);a[k].x+=a.shoulder.x-old.x;a[k].y+=a.shoulder.y-old.y;});
      });
    }
    // Keep the authored upper-arm/forearm lengths and solve the free hand to
    // the same handle used by the moving door. The bag arm remains at rest.
    if(state.grip>0){
      var arm=q.arms[1],restTip={x:arm.tip.x,y:arm.tip.y},wrist={x:state.handle.x,y:state.handle.y+h*.038};
      var hand={x:arm.hand.x+(wrist.x-arm.hand.x)*state.grip,y:arm.hand.y+(wrist.y-arm.hand.y)*state.grip};
      var upper=Math.hypot(arm.elbow.x-arm.shoulder.x,arm.elbow.y-arm.shoulder.y),lower=Math.hypot(arm.hand.x-arm.elbow.x,arm.hand.y-arm.elbow.y);
      var ik=root.PaintedRig.solve(arm.shoulder,hand,upper,lower,-1),depth=arm.hand.depth;
      arm.elbow=Object.assign(ik.joint,{depth:depth});arm.hand=Object.assign(ik.end,{depth:depth});
      // A vertical gripping hand spans the handle. Its wrist stays just below
      // the contact, allowing the elbow to fold as the hand crosses the body.
      arm.tip={x:restTip.x+(state.handle.x-restTip.x)*state.grip,y:restTip.y+(state.handle.y-h*.016-restTip.y)*state.grip,depth:depth};
      actor.gripPoint={x:arm.hand.x+(arm.tip.x-arm.hand.x)*(.038/.054),y:arm.hand.y+(arm.tip.y-arm.hand.y)*(.038/.054)};
      actor.contactError=Math.hypot(actor.gripPoint.x-state.handle.x,actor.gripPoint.y-state.handle.y);
      // Facing the door, the reaching arm is in front of her chest and behind
      // the painted back. It must disappear under the torso as it crosses it,
      // rather than looking like a hand rubbing her shoulder blade.
      if(Math.cos(state.heading)>0)['shoulder','elbow','hand','tip'].forEach(function(k){arm[k].depth=q.hips.depth+182*.06;});
    }
    return actor;
  }
  root.VisitPose={pose:pose};if(typeof module!=='undefined'&&module.exports)module.exports=root.VisitPose;
})(typeof window!=='undefined'?window:globalThis);
