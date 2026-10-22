async()=>{
  const files={background:'../assets/street.png',sideUpper:'../assets/skin/resident-arms.png',sideLegs:'../assets/skin/resident-layered.png',props:'../assets/rig/resident.png',front:'../assets/directions/front.png',rear:'../assets/directions/rear.png',front45:'../assets/directions/front45.png',rear45:'../assets/directions/rear45.png',legs:'../assets/directions/legs.png'},images={};
  await Promise.all(Object.entries(files).map(async([k,v])=>{let i=new Image;i.src=v;await i.decode();images[k]=i;}));
  function canvas(){let c=document.createElement('canvas');c.width=1600;c.height=900;return c;}
  let a=canvas(),b=canvas(),ac=a.getContext('2d',{willReadFrequently:true}),bc=b.getContext('2d',{willReadFrequently:true}),normal=AlleyActor.renderer(ac,images,AlleyFrames),compact=AlleyActor.renderer(bc,images,AlleyFrames,{compact:true});
  let comparison={poses:0,pixels:0,error:0,largeDifferences:0};
  let poses=[-135,-90,-45,0,45,90,135,180].flatMap(h=>[.8,1.4].map(t=>AlleyWorld.at(t,h)));
  poses.push(...[5.8,8,12,16,33].map(t=>AlleyWorld.at(t)),...CrowdWorld.population(0,8));
  for(let state of poses){
    ac.clearRect(0,0,1600,900);bc.clearRect(0,0,1600,900);normal(state);compact(state);
    let x=ac.getImageData(0,0,1600,900).data,y=bc.getImageData(0,0,1600,900).data;comparison.poses++;
    for(let i=0;i<x.length;i+=4)if(x[i+3]||y[i+3]){let error=0;for(let j=0;j<4;j++)error+=Math.abs(x[i+j]-y[i+j]);comparison.pixels++;comparison.error+=error;if(error>96)comparison.largeDifferences++;}
  }
  comparison.meanChannelError=comparison.error/(comparison.pixels*4);comparison.largeDifferenceFraction=comparison.largeDifferences/comparison.pixels;
  let town=canvas(),ctx=town.getContext('2d',{willReadFrequently:true}),draw=CrowdRenderer.renderer(town,images),states=CrowdWorld.population(0,8);
  function pixels(){return ctx.getImageData(0,0,1600,900).data;}
  function changed(x,y){let n=0;for(let i=0;i<x.length;i+=4)if(Math.abs(x[i]-y[i])+Math.abs(x[i+1]-y[i+1])+Math.abs(x[i+2]-y[i+2])>6)n++;return n;}
  draw(states);let ordered=pixels();draw(states.slice().reverse());let orderChanged=changed(ordered,pixels());
  draw([]);let empty=pixels();draw([Object.assign({},AlleyWorld.at(21),{hidden:false,inFrame:true})]);let hiddenCornerChanged=changed(empty,pixels());
  draw(states);draw([]);let stalePixels=changed(empty,pixels());
  let times=[];for(let t=0;t<8;t+=.4){let start=performance.now();draw(CrowdWorld.population(t,8));times.push(performance.now()-start);}times.sort((a,b)=>a-b);
  return {comparison,orderChanged,hiddenCornerChanged,stalePixels,renderMs:{median:times[Math.floor(times.length*.5)],p95:times[Math.floor(times.length*.95)]}};
}
