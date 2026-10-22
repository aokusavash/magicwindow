()=>{
  // Isolate surface coverage and overlap with flat colored source paintings.
  // Compare overlapping silhouettes, rather than a wrist coordinate that can
  // legitimately move clear of the trousers when an attachment is corrected.
  function canvas(w=1,h=1){let c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  function fixture(armSource,legSource,body=false,allLegs=false){
    let images={},blank=canvas();for(let k of ['sideUpper','sideLegs','props','front','rear','front45','rear45','legs'])images[k]=blank;
    images.sideUpper=canvas(1600,900);images.sideLegs=canvas(1600,900);
    function rect(c,b,color){let ctx=c.getContext('2d');ctx.fillStyle=color;ctx.fillRect(b.x,b.y,b.width,b.height);}
    if(armSource!==null)rect(images.sideUpper,PaintedLayered.arms[armSource].box,'red');
    if(legSource!==null)rect(images.sideLegs,PaintedLayered.meshes[legSource].box,'lime');
    if(allLegs){
      PaintedLayered.meshes.forEach(m=>rect(images.sideLegs,m.box,'lime'));
      images.legs=canvas(1800,900);AlleyFrames.legs.forEach(b=>rect(images.legs,b,'lime'));
    }
    if(body){
      rect(images.sideUpper,{x:205,y:31,width:429,height:819},'blue');
      for(let k of ['front','rear','front45','rear45']){let b=AlleyFrames[k][0];images[k]=canvas(b.x+b.width,b.y+b.height);rect(images[k],b,'blue');}
    }
    let c=canvas(1600,900),ctx=c.getContext('2d',{willReadFrequently:true}),draw=AlleyActor.renderer(ctx,images,AlleyFrames);
    return state=>{ctx.clearRect(0,0,1600,900);let actor=draw(state);return {actor,pixels:ctx.getImageData(0,0,1600,900).data};};
  }
  let overlaps=[];
  for(let nearArm of [false,true]){
    let arm=nearArm?0:1,leg=nearArm?1:0;
    let both=fixture(arm,leg),armOnly=fixture(arm,null),legOnly=fixture(null,leg);
    for(let heading of [-90,90]){
      let covered=0,bad=0;
      for(let t of [.6,.8,1,1.2,1.4,1.6]){
        let state=AlleyWorld.at(t,heading),all=both(state).pixels,a=armOnly(state).pixels,l=legOnly(state).pixels;
        for(let i=0;i<all.length;i+=4)if(a[i]>250&&a[i+3]>250&&l[i+1]>250&&l[i+3]>250){
          covered++;if(nearArm?(all[i]<245||all[i+1]>10):(all[i+1]<245||all[i]>10))bad++;
        }
      }
      overlaps.push({heading,nearArm,covered,bad});
    }
  }
  let bodyOnly=fixture(null,null,true),chest={checked:0,missing:0};
  for(let heading of [-135,-90,-45,0,45,90,135,180])for(let t of [.6,1,1.4]){
    let {actor,pixels}=bodyOnly(AlleyWorld.at(t,heading)),h=actor.p.height,q=actor.q;
    for(let x of [-.035,-.02,0,.02])for(let y of [-.22,-.16,-.10]){
      let sx=Math.round(q.hips.x+x*h*actor.p.direction),sy=Math.round(q.hips.y+y*h),i=(sy*1600+sx)*4;
      chest.checked++;if(pixels[i+3]<250)chest.missing++;
    }
  }
  // Garment coverage is independent of which leg is nearer this step. Compare
  // torso/leg intersections across a complete stride in all eight headings.
  let dressed=fixture(null,null,true,true),trousers=fixture(null,null,false,true),waist=[];
  for(let heading of [-135,-90,-45,0,45,90,135,180]){
    let covered=0,bad=0,exposed=0,missing=0;
    for(let t of [.5,.7,.9,1.1,1.3,1.5,1.7,1.9]){
      let state=AlleyWorld.at(t,heading),{actor,pixels:all}=dressed(state),top=bodyOnly(state).pixels,leg=trousers(state).pixels,h=actor.p.height,q=actor.q;
      for(let y=Math.floor(q.hips.y-h*.10);y<q.hips.y+h*.30;y++)for(let x=Math.floor(q.hips.x-h*.25);x<q.hips.x+h*.25;x++){
        let i=(y*1600+x)*4;if(leg[i+1]<250||leg[i+3]<250)continue;
        if(top[i+2]>250&&top[i]<5&&top[i+1]<5&&top[i+3]>250){covered++;if(all[i+2]<245||all[i]>10||all[i+1]>10)bad++;}
        if(top[i+3]===0){exposed++;if(all[i+1]<245||all[i]>10||all[i+2]>10||all[i+3]<250)missing++;}
      }
    }
    waist.push({heading,covered,bad,exposed,missing});
  }
  return {overlaps,chest,waist};
}
