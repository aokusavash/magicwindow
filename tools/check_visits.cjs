const assert=require('node:assert/strict');global.window=global;
for(const n of ['rig','walking/gaits','walking/layered','alley/world','alley/actor','crowd/world','visits/world','visits/pose'])require('../dist/painted/'+n+'.js');
let contacts=0,plants=0,poses=0;
for(const plan of [VisitWorld.ramen,VisitWorld.counter,VisitWorld.browser]){
  let last;
  for(let f=0;f<plan.duration*60;f++){
    const t=f/60,s=VisitWorld.sample(plan,t),a=VisitPose.pose(s);poses++;
    for(const p of [a.q.hips,...a.q.arms.flatMap(l=>[l.shoulder,l.elbow,l.hand]),...a.q.legs.flatMap(l=>[l.hip,l.knee,l.ankle,l.foot])])assert(Number.isFinite(p.x+p.y),'nonfinite visit pose');
    assert(s.door>=0&&s.door<=1&&s.grip>=0&&s.grip<=1);
    if(s.grip===1){assert(a.contactError<.01,`hand left the moving handle: ${a.contactError}`);contacts++;}
    if(last){
      assert(Math.hypot(s.ground.x-last.s.ground.x,s.ground.y-last.s.ground.y)<3,'visit position jumped');
      const turn=Math.atan2(Math.sin(s.heading-last.s.heading),Math.cos(s.heading-last.s.heading));assert(Math.abs(turn)<.12,`visit facing snapped: ${plan.id} ${s.action} t=${t} delta=${turn}`);
      if(Math.abs(s.door-last.s.door)>1e-6){
        const automatic=s.automaticDoor||last.s.automaticDoor;
        if(automatic)assert(s.grip===0&&last.s.grip===0,'automatic closer should not drag a hand');
        else assert(s.grip>.999&&last.s.grip>.999,'manual door moved without hand contact');
      }
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
    if(['browse','at-counter','counter-meal'].includes(seg.action)){
      const a=VisitWorld.sample(plan,seg.start+1),b=VisitWorld.sample(plan,seg.start+seg.duration-1);
      assert.equal(a.walkWeight,0);assert.equal(a.distance,b.distance);assert(Math.hypot(a.ground.x-b.ground.x,a.ground.y-b.ground.y)<1e-8);
    }
  }
}
for(const action of ['enter','exit']){const seg=VisitWorld.ramen.segments.find(s=>s.action===action),s=VisitWorld.sample(VisitWorld.ramen,seg.start+seg.duration*.5);assert(Math.abs(Math.sin(s.heading))<.6,'doorway must show back/front rather than a sliding profile');}
for(let t=0;t<240;t+=.25){const p=VisitWorld.population(t,8);assert.equal(p.length,8);assert.equal(new Set(p.map(s=>s.id)).size,8);assert.equal(p.filter(s=>s.zone!==undefined).length,3);}
for(const action of ['open-door']){
  const seg=VisitWorld.ramen.segments.find(s=>s.action===action);assert(seg.duration<=1.5,'door slide should be about twice as fast as the first attempt');
  let first;
  for(let f=0;f<=60;f++){
    const s=VisitWorld.sample(VisitWorld.ramen,seg.start+seg.duration*f/61),a=VisitPose.pose(s);
    assert.equal(s.walkWeight,0,'opening the door must not involve walking sideways');
    assert(a.cleanBody,'door reach needs an underpainted arm-free torso');
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
let meals=0;
for(const plan of [VisitWorld.ramen,VisitWorld.counter]){
  const segment=plan.segments.find(s=>s.options.meal);assert.equal(segment.duration,60);
  let first,min=1,max=0;
  for(let t=1.5;t<59;t+=.1){
    const s=VisitWorld.sample(plan,segment.start+t),a=VisitPose.pose(s);assert.equal(s.seat,1);assert.equal(s.walkWeight,0);
    assert(a.meal&&a.meal.reachError<.01,'eating arm cannot reach bowl/mouth');min=Math.min(min,a.meal.lift);max=Math.max(max,a.meal.lift);
    assert.equal(s.heading,plan===VisitWorld.ramen?Math.PI:0,'diners must face straight in/out');
    assert.equal(a.meal.hidden,plan===VisitWorld.counter,'counter eating is hidden by her back');
    assert(a.diningBody,'seated meals need sleeve-free torso art');
    for(const arm of a.q.arms)for(const key of ['shoulder','elbow','hand','tip'])assert((arm[key].depth-a.q.hips.depth)*(plan===VisitWorld.counter?1:-1)>0,'meal arms must be on the chest side of the torso');
    if(plan===VisitWorld.ramen)assert.equal(s.door,0,'door must stay closed throughout the indoor meal');
    if(!first)first=a;
    a.q.legs.forEach((l,i)=>assert(Math.hypot(l.foot.x-first.q.legs[i].foot.x,l.foot.y-first.q.legs[i].foot.y)<1e-8,'seated feet drifted'));
    assert(Math.hypot(a.q.legs[0].ankle.x-a.q.legs[0].hip.x,a.q.legs[0].ankle.y-a.q.legs[0].hip.y)<a.p.height*.4,'seated leg failed to bend');
  }
  assert(min<.05&&max>.95,'meal must scoop and lift, with pauses between bites');meals++;
}
// The last twelve seconds are a single closing action, not another bite loop.
for(const plan of [VisitWorld.ramen,VisitWorld.counter]){
  const seg=plan.segments.find(s=>s.options.meal),at=t=>VisitPose.pose(VisitWorld.sample(plan,seg.start+t));
  const bite=at(plan===VisitWorld.ramen?1.5:3.5),rest=VisitPose.pose({...VisitWorld.sample(plan,seg.start+(plan===VisitWorld.ramen?1.5:3.5)),meal:false});
  assert(bite.q.head.y>rest.q.head.y+2,'head must dip toward the lifted chopsticks');
  bite.q.arms.forEach(arm=>assert(Math.sign(arm.shoulder.x-bite.q.hips.x)*(arm.elbow.x-arm.shoulder.x)>0,'bite elbows should flare outward'));
  let previous,finishes=0,wasDrinking=false;
  for(let frame=1;frame<60*60;frame++){
    const t=frame/60,a=at(t),m=a.meal;
    assert(a.headDip>=0&&a.headDip<=1&&m.bowlLift>=0&&m.bowlLift<=1);
    if(m.sip>.9&&!wasDrinking)finishes++;wasDrinking=m.sip>.9;
    if(t>49.5&&t<58){
      assert.equal(m.grasp,1);assert.equal(m.chopsticks,0);assert.equal(m.lift,0,'no noodle bites during the broth finish');
      a.q.arms.forEach(arm=>{const side=Math.sign(arm.shoulder.x-a.q.hips.x);assert(Math.hypot(arm.hand.x-(m.bowl.x+side*7),arm.hand.y-(m.bowl.y+3))<.01,'hand left the held bowl');});
    }
    if(previous){assert(Math.abs(m.bowl.y-previous.meal.bowl.y)<.3,'bowl teleported');assert(Math.abs(a.q.head.y-previous.q.head.y)<.3,'head nod snapped');}
    previous=a;
  }
  assert.equal(finishes,1,'exactly one final drink per meal');
  const sip=at(54),down=at(58);assert(sip.meal.bowl.y<sip.meal.tableBowl.y-5&&sip.headDip>.8,'lift bowl to the lowered mouth');
  assert(Math.abs(sip.meal.bowl.y-sip.meal.mouth.y)<.01,'bowl rim must meet the mouth');
  assert.equal(down.meal.bowl.y,down.meal.tableBowl.y);assert.equal(down.headDip,0);assert.equal(down.meal.broth,0);
}
const closer=VisitWorld.ramen.segments.find(s=>s.action==='auto-close');
const clear=VisitWorld.sample(VisitWorld.ramen,closer.start);assert(clear.ground.x>170&&clear.zone==='interior','closer started before the person cleared the doorway');
assert(contacts>80&&plants>5000);
console.log(JSON.stringify({poses,handleContacts:contacts,plantedContacts:plants,smoothRoutesAndTurns:true,offscreenLoops:true,stationaryDoorGesture:true,visibleFlowerBend:true,oneMinuteSeatedMeals:meals,automaticDoor:true,eightResidents:true,headDips:true,flaredElbows:true,twoHandedBrothFinish:true}));
