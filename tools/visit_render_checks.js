async()=>{
  const files={background:'../assets/street.png',sideUpper:'../assets/skin/resident-arms.png',sideLegs:'../assets/skin/resident-layered.png',props:'../assets/rig/resident.png',front:'../assets/directions/front.png',rear:'../assets/directions/rear.png',front45:'../assets/directions/front45.png',rear45:'../assets/directions/rear45.png',legs:'../assets/directions/legs.png',interior:'../assets/rig/interior.png'},images={};
  await Promise.all(Object.entries(files).map(async([k,v])=>{let i=new Image;i.src=v;await i.decode();images[k]=i;}));
  let c=document.createElement('canvas');c.width=1600;c.height=900;let ctx=c.getContext('2d',{willReadFrequently:true}),draw=VisitRenderer.renderer(c,images);
  function pixels(s){draw([s],'');return ctx.getImageData(0,0,1600,900).data;}
  function diff(a,b,x,y,w,h){let n=0;for(let row=y;row<y+h;row++)for(let col=x;col<x+w;col++){let i=(row*1600+col)*4;if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>15)n++;}return n;}
  let result={door:[],interior:[]};
  for(let action of ['open-door','close-door'])for(let progress of [.15,.5,.85]){
    let segment=VisitWorld.ramen.segments.find(s=>s.action===action),state=VisitWorld.sample(VisitWorld.ramen,segment.start+segment.duration*progress),normal=pixels(state),hidden=pixels({...state,hidden:true});
    result.door.push({action,progress,visiblePixels:diff(normal,hidden,0,470,240,265),handPixels:diff(normal,hidden,Math.floor(state.handle.x)-6,586,12,12)});
  }
  for(let action of ['enter','inside-walk','at-counter','inside-return','exit'])for(let progress of [.1,.5,.9]){
    let segment=VisitWorld.ramen.segments.find(s=>s.action===action),state=VisitWorld.sample(VisitWorld.ramen,segment.start+segment.duration*progress),normal=pixels(state),hidden=pixels({...state,hidden:true}),outside=0;
    function aperture(x,y){return x>=70&&x<141&&y>=474&&y<705 || x>=155&&x<259&&y>=531&&y<597 || x>=269&&x<371&&y>=531&&y<597;}
    for(let y=470;y<735;y++)for(let x=40;x<395;x++)if(!aperture(x,y))outside+=diff(normal,hidden,x,y,1,1);
    result.interior.push({action,progress,outsidePixels:outside,windowPixels:diff(normal,hidden,154,531,218,66),counterPixels:diff(normal,hidden,154,598,218,104),doorPixels:diff(normal,hidden,61,474,80,231)});
  }
  let flower=VisitWorld.browser.segments.find(s=>s.action==='browse'),state=VisitWorld.sample(VisitWorld.browser,flower.start+3),normal=pixels(state),hidden=pixels({...state,hidden:true});result.browsePixels=diff(normal,hidden,540,530,160,220);
  draw(VisitWorld.population(8,8),'');let first=ctx.getImageData(0,0,1600,900).data;draw(VisitWorld.population(8,8).reverse(),'');let second=ctx.getImageData(0,0,1600,900).data;result.orderChanged=diff(first,second,0,0,1600,900);
  draw([],'');let empty=ctx.getImageData(0,0,1600,900).data;draw(VisitWorld.population(8,8),'');draw([],'');result.stalePixels=diff(empty,ctx.getImageData(0,0,1600,900).data,0,0,1600,900);
  return result;
}
