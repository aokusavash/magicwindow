async()=>{
 const files={tall:'../assets/cast/tall.png',blouse:'../assets/cast/blouse.png',yukata:'../assets/cast/yukata.png',child:'../assets/cast/child.png',frontMealBody:'../assets/directions/front-meal.png',rearMealBody:'../assets/directions/rear-meal.png',contactBody:'../assets/directions/rear45-contact.png',props:'../assets/rig/resident.png',sideUpper:'../assets/skin/resident-arms.png',sideLegs:'../assets/skin/resident-layered.png',front:'../assets/directions/front.png',rear:'../assets/directions/rear.png',front45:'../assets/directions/front45.png',rear45:'../assets/directions/rear45.png',legs:'../assets/directions/legs.png'},images={};
 await Promise.all(Object.entries(files).map(async([name,path])=>{let image=new Image;image.src=path;await image.decode();images[name]=image;}));
 let c=document.createElement('canvas');c.width=1600;c.height=900;let ctx=c.getContext('2d',{willReadFrequently:true}),draw=CastActor.renderer(ctx,images,CastFrames),result={directions:[],heights:{},seatedHeads:[],standingHeads:[]};
 function pixels(s,render=draw){ctx.clearRect(0,0,1600,900);render(s);return ctx.getImageData(0,0,1600,900).data;}
 function coverage(data,x,y,w,h){let count=0;for(let row=Math.floor(y);row<y+h;row++)for(let col=Math.floor(x);col<x+w;col++)if(data[(row*1600+col)*4+3]>180)count++;return count;}
 for(let id of CastWorld.ids){
  for(let angle of [0,45,90,135,180,-45,-90,-135]){
   let s=CastWorld.dress(AlleyWorld.at(.7,angle),id),a=VisitPose.pose(s),data=pixels(s),ys=[];for(let y=0;y<900;y++)for(let x=400;x<1300;x++)if(data[(y*1600+x)*4+3]>180){ys.push(y);break;}
   result.standingHeads.push({id,angle,pixels:coverage(data,a.q.hips.x-a.p.height*.3,a.q.hips.y-a.p.height*.55,a.p.height*.6,a.p.height*.20)});
   result.directions.push({id,angle,pixels:coverage(data,400,350,900,540)});if(angle===90)result.heights[id]=Math.max(...ys)-Math.min(...ys)+1;
  }
  let seg=VisitWorld.ramen.segments.find(s=>s.options.meal),s=CastWorld.dress(VisitWorld.sample(VisitWorld.ramen,seg.start+3),id),a=VisitPose.pose(s),data=pixels(s);
  result.seatedHeads.push({id,pixels:coverage(data,a.q.head.x-a.p.height*.15,a.q.head.y-a.p.height*.18,a.p.height*.30,a.p.height*.30)});
 }
 // Compare the fitted portrait to its uncorrected art in both directions.
 // Neck fitting moves the head back but must leave the waistband stationary.
 result.blousePosture=[];
 for(let angle of [90,-90]){
  let s=CastWorld.dress(AlleyWorld.at(.7,angle),'blouse'),a=VisitPose.pose(s),fitted=pixels(s);
  let raw=AlleyActor.renderer(ctx,{},AlleyFrames,{compact:true,pose:VisitPose.pose,hideBag:true,views:CastActor.views(images.blouse,CastFrames.blouse,{...CastWorld.profiles.blouse,headBack:null})}),before=pixels(s,raw);
  function center(data){let sum=0,n=0;for(let y=Math.floor(a.q.hips.y-a.p.height*.52);y<a.q.hips.y-a.p.height*.31;y++)for(let x=Math.floor(a.q.hips.x-a.p.height*.3);x<a.q.hips.x+a.p.height*.3;x++){let alpha=data[(y*1600+x)*4+3]/255;sum+=x*alpha;n+=alpha;}return sum/n;}
  let waistChange=0;for(let y=Math.floor(a.q.hips.y-2);y<a.q.hips.y+2;y++)for(let x=Math.floor(a.q.hips.x-20);x<a.q.hips.x+20;x++){let i=(y*1600+x)*4;waistChange+=Math.abs(fitted[i+3]-before[i+3]);}
  function waistCenter(data){let mass=0,sum=0;for(let y=Math.floor(a.q.hips.y-2);y<a.q.hips.y+2;y++)for(let x=Math.floor(a.q.hips.x-20);x<a.q.hips.x+20;x++){let alpha=data[(y*1600+x)*4+3];mass+=alpha;sum+=alpha*x;}return sum/mass;}
  result.blousePosture.push({angle,headBack:(center(before)-center(fitted))*Math.sign(angle),waistAlphaError:waistChange/(160*255),waistCenterShift:Math.abs(waistCenter(before)-waistCenter(fitted))});
 }
 let s=CastWorld.dress({...AlleyWorld.at(.2,0),walkWeight:0,phase:'street-turn'},'yukata'),a=VisitPose.pose(s),withRobe=pixels(s);
 let bare=AlleyActor.renderer(ctx,{},AlleyFrames,{compact:true,pose:VisitPose.pose,hideBag:true,views:CastActor.views(images.yukata,CastFrames.yukata,CastWorld.profiles.yukata)}),without=pixels(s,bare);
 let area={x:a.q.hips.x-4,y:a.q.hips.y+a.p.height*.14,w:8,h:a.p.height*.16};let changed=0;for(let y=Math.floor(area.y);y<area.y+area.h;y++)for(let x=Math.floor(area.x);x<area.x+area.w;x++){let i=(y*1600+x)*4;if(Math.abs(withRobe[i]-without[i])+Math.abs(withRobe[i+1]-without[i+1])+Math.abs(withRobe[i+2]-without[i+2])>30)changed++;}result.robe={covered:coverage(withRobe,area.x,area.y,area.w,area.h),changedPixels:changed};
 return result;
}
