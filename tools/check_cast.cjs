const assert=require('node:assert/strict');global.window=global;
for(const n of ['rig','walking/gaits','walking/layered','alley/world','alley/actor','crowd/world','visits/world','visits/pose','cast/world','cast/frames'])require('../dist/painted/'+n+'.js');
let poses=0,contacts=0,plants=0;
for(const id of CastWorld.ids){
  for(const heading of [0,45,90,135,180,-45,-90,-135])for(let frame=0;frame<180;frame++){
    let base=AlleyWorld.at(frame/60,heading),state=CastWorld.dress(base,id),actor=AlleyActor.pose(state);poses++;
    for(const p of [actor.q.head,actor.q.hips,...actor.q.arms.flatMap(a=>[a.shoulder,a.elbow,a.hand]),...actor.q.legs.flatMap(l=>[l.hip,l.knee,l.ankle,l.foot])])assert(Number.isFinite(p.x+p.y),'finite retargeted pose');
    assert.equal(actor.p.height,182*CastWorld.profiles[id].scale*AlleyWorld.project(state.x,state.z).scale);
  }
  for(const plan of [VisitWorld.ramen,VisitWorld.counter]){
    let last;
    for(let t=0;t<plan.duration;t+=1/30){
      let state=CastWorld.dress(VisitWorld.sample(plan,t),id),actor=VisitPose.pose(state);poses++;
      if(state.grip>.999){assert(actor.contactError<.01,'adult hand must meet door handle');contacts++;}
      if(id==='child'){assert.equal(state.grip,0,'child cannot reach adult handle');if(state.seat)assert(state.seatRaise>=11,'child needs a raised seat');}
      if(actor.meal){
        assert(actor.meal.reachError<.35,'meal wrist target drifted');
        if(actor.meal.grasp===1){let radius=state.mealGrip||7;actor.q.arms.forEach(a=>{let side=Math.sign(a.shoulder.x-actor.q.hips.x);assert(Math.hypot(a.hand.x-actor.meal.bowl.x-side*radius,a.hand.y-actor.meal.bowl.y-3)<.01,'hand left raised bowl');});}
        assert.equal(actor.meal.hidden,state.table==='outside');
      }
      if(last&&state.meal&&last.state.meal){actor.q.legs.forEach((leg,i)=>{assert(Math.hypot(leg.foot.x-last.actor.q.legs[i].foot.x,leg.foot.y-last.actor.q.legs[i].foot.y)<1e-7,'seated feet drifted');});}
      last={state,actor};
    }
  }
  // Retargeted cadence uses each body's actual height. Stance contacts must
  // remain planted instead of scaling an adult's already projected foot path.
  let previous;
  for(let f=0;f<180;f++){
    let raw=AlleyWorld.at(1+f/120,90),s=CastWorld.dress(raw,id),a=AlleyActor.pose(s);
    if(previous&&s.walkWeight===1&&previous.s.walkWeight===1)a.local.legs.forEach((l,i)=>{let prior=previous.a.local.legs[i];if(l.stance&&prior.stance&&l.phase>prior.phase&&l.phase-prior.phase<.05&&Math.sign(l.pitch)===Math.sign(prior.pitch)){let key=l.pitch<0?'heel':'ball';assert(Math.hypot(a.q.legs[i][key].x-previous.a.q.legs[i][key].x,a.q.legs[i][key].y-previous.a.q.legs[i][key].y)<.003,'retargeted stance slid: '+id);plants++;}});
    previous={s,a};
  }
}
assert.equal(CastWorld.profiles.child.scale,.5);assert(CastWorld.profiles.child.proportions.headRise>0&&CastWorld.profiles.child.proportions.legs<1,'child must have distinct proportions');
for(const [id,views] of Object.entries(CastFrames))for(const [name,f] of Object.entries(views)){
 assert.equal(f.arms.length,2);assert.equal(f.legs.length,2);assert(f.body.width>0&&f.body.height>0);
 if(id==='yukata')assert(f.garment.width>0,'robe needs a continuous lower panel');
 for(let anchors of f.legAnchors)assert(anchors.ankleY>.7&&anchors.ankleY<.95);
}
assert.equal(new Set(CastWorld.scene(0,'yukata','walk').map(s=>s.character)).size,5);
console.log(JSON.stringify({profiles:CastWorld.ids,poses,adultHandleContacts:contacts,plantedContacts:plants,sharedActions:true,childBoosterAndAutomaticEntry:true,continuousRobePanels:true}));
