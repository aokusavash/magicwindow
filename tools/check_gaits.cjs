const assert=require('node:assert/strict');
global.window=global;
const rig=require('../dist/painted/rig.js');
const skin=require('../dist/painted/skin.js');
const {meshes}=require('../dist/painted/walking/layered.js');
const gaits=require('../dist/painted/walking/gaits.js');
function point(t,key,dir){const g=gaits.profiles[key];return {id:'resident',gait:key,x:800+dir*t*g.speed,y:746,height:182,baseHeight:182,direction:dir,distance:t*g.speed+120,travelX:dir,travelY:0,view:'side',turnScale:1,walkWeight:1,bend:0,breath:0,grip:0};}
for(const key of ['stroll','everyday','brisk'])for(const dir of [-1,1]){
  let last,overlap=false,heelSeen=false,pushSeen=false,bendSeen=false,hips=[];
  for(let frame=0;frame<=600;frame++){
    const p=point(frame/120,key,dir),q=gaits.pose(p,meshes);
    assert(q.legs.some(l=>l.stance));
    overlap ||= q.legs.every(l=>l.stance);
    hips.push(q.hips.y);
    q.legs.forEach((l,i)=>{
      assert(l.error<.01);
      assert(l.lift<=182*.027);
      assert(skin.deform(meshes[i],p,q).every(v=>Number.isFinite(v.x)&&Number.isFinite(v.y)));
      if(l.stance){
        const contact=l.pitch<0?l.heel:l.ball;
        assert(Math.abs(contact.y-p.y)<1e-7);
        if(l.pitch>0)assert(Math.abs(l.toe.y-p.y)<1e-7);
        if(last&&last.legs[i].stance&&l.phase>last.legs[i].phase&&Math.sign(l.pitch)===Math.sign(last.legs[i].pitch)){
          const previous=l.pitch<0?last.legs[i].heel:last.legs[i].ball;
          assert(Math.hypot(contact.x-previous.x,contact.y-previous.y)<.0001);
        }
        heelSeen ||= l.pitch<-.05;pushSeen ||= l.pitch>.1;
        bendSeen ||= Math.abs(Math.atan2(l.toe.y-l.ball.y,l.toe.x-l.ball.x)-Math.atan2(l.ball.y-l.foot.y,l.ball.x-l.foot.x))>.1;
      }
    });last=q;
  }
  assert(overlap&&heelSeen&&pushSeen&&bendSeen);
  assert(Math.max(...hips)-Math.min(...hips)>1);
  // No pop when a foot changes between ground support and swing.
  const g=gaits.profiles[key],cycle=2*182*g.step/g.speed;
  for(const phase of [0,g.duty,.5,(g.duty+.5)%1]){
    const t=((phase*2*182*g.step-120)/(g.speed)+cycle*5)%cycle+cycle;
    const a=gaits.pose(point(t-.00001,key,dir),meshes),b=gaits.pose(point(t+.00001,key,dir),meshes);
    assert(Math.abs(a.hips.y-b.hips.y)<.02);
    a.legs.forEach((l,i)=>['foot','knee','toe'].forEach(k=>assert(Math.hypot(l[k].x-b.legs[i][k].x,l[k].y-b.legs[i][k].y)<.02)));
  }
}
console.log('Three gaits: grounded support, planted heel/ball contacts, toe flex, low clearance, double support, body motion, finite meshes, and transition continuity pass in both directions.');
