(function(root){
  'use strict';
  var W=root.AlleyWorld;
  var routes={
    sidewalk:W.spline([{x:-140,z:-3},{x:350,z:0},{x:850,z:3},{x:1340,z:0},{x:1740,z:-3}]),
    near:W.spline([{x:35,z:-65},{x:360,z:-77},{x:950,z:-65},{x:1640,z:-73}]),
    returnLane:W.spline([{x:-65,z:-32},{x:500,z:-35},{x:1050,z:-28},{x:1720,z:-32}]),
    alley:W.spline([{x:-240,z:-2},{x:700,z:0},{x:1030,z:0},{x:1110,z:0},{x:1194,z:100},{x:1197,z:220},{x:1197,z:550},{x:1117,z:810},{x:962,z:960}]),
    rightAlley:W.spline([{x:1810,z:-24},{x:1460,z:-20},{x:1300,z:0},{x:1220,z:100},{x:1217,z:220},{x:1217,z:550},{x:1133,z:810},{x:978,z:960}])
  };
  // Phase offsets spread people around the block from the first frame. Shared
  // lane speeds preserve spacing; route speed drives cadence via distance.
  var residents=[
    {id:'resident-1',route:'sidewalk',speed:77,sign:1,offset:4.9,seed:19},
    {id:'resident-2',route:'alley',speed:75,sign:1,offset:11,seed:61,roundTrip:true},
    {id:'resident-3',route:'returnLane',speed:79,sign:-1,offset:16.5,seed:103},
    {id:'resident-4',route:'near',speed:72,sign:1,offset:8.3,seed:47},
    {id:'resident-5',route:'sidewalk',speed:77,sign:1,offset:12.5,seed:139},
    {id:'resident-6',route:'returnLane',speed:79,sign:-1,offset:4.7,seed:171},
    {id:'resident-7',route:'rightAlley',speed:81,sign:1,offset:32,seed:211,roundTrip:true},
    {id:'resident-8',route:'near',speed:72,sign:1,offset:15.9,seed:251}
  ];
  function at(seconds,resident){
    var route=routes[resident.route],duration=W.travel(0,route.length,resident.speed).duration,wait=resident.roundTrip?3.2:3,total=resident.roundTrip?duration*2+wait+1.2:duration;
    var t=((seconds+resident.offset)%total+total)%total,s,sign=resident.sign,distance,weight=0,heading,phase='street';
    if(resident.roundTrip&&t>=duration&&t<duration+wait){
      s=route.length;distance=route.length;var end=route.sample(s),a=Math.atan2(end.dx,end.dz),delta=Math.PI;
      heading=a+delta*W.ease((t-duration)/wait);phase='hidden-turn';
    }else if(resident.roundTrip&&t>=duration+wait){
      var run=W.travel(t-duration-wait,route.length,resident.speed);s=route.length-run.s;sign=-1;distance=route.length+run.s;weight=run.speed/resident.speed;phase='alley-toward';
    }else{
      var run=W.travel(t,route.length,resident.speed);s=sign>0?run.s:route.length-run.s;distance=run.s;weight=run.speed/resident.speed;
      if(resident.roundTrip)phase='alley-away';
    }
    var point=route.sample(s);if(heading===undefined)heading=Math.atan2(point.dx*sign,point.dz*sign);
    var ground=W.project(point.x,point.z),h=182*ground.scale;
    return {id:resident.id,x:point.x,z:point.z,s:s,sign:sign,distance:distance+resident.seed,walkWeight:weight,heading:heading,phase:phase,route:route,ground:ground,height:h,inFrame:ground.x+h*.4>0&&ground.x-h*.4<1600,hidden:phase==='hidden-turn'};
  }
  function population(seconds,count){return residents.slice(0,count).map(function(r){return at(seconds,r);}).sort(function(a,b){return b.z-a.z||a.id.localeCompare(b.id);});}
  var api={routes:routes,residents:residents,at:at,population:population};root.CrowdWorld=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
