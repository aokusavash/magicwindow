(function(root){
  'use strict';
  function eased(t){return Math.max(0,Math.min(1,root.AlleyWorld.ease(t)));}
  function rotate(p,origin,angle){var x=p.x-origin.x,y=p.y-origin.y,c=Math.cos(angle),s=Math.sin(angle);p.x=origin.x+x*c-y*s;p.y=origin.y+x*s+y*c;}
  var tables={outside:{hipY:623,bowl:{x:232,y:591}},inside:{hipY:616,bowl:{x:310,y:591}}};
  function armTo(arm,target,weight,h,bend){
    var hand={x:arm.hand.x+(target.x-arm.hand.x)*weight,y:arm.hand.y+(target.y-arm.hand.y)*weight};
    var upper=Math.hypot(arm.elbow.x-arm.shoulder.x,arm.elbow.y-arm.shoulder.y),lower=Math.hypot(arm.hand.x-arm.elbow.x,arm.hand.y-arm.elbow.y),depth=arm.hand.depth;
    var ik=root.PaintedRig.solve(arm.shoulder,hand,upper,lower,bend);
    arm.elbow=Object.assign(ik.joint,{depth:depth});arm.hand=Object.assign(ik.end,{depth:depth});
    var dx=arm.hand.x-arm.elbow.x,dy=arm.hand.y-arm.elbow.y,len=Math.hypot(dx,dy)||1;
    arm.tip={x:arm.hand.x+dx/len*h*.04,y:arm.hand.y+dy/len*h*.04,depth:depth};return ik.error;
  }
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
    if(state.seat>0&&tables[state.table]){
      actor.diningBody=true;
      var table=tables[state.table],seat=state.seat,shift=(table.hipY-q.hips.y)*seat,forward=Math.sin(state.heading);
      q.hips.y+=shift;[q.shoulders,q.head,q.bag].forEach(function(p){p.y+=shift;});
      q.arms.forEach(function(a){['shoulder','elbow','hand','tip'].forEach(function(k){a[k].y+=shift;});});
      q.legs.forEach(function(l,i){
        var x=l.hip.x,y=table.hipY,footX=x+forward*h*.16,footY=y+h*.26+(i?1:-1)*h*.008;
        var target={hip:{x:x,y:y},knee:{x:x+forward*h*.20,y:y+h*.075},ankle:{x:footX,y:footY-h*.05},foot:{x:footX,y:footY},heel:{x:footX-forward*h*.035,y:footY},ball:{x:footX+forward*h*.045,y:footY},toe:{x:footX+forward*h*.075,y:footY}};
        Object.keys(target).forEach(function(k){l[k].x+=(target[k].x-l[k].x)*seat;l[k].y+=(target[k].y-l[k].y)*seat;});
      });
      if(state.meal){
        var elapsed=state.mealTime,time=elapsed+(state.table==='inside'?2.1:0),phase=(time%8.6)/8.6,ease=eased;
        var finish=ease((elapsed-48)/1.4),grasp=finish*(1-ease((elapsed-58)/1.2));
        var bowlLift=ease((elapsed-50.5)/2)*(1-ease((elapsed-55)/2.5));
        var sip=ease((elapsed-52.3)/.7)*(1-ease((elapsed-55)/.7));
        var lift=ease((phase-.13)/.22)*(1-ease((phase-.60)/.22))*(1-finish);
        var active=state.mealBlend,dir=forward<0?-1:1,index=dir<0?1:0;
        actor.headDip=active*(lift*.72+Math.max(bowlLift*.65,sip)*.95);
        var headDrop=h*.029*actor.headDip;q.head.y+=headDrop;
        var mouth={x:q.head.x+forward*h*.095,y:q.head.y+h*.085};
        var bowl={x:table.bowl.x,y:table.bowl.y+(mouth.y-table.bowl.y)*bowlLift};
        var scoop={x:table.bowl.x-dir*h*.03,y:table.bowl.y-h*.06},taste={x:mouth.x-dir*h*.05,y:mouth.y+h*.105};
        var target={x:scoop.x+(taste.x-scoop.x)*lift,y:scoop.y+(taste.y-scoop.y)*lift};
        var errors=[];
        q.arms.forEach(function(arm,i){
          var side=arm.shoulder.x<q.hips.x?-1:1;
          var eating=i===index?target:{x:table.bowl.x+dir*h*.04,y:table.bowl.y+h*.012};
          // Both hands travel to the actual bowl before it rises, remain
          // attached while drinking, then release only after it is set down.
          var grip={x:bowl.x+side*7,y:bowl.y+3};
          var goal={x:eating.x+(grip.x-eating.x)*grasp,y:eating.y+(grip.y-eating.y)*grasp};
          errors.push(armTo(arm,goal,active,h,table.bowl.x<arm.shoulder.x?-1:1));
          // In a frontal painting, depth foreshortens the upper arm. Author
          // the elbow silhouette outward/down instead of folding it across
          // the middle of the chest. Wrists stay at their contact targets.
          var flare=active*(.86+.14*grasp),ex=arm.shoulder.x+side*h*(.045+.015*grasp),ey=arm.shoulder.y+h*.105;
          arm.elbow.x+=(ex-arm.elbow.x)*flare;arm.elbow.y+=(ey-arm.elbow.y)*flare;
          var dx=arm.hand.x-arm.elbow.x,dy=arm.hand.y-arm.elbow.y,len=Math.hypot(dx,dy)||1;
          arm.tip.x=arm.hand.x+dx/len*h*.04;arm.tip.y=arm.hand.y+dy/len*h*.04;
        });
        var hidden=Math.cos(state.heading)>.9,armDepth=q.hips.depth+(hidden?1:-1)*182*.07;
        q.arms.forEach(function(a){['shoulder','elbow','hand','tip'].forEach(function(k){a[k].depth=armDepth;});});
        actor.meal={bowl:bowl,tableBowl:table.bowl,hand:q.arms[index].hand,tip:{x:table.bowl.x+(mouth.x-table.bowl.x)*lift,y:table.bowl.y-1+(mouth.y-table.bowl.y+1)*lift},lift:lift,noodle:(1-ease((phase-.36)/.22))*(1-finish),alpha:active,time:time,mouth:mouth,reachError:Math.max.apply(Math,errors),hidden:hidden,finish:finish,grasp:grasp,bowlLift:bowlLift,sip:sip,broth:1-ease((elapsed-53)/2.2),chopsticks:1-finish};

      }
    }
    // Keep the authored upper-arm/forearm lengths and solve the free hand to
    // the same handle used by the moving door. The bag arm remains at rest.
    if(state.grip>0){
      actor.cleanBody=true;
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
  root.VisitPose={pose:pose,tables:tables};if(typeof module!=='undefined'&&module.exports)module.exports=root.VisitPose;
})(typeof window!=='undefined'?window:globalThis);
