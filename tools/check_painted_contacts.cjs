const assert=require('node:assert/strict');global.window=global;
for(const n of ['rig','walking/gaits','walking/layered','alley/world','alley/actor','crowd/world','visits/world','visits/pose','cast/world','cast/frames','reference/capture','reference/motion'])require('../dist/painted/'+n+'.js');
let checks=0,maxError=0,oldError=0;
for(const id of ['blouse','tall'])for(const angle of [90,-90])for(let f=0;f<240;f++){
 let s=ReferenceWalk.state(f/120,id,angle),a=AlleyActor.pose(s),h=a.p.height,profile=CastWorld.profiles[id],near=angle>0?0:1;
 a.local.legs.forEach((l,i)=>{
  if(!l.stance)return;
  let source=i===near?0:1,view=CastFrames[id].side,b=view.legs[source],reg=view.legAnchors[source],m=view.footMetrics[source],ref=b.height*(reg.ankleY-.06)/.48,scale=h/ref;
  let sx=scale*(profile.shoeWidth||.83),sy=scale*.05*(reg.ankleY-.06)/(.48*(1-reg.ankleY)),anchor=l.pitch<0?'heel':'ball',u=anchor==='heel'?m.heelX:m.ballX;
  let px=(u-reg.ankleX)*b.width*sx,py=(1-reg.ankleY)*b.height*sy,ankle=a.q.legs[i].ankle,target=a.q.legs[i][anchor],dir=a.p.direction;
  function error(factor){let roll=dir*l.pitch*factor,x=ankle.x+Math.cos(roll)*dir*px-Math.sin(roll)*py,y=ankle.y+Math.sin(roll)*dir*px+Math.cos(roll)*py;return Math.hypot(x-target.x,y-target.y);}
  maxError=Math.max(maxError,error(1));oldError=Math.max(oldError,error(.35));assert(error(1)<.28,'registered painted sole must follow the support target');checks++;
 });
}
assert(oldError>maxError*4,'test must detect the former reduced-roll mismatch');
let support=0,maxSidewalkY=0;
for(const routeName of ['sidewalk','near','returnLane']){
 let route=CrowdWorld.routes[routeName];
 for(let t=0;t<=1;t+=.025)for(const id of CastWorld.ids){let p=route.sample(t*route.length),g=AlleyWorld.project(p.x,p.z);assert(g.y>=712&&g.y<=728,'street route must lie on the paving');let s=CastWorld.dress({x:p.x,z:p.z,s:t*route.length,sign:1,distance:t*route.length,walkWeight:1,heading:Math.atan2(p.dx,p.dz),phase:'street',route,ground:g},id),a=AlleyActor.pose(s);a.local.legs.forEach((l,i)=>{if(l.stance){let point=a.q.legs[i][l.pitch<0?'heel':'ball'];maxSidewalkY=Math.max(maxSidewalkY,point.y);assert(point.y<731,'a support foot crosses the curb');support++;}});}
}
console.log(JSON.stringify({paintedContactChecks:checks,maximumSoleTargetError:maxError,formerReducedRollError:oldError,sidewalkSupportSamples:support,maximumSidewalkSupportY:maxSidewalkY,curbTopY:732}));
