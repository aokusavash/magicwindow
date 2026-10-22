const assert=require('node:assert/strict');global.window=global;
require('../dist/painted/rig.js');require('../dist/painted/walking/gaits.js');require('../dist/painted/walking/layered.js');
require('../dist/painted/alley/world.js');const actor=require('../dist/painted/alley/actor.js'),crowd=require('../dist/painted/crowd/world.js');
let locked=0,loops=0,min=8,max=0;
for(const resident of crowd.residents){let last;
  for(let f=0;f<60*30;f++){
    const s=crowd.at(f/30,resident),a=actor.pose(s);
    assert(Number.isFinite(s.x+s.z+s.heading+s.distance));assert(s.walkWeight>=0&&s.walkWeight<=1);assert(s.height>50&&s.height<240);
    if(last){
      const jump=Math.hypot(s.x-last.s.x,s.z-last.s.z);
      if(jump>5){assert(!s.inFrame&&!last.s.inFrame,'resident teleported in view');loops++;}
      if(s.walkWeight===1&&last.s.walkWeight===1&&s.sign===last.s.sign&&jump<5)a.local.legs.forEach((l,i)=>{
        const prior=last.a.local.legs[i];if(l.stance&&prior.stance&&l.phase>prior.phase&&Math.sign(l.pitch)===Math.sign(prior.pitch)){
          const key=l.pitch<0?'heel':'ball',p=a.q.legs[i][key],q=last.a.q.legs[i][key];assert(Math.hypot(p.x-q.x,p.y-q.y)<.002,'crowd planted foot slid');locked++;
        }
      });
    }
    last={s,a};
  }
}
for(let t=0;t<180;t+=.25){
  const p=crowd.population(t,8);assert.equal(new Set(p.map(s=>s.id)).size,8);assert.equal(crowd.population(t,5).length,5);
  for(let i=1;i<p.length;i++)assert(p[i-1].z>=p[i].z);
  const n=p.filter(s=>s.inFrame&&!s.hidden).length;min=Math.min(min,n);max=Math.max(max,n);
}
assert(locked>5000);assert(loops>5);assert.equal(max,8);
console.log(JSON.stringify({residents:8,fiveAndEight:true,depthOrder:true,offscreenWraps:loops,plantedContacts:locked,inFrameRange:[min,max]}));
