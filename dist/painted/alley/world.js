(function(root){
  'use strict';
  function ease(t){t=Math.max(0,Math.min(1,t));return t*t*t*(10+t*(-15+6*t));}
  function project(x,z,height){var scale=1/(1+z/620);return {x:1207+(x-1207)*scale,y:520+226*scale-(height||0)*scale,scale:scale};}
  function spline(points){
    function value(segment,t){
      var p0=points[Math.max(0,segment-1)],p1=points[segment],p2=points[segment+1],p3=points[Math.min(points.length-1,segment+2)],out={};
      ['x','z'].forEach(function(k){out[k]=.5*(2*p1[k]+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t);});return out;
    }
    var entries=[{s:0,segment:0,t:0}],length=0,last=points[0];
    for(var i=0;i<points.length-1;i++)for(var j=1;j<=64;j++){var v=value(i,j/64);length+=Math.hypot(v.x-last.x,v.z-last.z);entries.push({s:length,segment:i,t:j/64});last=v;}
    function inside(s){var lo=0,hi=entries.length-1;while(hi-lo>1){var mid=(lo+hi)>>1;if(entries[mid].s<s)lo=mid;else hi=mid;}var a=entries[lo],b=entries[hi],f=(s-a.s)/(b.s-a.s||1),segment=b.segment,t=b.t-(1-f)/64;return value(segment,Math.max(0,t));}
    function sample(s){var edge=Math.max(0,Math.min(length,s)),a=inside(Math.max(0,edge-.05)),b=inside(Math.min(length,edge+.05)),d=Math.hypot(b.x-a.x,b.z-a.z)||1,v=inside(edge);v.dx=(b.x-a.x)/d;v.dz=(b.z-a.z)/d;if(s!==edge){v.x+=v.dx*(s-edge);v.z+=v.dz*(s-edge);}return v;}
    return {length:length,sample:sample};
  }
  var path=spline([{x:750,z:72},{x:1030,z:72},{x:1110,z:75},{x:1200,z:130},{x:1207,z:220},{x:1207,z:550},{x:1125,z:810},{x:970,z:960}]);
  function integral(t){return 2.5*Math.pow(t,4)-3*Math.pow(t,5)+Math.pow(t,6);}
  function travel(t,length,speed){var ramp=.9,duration=length/speed+ramp;t=Math.max(0,Math.min(duration,t));if(t<ramp)return {s:speed*ramp*integral(t/ramp),speed:speed*ease(t/ramp),duration:duration};if(t>duration-ramp){var u=(duration-t)/ramp;return {s:length-speed*ramp*integral(u),speed:speed*ease(u),duration:duration};}return {s:speed*(t-ramp*.5),speed:speed,duration:duration};}
  function angleMix(a,b,t){var delta=Math.atan2(Math.sin(b-a),Math.cos(b-a));return a+delta*ease(t);}
  function at(seconds,mode){
    var speed=79.2,ramp=.9,route=path,out=travel(0,path.length,speed).duration,total=out*2+4.4,sign=1,s=0,distance=0,weight=0,heading,phase='street',finished=false;
    if(typeof mode==='number'){
      var angle=mode*Math.PI/180,dx=Math.sin(angle),dz=Math.cos(angle);route={length:140,sample:function(d){return {x:900+dx*d,z:72+dz*d,dx:dx,dz:dz};}};
      var run=travel(seconds,140,speed);s=run.s;distance=run.s;weight=run.speed/speed;heading=angle;phase='direction';finished=seconds>=run.duration;
    }else{
      var t=((seconds%total)+total)%total;
      if(t<out){var run=travel(t,path.length,speed);s=run.s;distance=s;weight=run.speed/speed;phase=s<370?'street':'alley-away';}
      else if(t<out+2){s=path.length;distance=path.length;var end=path.sample(s);heading=angleMix(Math.atan2(end.dx,end.dz),Math.atan2(-end.dx,-end.dz),(t-out)/2);phase='hidden-turn';}
      else if(t<out*2+2){var run=travel(t-out-2,path.length,speed);s=path.length-run.s;distance=path.length+run.s;weight=run.speed/speed;sign=-1;phase='alley-toward';}
      else{s=0;distance=path.length*2;var start=path.sample(0);heading=angleMix(Math.atan2(-start.dx,-start.dz),Math.atan2(start.dx,start.dz),(t-out*2-2)/2.4);phase='street-turn';}
    }
    var ground=route.sample(s);if(heading===undefined)heading=Math.atan2(ground.dx*sign,ground.dz*sign);
    return {x:ground.x,z:ground.z,s:s,sign:sign,heading:heading,distance:distance+120,walkWeight:weight,phase:phase,finished:finished,total:total,route:route};
  }
  var api={project:project,spline:spline,travel:travel,at:at,path:path,ease:ease};root.AlleyWorld=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
