(function(root){
  'use strict';
  function rotate(p,origin,angle){var x=p.x-origin.x,y=p.y-origin.y,c=Math.cos(angle),s=Math.sin(angle);p.x=origin.x+x*c-y*s;p.y=origin.y+x*s+y*c;}
  function pose(state){
    var actor=root.AlleyActor.pose(state),q=actor.q,h=actor.p.height;
    if(state.browse||state.counter){
      var settle=root.AlleyWorld.ease(state.progress/.14)*root.AlleyWorld.ease((1-state.progress)/.14);
      actor.lean=(state.browse?-.035+.006*state.idle:.008*state.idle)*settle;
      q.arms.forEach(function(a){['shoulder','elbow','hand','tip'].forEach(function(k){rotate(a[k],q.hips,actor.lean);});});
    }
    // Keep the authored upper-arm/forearm lengths and solve the free hand to
    // the same handle used by the moving door. The bag arm remains at rest.
    if(state.grip>0){
      var arm=q.arms[1],hand={x:arm.hand.x+(state.handle.x-arm.hand.x)*state.grip,y:arm.hand.y+(state.handle.y-arm.hand.y)*state.grip};
      var upper=Math.hypot(arm.elbow.x-arm.shoulder.x,arm.elbow.y-arm.shoulder.y),lower=Math.hypot(arm.hand.x-arm.elbow.x,arm.hand.y-arm.elbow.y);
      var ik=root.PaintedRig.solve(arm.shoulder,hand,upper,lower,-1),depth=arm.hand.depth;
      arm.elbow=Object.assign(ik.joint,{depth:depth});arm.hand=Object.assign(ik.end,{depth:depth});
      var dx=arm.hand.x-arm.elbow.x,dy=arm.hand.y-arm.elbow.y,len=Math.hypot(dx,dy)||1;
      arm.tip={x:arm.hand.x+dx/len*h*.045,y:arm.hand.y+dy/len*h*.045,depth:depth};
      actor.contactError=Math.hypot(arm.hand.x-state.handle.x,arm.hand.y-state.handle.y);
    }
    return actor;
  }
  root.VisitPose={pose:pose};if(typeof module!=='undefined'&&module.exports)module.exports=root.VisitPose;
})(typeof window!=='undefined'?window:globalThis);
