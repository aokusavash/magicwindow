(function(root){
  'use strict';
  var W=root.AlleyWorld,door={x:59,y:472,width:84,height:232,travel:74,handleX:134,handleY:592};
  function ground(x,y){var scale=(y-520)/226;return {x:1207+(x-1207)/scale,z:620*(1/scale-1)};}
  function angle(a,b,t){return a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*W.ease(t);}
  function routeFor(points){
    var dense=[points[0]];
    for(var j=1;j<points.length;j++){
      var a=points[j-1],b=points[j],steps=Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/120);
      for(var k=1;k<=steps;k++)dense.push({x:a.x+(b.x-a.x)*k/steps,z:a.z+(b.z-a.z)*k/steps});
    }
    var raw=W.spline(dense),length=0,last=W.project(points[0].x,points[0].z);
    // Use apparent ground distance for these foreground visits. At the far
    // left of the off-center scene, a short doorway approach otherwise spans
    // hundreds of world units and produces tiny hurried steps for many seconds.
    for(var i=1;i<=128;i++){var p=raw.sample(raw.length*i/128),screen=W.project(p.x,p.z),scale=(screen.scale+last.scale)/2;length+=Math.hypot((screen.x-last.x)/scale,(screen.y-last.y)/(scale*.55));last=screen;}
    return {length:length,sample:function(s){
      var u=s/length*raw.length,p=raw.sample(u),a=raw.sample(u-.1),b=raw.sample(u+.1),pa=W.project(a.x,a.z),pb=W.project(b.x,b.z);
      var heading=Math.atan2(pb.x-pa.x,-(pb.y-pa.y)/.55);p.dx=Math.sin(heading);p.dz=Math.cos(heading);return p;
    }};
  }
  function build(id,initial){
    var segments=[],clock=0,distance=120,position=ground(initial[0],initial[1]),heading=-Math.PI/2,open=0;
    function move(points,speed,action,options){
      options=options||{};var route=routeFor([position].concat(points.map(function(p){return ground(p[0],p[1]);}))),duration=W.travel(0,route.length,speed).duration;
      var previous=segments[segments.length-1];
      if(previous&&!previous.route&&previous.action.indexOf('turn')===0&&!options.fixedFacing){var first=route.sample(0);heading=Math.atan2(first.dx,first.dz);previous.options.heading=heading;}
      var s={start:clock,duration:duration,route:route,speed:speed,distance:distance,heading:heading,action:action,options:options,door:open};segments.push(s);
      clock+=duration;distance+=route.length*(options.backward?-1:1);position=route.sample(route.length);heading=options.heading===undefined?Math.atan2(position.dx,position.dz):options.heading;
      if(options.doorTo!==undefined)open=options.doorTo;return s.start;
    }
    function wait(duration,action,options){
      options=options||{};var s={start:clock,duration:duration,position:position,distance:distance,heading:heading,action:action,options:options,door:open};segments.push(s);clock+=duration;
      if(options.heading!==undefined)heading=options.heading;if(options.doorTo!==undefined)open=options.doorTo;return s.start;
    }
    return {id:id,move:move,wait:wait,segments:segments,get duration(){return clock;}};
  }
  var ramen=build('ramen-visitor',[1780,746]);
  ramen.move([[690,746],[370,746],[224,746],[139,725],[104,703]],73,'approach');
  ramen.wait(.45,'turn-to-door',{heading:-Math.PI/4});
  var entrance=ramen.wait(.4,'reach-open',{gripTo:1});
  // Stay centered with both feet planted. The hand sweeps across the torso;
  // the person no longer walks sideways to carry the sliding panel along.
  ramen.wait(1.47,'open-door',{doorTo:1,grip:1});
  ramen.wait(.28,'release-open',{gripFrom:1});
  ramen.wait(.45,'turn-in',{heading:0});
  ramen.move([[104,692],[102,671]],58,'enter',{zone:'interior'});
  ramen.wait(.7,'turn-counter',{heading:Math.PI/2,zone:'interior'});
  ramen.move([[188,671]],58,'clear-door',{zone:'interior'});
  ramen.wait(1.1,'auto-close',{doorTo:0,zone:'interior'});
  ramen.move([[310,671]],58,'inside-walk',{zone:'interior'});
  ramen.wait(.85,'turn-window',{heading:Math.PI,zone:'interior'});
  ramen.wait(1.2,'sit-inside',{zone:'interior',seatTo:1,table:'inside'});
  var windowTime=ramen.wait(60,'at-counter',{zone:'interior',idle:true,counter:true,seat:1,meal:true,table:'inside'});
  ramen.wait(1.2,'stand-inside',{zone:'interior',seatFrom:1,table:'inside'});
  ramen.wait(.8,'turn-return',{heading:-Math.PI/2,zone:'interior'});
  ramen.move([[188,671]],58,'approach-exit',{zone:'interior'});
  ramen.wait(1.05,'auto-open-exit',{doorTo:1,zone:'interior'});
  ramen.move([[102,671]],58,'inside-return',{zone:'interior'});
  ramen.wait(.7,'turn-out',{heading:Math.PI,zone:'interior'});
  ramen.move([[104,692],[104,703]],58,'exit',{zone:'interior'});
  ramen.wait(1.1,'auto-close-exit',{doorTo:0});
  ramen.wait(.9,'turn-street',{heading:Math.PI});
  ramen.move([[161,731],[224,746],[380,746],[1780,746]],73,'leave');
  var counter=build('counter-diner',[-180,746]);
  counter.move([[90,746],[195,735],[232,703]],68,'approach-counter');
  counter.wait(.85,'turn-stool',{heading:0});
  var counterTime=counter.wait(1.3,'sit-counter',{seatTo:1,table:'outside'});
  var mealTime=counter.wait(60,'counter-meal',{seat:1,meal:true,table:'outside'});
  counter.wait(1.3,'stand-counter',{seatFrom:1,table:'outside'});
  counter.wait(.85,'turn-leave-counter',{heading:Math.PI*.65});
  counter.move([[280,732],[380,746],[1780,746]],68,'leave-counter');
  var browser=build('flower-browser',[1780,753]);
  browser.move([[790,753],[674,747],[632,734]],66,'approach-flowers');
  browser.wait(.8,'turn-flowers',{heading:-Math.PI/4});
  var flowerTime=browser.wait(8.5,'browse',{idle:true,browse:true});
  browser.wait(.8,'turn-leave-flowers',{heading:Math.PI*.665});
  browser.move([[674,747],[790,753],[1760,753]],66,'leave-flowers');
  function sample(plan,seconds){
    var t=((seconds%plan.duration)+plan.duration)%plan.duration,s=plan.segments[plan.segments.length-1];
    for(var i=0;i<plan.segments.length;i++)if(t<plan.segments[i].start+plan.segments[i].duration){s=plan.segments[i];break;}
    var o=s.options,u=(t-s.start)/s.duration,progress=W.ease(u),point,heading=s.heading,weight=0,arc=0,travel=0;
    if(s.route){
      var run=W.travel(t-s.start,s.route.length,s.speed);arc=run.s;travel=arc/s.route.length;point=s.route.sample(arc);weight=run.speed/s.speed;
      heading=o.heading===undefined?Math.atan2(point.dx,point.dz):o.heading;
    }else{point=s.position;if(o.heading!==undefined)heading=angle(s.heading,o.heading,u);}
    var openness=o.doorTo===undefined?s.door:s.door+(o.doorTo-s.door)*(s.route?travel:progress);
    var grip=o.grip||0;if(o.gripTo)grip=progress;if(o.gripFrom)grip=1-progress;
    var seat=o.seat||0;if(o.seatTo)seat=progress;if(o.seatFrom)seat=1-progress;
    var p=W.project(point.x,point.z),height=182*p.scale;
    // Reverse both gait travel and joint sampling for the deliberate backward
    // closing step. Feet still plant on the exact route instead of approximating
    // its movement with a separately translated straight skeleton.
    var fixed=!s.route;
    return {id:plan.id,x:point.x,z:point.z,s:arc,sign:o.backward?-1:1,route:s.route||{sample:function(){return point;}},heading:heading,distance:s.distance+arc*(o.backward?-1:1),walkWeight:weight,
      phase:fixed?'street-turn':'visit-walk',action:s.action,zone:o.zone||'street',door:openness,grip:grip,handle:{x:door.handleX-door.travel*openness,y:door.handleY},
      idle:o.idle?Math.sin((t-s.start)*1.5):0,browse:!!o.browse,counter:!!o.counter,seat:seat,meal:!!o.meal,mealTime:t-s.start,mealBlend:o.meal?W.ease((t-s.start)/1.2)*W.ease((s.duration-(t-s.start))/1.2):0,table:o.table,automaticDoor:o.doorTo!==undefined&&!o.grip,
      ground:p,height:height,inFrame:p.x+height*.4>0&&p.x-height*.4<1600,hidden:false,progress:u};
  }
  ramen.offset=entrance-5;browser.offset=flowerTime-3;counter.offset=counterTime-2;
  function population(seconds,count){
    return [sample(ramen,seconds+ramen.offset),sample(counter,seconds+counter.offset),sample(browser,seconds+browser.offset)].concat(root.CrowdWorld.population(seconds,8).filter(function(s){return s.id!=='resident-1'&&s.id!=='resident-4'&&s.id!=='resident-5';}).slice(0,(count||8)-3)).sort(function(a,b){return b.z-a.z||a.id.localeCompare(b.id);});
  }
  var api={door:door,ground:ground,ramen:ramen,counter:counter,browser:browser,sample:sample,population:population,entranceTime:entrance-3-ramen.offset,windowTime:windowTime-ramen.offset,counterTime:counterTime-1-counter.offset,mealTime:mealTime-counter.offset,flowerTime:flowerTime-3-browser.offset};
  root.VisitWorld=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
