(function(root){
 'use strict';
 var data=root.WalkCapture,means={};Object.keys(data.samples).forEach(function(k){means[k]=data.samples[k].reduce(function(a,v){return a.map(function(x,i){return x+v[i]/data.count;});},[0,0,0]);});
 function sample(key,phase){var f=((phase%1+1)%1)*data.count,i=Math.floor(f),t=f-i,points=data.samples[key];return points[i].map(function(v,k){return v+(points[(i+1)%data.count][k]-v)*t;});}
 function phase(distance,h){return ((distance/(h*.57))%1+1)%1;}
 function smoothMax(a,b,e){return (a+b+Math.hypot(a-b,e))/2;}
 function localPose(p,meshes){
  var q=root.PaintedGaits.pose(Object.assign({},p,{gaitTuning:undefined}),meshes),h=p.height,u=phase(p.distance,h),balance=sample('hips',u),old={x:q.hips.x,y:q.hips.y};
  var gait=root.PaintedGaits.profiles[p.gait],duty=gait.duty,step=h*gait.step;
  q.legs.forEach(function(l,i){
   if(l.stance)return;
   var t=(l.phase-duty)/(1-duty),key=(i?'right':'left')+'Ankle',start=sample(key,duty-i*.5),end=sample(key,-i*.5),now=sample(key,u);
   var progress=(now[2]-start[2])/(end[2]-start[2]),target=-step*duty+2*step*duty*Math.max(-.08,Math.min(1.08,progress));
   var weight=root.AlleyWorld.ease(t/.14)*root.AlleyWorld.ease((1-t)/.14),offset=(l.anchor.x-(p.x-p.direction*h*.0125)-(i?-2:2))/p.direction;
   var dx=p.direction*(target-offset)*weight,clearance=Math.min(h*.03,Math.max(0,now[1]-(start[1]+(end[1]-start[1])*t))*h*.30),dy=(l.lift-clearance)*weight;
   ['ankle','foot','ball','toe','heel','anchor'].forEach(function(k){l[k].x+=dx;l[k].y+=dy;});l.lift-=dy;
  });
  var dx=(balance[2]-means.hips[2])*h*.30;
  var y=p.y-h*(.508+(balance[1]-means.hips[1])*.65),length=h*.48;
  q.legs.forEach(function(l){var x=l.ankle.x-l.hip.x-dx,limit=l.ankle.y-Math.sqrt(Math.max(1,length*length-x*x));y=smoothMax(y,limit,h*.002);});
  q.hips.x+=dx;q.hips.y=y;var dy=y-old.y;
  [q.shoulders,q.head,q.nose,q.bag].forEach(function(v){v.x+=dx;v.y+=dy;});
  q.legs.forEach(function(l){l.hip.x+=dx;l.hip.y=y;var ik=root.PaintedRig.solve(l.hip,l.ankle,length*.49,length*.51,-p.direction);l.knee=ik.joint;l.error=ik.error;l.extensionWeight=0;});
  q.arms.forEach(function(arm,i){
   var prefix=i?'right':'left',s=sample(prefix+'Shoulder',u),e=sample(prefix+'Elbow',u),w=sample(prefix+'Hand',u);arm.shoulder.x+=dx;arm.shoulder.y+=dy;
   function bone(a,b,len,from){var v=b.map(function(x,k){return x-a[k];}),d=Math.hypot.apply(Math,v)||1;return {x:from.x+p.direction*v[2]/d*h*len,y:from.y-v[1]/d*h*len};}
   arm.elbow=bone(s,e,.16,arm.shoulder);arm.hand=bone(e,w,.125,arm.elbow);var vx=arm.hand.x-arm.elbow.x,vy=arm.hand.y-arm.elbow.y,d=Math.hypot(vx,vy)||1;arm.tip={x:arm.hand.x+vx/d*h*.045,y:arm.hand.y+vy/d*h*.045};
  });q.referencePhase=u;return q;
 }
 function rotate(v,o,a){var x=v.x-o.x,y=v.y-o.y;v.x=o.x+x*Math.cos(a)-y*Math.sin(a);v.y=o.y+x*Math.sin(a)+y*Math.cos(a);}
 function actor(state){
  var a=root.AlleyActor.pose(Object.assign({},state,{gaitPose:localPose})),q=a.q,h=a.p.height,u=phase(state.distance,182*(state.bodyScale||1)),hip=sample('hips',u),chest=sample('chest',u);
  // Capture drives a restrained projected torso lean and shoulder offsets.
  // Painted view changes remain authored; this is not a volumetric torso.
  var tilt=(chest[2]-means.chest[2])*.55*Math.sin(state.heading)+(chest[0]-means.chest[0])*.45*Math.cos(state.heading);
  a.lean=tilt;var sway=(hip[0]-means.hips[0])*h*.65*Math.cos(state.heading);
  [q.hips,q.shoulders,q.head,q.bag].forEach(function(v){v.x+=sway;});
  q.legs.forEach(function(l){l.hip.x+=sway;var t=(l.ankle.y-l.knee.y)/(l.ankle.y-l.hip.y);l.knee.x+=sway*t;});
  [q.shoulders,q.head].forEach(function(v){rotate(v,q.hips,tilt);});
  q.arms.forEach(function(arm,i){var k=i?'rightShoulder':'leftShoulder',r=sample(k,u),shift=(r[2]-means[k][2])*h*.45*Math.sin(state.heading);['shoulder','elbow','hand','tip'].forEach(function(k){arm[k].x+=sway;rotate(arm[k],q.hips,tilt);arm[k].x+=shift;});});
  a.referencePhase=u;return a;
 }
 function state(seconds,id,degrees){
  var angle=degrees*Math.PI/180,dx=Math.sin(angle),dz=Math.cos(angle),route={sample:function(s){return {x:900+dx*s,z:-60+dz*s,dx:dx,dz:dz};}};
  var raw={id:'reference-'+id,x:900,z:-60,s:0,sign:1,distance:seconds*65,heading:angle,walkWeight:1,phase:'direction',route:route,inFrame:true};return root.CastWorld.dress(raw,id);
 }
 root.ReferenceWalk={sample:sample,phase:phase,localPose:localPose,actor:actor,state:state,means:means};
})(typeof window!=='undefined'?window:globalThis);
