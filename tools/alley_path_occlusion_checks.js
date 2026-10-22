async()=>{
  const active=AlleyOcclusion.active,previous=AlleyStudy.state(),ctx=document.getElementById('world').getContext('2d');
  const image=new Image();image.src='../assets/street.png';await image.decode();
  const background=document.createElement('canvas');background.width=1600;background.height=900;
  const bgctx=background.getContext('2d');bgctx.drawImage(image,0,0,1600,900);const bg=bgctx.getImageData(0,0,1600,900).data;
  const returnEnd=2*AlleyWorld.travel(0,AlleyWorld.path.length,79.2).duration+2;
  const report={outbound:{frames:0,clippedFrames:0,maxClippedPixels:0},return:{frames:0,clippedFrames:0,maxClippedPixels:0}};
  try{
    for(const direction of ['outbound','return'])for(let frame=0;frame<=24;frame++){
      const t=5.2+frame*.1,time=direction==='outbound'?t:returnEnd-t,state=AlleyWorld.at(time),p=AlleyWorld.project(state.x,state.z),h=182*p.scale;
      const x=Math.floor(p.x-h*.42),y=Math.floor(p.y-h*1.12),w=Math.ceil(h*.84),height=Math.ceil(h*1.12+9);
      AlleyOcclusion.active=active;AlleyStudy.inspect(time);const actual=ctx.getImageData(x,y,w,height).data;
      // At the mouth she is in front of the pole, then clear of it as she
      // heads deeper. Compare the full character region to an unmasked draw.
      AlleyOcclusion.active=()=>[];AlleyStudy.inspect(time);const clear=ctx.getImageData(x,y,w,height).data;
      let clipped=0;for(let i=0;i<actual.length;i+=4){
        const pixel=i/4,j=((y+Math.floor(pixel/w))*1600+x+pixel%w)*4;
        // Count changed CHARACTER pixels, excluding small resampling changes
        // where a clipped background draw covers only the background itself.
        if(Math.abs(clear[i]-bg[j])+Math.abs(clear[i+1]-bg[j+1])+Math.abs(clear[i+2]-bg[j+2])>12&&Math.abs(actual[i]-clear[i])+Math.abs(actual[i+1]-clear[i+1])+Math.abs(actual[i+2]-clear[i+2])>6)clipped++;
      }
      const r=report[direction];r.frames++;if(clipped)r.clippedFrames++;r.maxClippedPixels=Math.max(r.maxClippedPixels,clipped);
    }
  }finally{AlleyOcclusion.active=active;AlleyStudy.inspect(previous.seconds,previous.mode);}
  return report;
}
