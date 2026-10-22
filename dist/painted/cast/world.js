(function(root){
  'use strict';
  var profiles={
    original:{id:'original',name:'Original neighbor',scale:1,pace:1},
    tall:{id:'tall',name:'Taller neighbor',scale:1.09,pace:1},
    blouse:{id:'blouse',name:'Ponytail & blue blouse',scale:1,pace:1,art:'blouse',hideBag:true},
    yukata:{id:'yukata',name:'Man in a yukata',scale:1.06,pace:.92,art:'yukata',hideBag:true,proportions:{width:1.10}},
    child:{id:'child',name:'Child',scale:.50,pace:.8,art:'child',hideBag:true,proportions:{legs:.88,arms:.95,headRise:.02},booster:true}
  },ids=Object.keys(profiles);
  function dress(state,id){
    var p=profiles[id],s=Object.assign({},state,{character:id,bodyScale:p.scale,proportions:p.proportions});
    var g=s.ground||root.AlleyWorld.project(s.x,s.z);s.ground=g;s.height=182*p.scale*g.scale;s.inFrame=g.x+s.height*.4>0&&g.x-s.height*.4<1600;
    if(p.booster){
      s.seatRaise=s.table==='inside'?15:11;s.mealGrip=9;
      // The child cannot reach this adult-height handle. The same entrance
      // opens automatically; no invisible stretch or floating hand contact.
      if(s.grip){s.grip=0;s.automaticDoor=true;}
    }
    return s;
  }
  function scene(time,id,mode){
    if(mode==='walk')return ids.map(function(name,i){
      var speed=name==='child'?50:65,route=root.CrowdWorld.routes.sidewalk;
      var s=(time*speed+180+i*290)%route.length,p=route.sample(s),g=root.AlleyWorld.project(p.x,p.z);
      return dress({id:'walk-'+name,x:p.x,z:p.z,s:s,sign:1,distance:s,walkWeight:1,heading:Math.atan2(p.dx,p.dz),phase:'street',route:route,ground:g,inFrame:true},name);
    });
    if(mode==='turns'){
      var s=Object.assign({id:'selected'},root.AlleyWorld.at(time));return [dress(s,id)];
    }
    var others=0;
    return root.VisitWorld.population(time,8).map(function(s){return dress(s,s.id==='ramen-visitor'||s.id==='counter-diner'?id:ids[(others++)%ids.length]);});
  }
  root.CastWorld={profiles:profiles,ids:ids,dress:dress,scene:scene};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.CastWorld;
})(typeof window!=='undefined'?window:globalThis);
