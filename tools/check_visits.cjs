const assert=require('node:assert/strict');global.window=global;
for(const n of ['rig','walking/gaits','walking/layered','alley/world','alley/actor','crowd/world','visits/world','visits/pose'])require('../dist/painted/'+n+'.js');
let contacts=0,plants=0,poses=0;
for(const plan of [VisitWorld.ramen,VisitWorld.browser]){
  let last;
  for(let f=0;f<plan.duration*60;f++){
    const t=f/60,s=VisitWorld.sample(plan,t),a=VisitPose.pose(s);poses++;
    for(const p of [a.q.hips,...a.q.arms.flatMap(l=>[l.shoulder,l.elbow,l.hand]),...a.q.legs.flatMap(l=>[l.hip,l.knee,l.ankle,l.foot])])assert(Number.isFinite(p.x+p.y),'nonfinite visit pose');
    assert(s.door>=0&&s.door<=1&&s.grip>=0&&s.grip<=1);
    if(s.grip===1){assert(a.contactError<.01,`hand left the moving handle: ${a.contactError}`);contacts++;}
    if(last){
      assert(Math.hypot(s.ground.x-last.s.ground.x,s.ground.y-last.s.ground.y)<3,'visit position jumped');
      const turn=Math.atan2(Math.sin(s.heading-last.s.heading),Math.cos(s.heading-last.s.heading));assert(Math.abs(turn)<.12,`visit facing snapped: ${plan.id} ${s.action} t=${t} delta=${turn}`);
      if(Math.abs(s.door-last.s.door)>1e-6)assert(s.grip>.999&&last.s.grip>.999,'door moved without hand contact');
      if(s.action===last.s.action&&s.walkWeight===1&&last.s.walkWeight===1)a.local.legs.forEach((l,i)=>{
        const prior=last.a.local.legs[i],forward=s.action!=='close-door',phaseMoved=forward?l.phase>prior.phase:l.phase<prior.phase;
        if(l.stance&&prior.stance&&phaseMoved&&Math.abs(l.phase-prior.phase)<.1&&Math.sign(l.pitch)===Math.sign(prior.pitch)){
          const k=l.pitch<0?'heel':'ball',p=a.q.legs[i][k],q=last.a.q.legs[i][k];
          assert(Math.hypot(p.x-q.x,p.y-q.y)<.003,`visit planted contact slid: ${s.action} t=${t} err=${Math.hypot(p.x-q.x,p.y-q.y)}`);plants++;
        }
      });
    }last={s,a};
  }
  const before=VisitWorld.sample(plan,plan.duration-.0001),after=VisitWorld.sample(plan,.0001);assert(!before.inFrame&&!after.inFrame,'visit loop reset in view');
  for(const seg of plan.segments){
    if(['browse','at-counter'].includes(seg.action)){
      const a=VisitWorld.sample(plan,seg.start+1),b=VisitWorld.sample(plan,seg.start+seg.duration-1);
      assert.equal(a.walkWeight,0);assert.equal(a.distance,b.distance);assert(Math.hypot(a.ground.x-b.ground.x,a.ground.y-b.ground.y)<1e-8);
    }
  }
}
for(const action of ['enter','exit']){const seg=VisitWorld.ramen.segments.find(s=>s.action===action),s=VisitWorld.sample(VisitWorld.ramen,seg.start+seg.duration*.5);assert(Math.abs(Math.sin(s.heading))<.6,'doorway must show back/front rather than a sliding profile');}
for(let t=0;t<180;t+=.25){const p=VisitWorld.population(t,8);assert.equal(p.length,8);assert.equal(new Set(p.map(s=>s.id)).size,8);assert.equal(p.filter(s=>s.zone!==undefined).length,2);}
for(const action of ['open-door','close-door']){
  const seg=VisitWorld.ramen.segments.find(s=>s.action===action);assert(seg.duration<=1.5,'door slide should be about twice as fast as the first attempt');
  let first;
  for(let f=0;f<=60;f++){
    const s=VisitWorld.sample(VisitWorld.ramen,seg.start+seg.duration*f/61),a=VisitPose.pose(s);
    assert.equal(s.walkWeight,0,'opening the door must not involve walking sideways');
    if(!first)first={s,a};
    assert.equal(s.distance,first.s.distance);assert(Math.hypot(s.ground.x-first.s.ground.x,s.ground.y-first.s.ground.y)<1e-8);
    a.q.legs.forEach((l,i)=>['foot','heel','ball','toe'].forEach(k=>assert(Math.hypot(l[k].x-first.a.q.legs[i][k].x,l[k].y-first.a.q.legs[i][k].y)<1e-8,'door gesture moved a planted foot')));
  }
  const start=VisitWorld.sample(VisitWorld.ramen,seg.start+.001),end=VisitWorld.sample(VisitWorld.ramen,seg.start+seg.duration-.001);
  assert((start.handle.x-start.ground.x)*(end.handle.x-end.ground.x)<0,'the hand should slide across her stationary body');
}
const flower=VisitWorld.browser.segments.find(s=>s.action==='browse'),smelling=VisitWorld.sample(VisitWorld.browser,flower.start+flower.duration*.5);
const bent=VisitPose.pose(smelling),upright=AlleyActor.pose(smelling);
assert(bent.q.head.x<upright.q.head.x-15&&bent.q.head.y>upright.q.head.y+5,'flower stop must include a visible bend toward the blossoms');
bent.q.legs.forEach((l,i)=>['ankle','foot','heel','ball','toe'].forEach(k=>assert(Math.hypot(l[k].x-upright.q.legs[i][k].x,l[k].y-upright.q.legs[i][k].y)<1e-8,'smelling flowers moved her support')));
assert(contacts>160&&plants>3000);
console.log(JSON.stringify({poses,handleContacts:contacts,plantedContacts:plants,smoothRoutesAndTurns:true,offscreenLoops:true,stationaryDoorGesture:true,visibleFlowerBend:true,stationaryBrowsingAndWindowVisit:true,eightResidents:true}));
