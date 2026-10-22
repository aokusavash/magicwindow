async()=>{
  const files={contactBody:'../assets/directions/rear45-contact.png',entrance:'../assets/rig/entrance-layers.png',background:'../assets/street.png',sideUpper:'../assets/skin/resident-arms.png',sideLegs:'../assets/skin/resident-layered.png',props:'../assets/rig/resident.png',front:'../assets/directions/front.png',rear:'../assets/directions/rear.png',front45:'../assets/directions/front45.png',rear45:'../assets/directions/rear45.png',legs:'../assets/directions/legs.png',interior:'../assets/rig/interior.png'},images={};
  await Promise.all(Object.entries(files).map(async([k,v])=>{let i=new Image;i.src=v;await i.decode();images[k]=i;}));
  let c=document.createElement('canvas');c.width=1600;c.height=900;let ctx=c.getContext('2d',{willReadFrequently:true}),draw=VisitRenderer.renderer(c,images);
  function pixels(s){draw([s],'');return ctx.getImageData(0,0,1600,900).data;}
  function diff(a,b,x,y,w,h){let n=0;for(let row=y;row<y+h;row++)for(let col=x;col<x+w;col++){let i=(row*1600+col)*4;if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>15)n++;}return n;}
  let result={door:[],interior:[]};
  for(let action of ['open-door'])for(let progress of [.15,.5,.85]){
    let segment=VisitWorld.ramen.segments.find(s=>s.action===action),state=VisitWorld.sample(VisitWorld.ramen,segment.start+segment.duration*progress),normal=pixels(state),hidden=pixels({...state,hidden:true});
    result.door.push({action,progress,visiblePixels:diff(normal,hidden,0,470,240,265),handPixels:diff(normal,hidden,Math.floor(state.handle.x)-6,586,12,12)});
  }
  // Color only the existing arm pixels in a diagnostic atlas. Unlike a plain
  // difference near the handle, this distinguishes a visible hand from the
  // torso covering that same area during the across-body portion of the slide.
  let atlas=document.createElement('canvas');atlas.width=images.rear45.width;atlas.height=images.rear45.height;
  let brush=atlas.getContext('2d');brush.drawImage(images.rear45,0,0);brush.globalCompositeOperation='source-atop';brush.fillStyle='#ff00ff';
  for(let box of AlleyFrames.rear45.slice(1,3))brush.fillRect(box.x,box.y,box.width,box.height);
  let fixture=VisitRenderer.renderer(c,{...images,rear45:atlas});result.handLayering=[];
  for(let progress of [.15,.5,.85]){
    let seg=VisitWorld.ramen.segments.find(s=>s.action==='open-door'),state=VisitWorld.sample(VisitWorld.ramen,seg.start+seg.duration*progress);fixture([state],'');
    let data=ctx.getImageData(Math.floor(state.handle.x)-6,586,12,12).data,count=0;
    for(let i=0;i<data.length;i+=4)if(data[i]>220&&data[i+1]<60&&data[i+2]>180)count++;
    result.handLayering.push({progress,coloredHandPixels:count});
  }
  for(let action of ['enter','inside-walk','at-counter','inside-return','exit'])for(let progress of [.1,.5,.9]){
    let segment=VisitWorld.ramen.segments.find(s=>s.action===action),state=VisitWorld.sample(VisitWorld.ramen,segment.start+segment.duration*progress),normal=pixels(state),hidden=pixels({...state,hidden:true}),outside=0;
    function aperture(x,y){return x>=70&&x<141&&y>=474&&y<705 || x>=155&&x<259&&y>=531&&y<597 || x>=269&&x<371&&y>=531&&y<597;}
    for(let y=470;y<735;y++)for(let x=40;x<395;x++)if(!aperture(x,y))outside+=diff(normal,hidden,x,y,1,1);
    result.interior.push({action,progress,outsidePixels:outside,windowPixels:diff(normal,hidden,154,531,218,66),counterPixels:diff(normal,hidden,154,598,218,104),doorPixels:diff(normal,hidden,61,474,80,231)});
  }
  let flower=VisitWorld.browser.segments.find(s=>s.action==='browse'),state=VisitWorld.sample(VisitWorld.browser,flower.start+3),normal=pixels(state),hidden=pixels({...state,hidden:true});result.browsePixels=diff(normal,hidden,540,530,160,220);
  let closed={...VisitWorld.sample(VisitWorld.ramen,VisitWorld.ramen.segments.find(s=>s.action==='at-counter').start+3),...VisitWorld.ground(133,671),phase:'street-turn',heading:0,seat:0,meal:false,counter:false,table:undefined,door:0};
  result.closedDoorBodyPixels=diff(pixels(closed),pixels({...closed,hidden:true}),59,472,86,232);
  result.meals=[];
  for(let plan of [VisitWorld.counter,VisitWorld.ramen]){
    let originalPose=VisitPose.pose;VisitPose.pose=s=>{let a=originalPose(s);if(a.meal)a.meal.alpha=0;return a;};let noProps=VisitRenderer.renderer(c,images);VisitPose.pose=originalPose;
    let dining=plan.segments.find(s=>s.options.meal),cx=plan===VisitWorld.counter?232:310;
    for(let t of [1.5,3.5,55]){
      let s=VisitWorld.sample(plan,dining.start+t),eating=pixels(s),rest=pixels({...s,meal:false}),standing=pixels({...s,meal:false,seat:0}),pose=VisitPose.pose(s);noProps([s],'');let propFree=ctx.getImageData(0,0,1600,900).data;
      result.meals.push({table:s.table,t,heading:s.heading,hidden:pose.meal.hidden,bowlPixels:diff(eating,propFree,cx-14,586,28,15),eatingPixels:diff(eating,propFree,cx-35,545,70,65),seatedLegPixels:diff(rest,standing,cx-40,625,80,80)});
    }
  }
  // Near-opaque foreground landmarks must stay fixed as the leaf slides.
  // The painted alpha is usually 250–253, so allow only the background
  // contribution permitted by that transparency, plus rounding.
  let hiddenDoor={...VisitWorld.sample(VisitWorld.ramen,VisitWorld.ramen.segments.find(s=>s.action==='open-door').start),hidden:true};
  let closedPixels=pixels({...hiddenDoor,door:0}),openPixels=pixels({...hiddenDoor,door:1});
  let mask=document.createElement('canvas');mask.width=1600;mask.height=900;let mc=mask.getContext('2d');
  mc.drawImage(images.entrance,906,118,259,776,43,468,39,117);mc.drawImage(images.entrance,1224,405,417,506,0,575,101,137);
  let alpha=mc.getImageData(0,0,1600,900).data,changed=0,checked=0;
  for(let i=0;i<alpha.length;i+=4)if(alpha[i+3]>=250){checked++;let limit=255-alpha[i+3]+3;if(Math.max(...[0,1,2].map(k=>Math.abs(closedPixels[i+k]-openPixels[i+k])))>limit)changed++;}
  result.fixedForeground={checked,changed};
  draw(VisitWorld.population(8,8),'');let first=ctx.getImageData(0,0,1600,900).data;draw(VisitWorld.population(8,8).reverse(),'');let second=ctx.getImageData(0,0,1600,900).data;result.orderChanged=diff(first,second,0,0,1600,900);
  draw([],'');let empty=ctx.getImageData(0,0,1600,900).data;draw(VisitWorld.population(8,8),'');draw([],'');result.stalePixels=diff(empty,ctx.getImageData(0,0,1600,900).data,0,0,1600,900);
  return result;
}
