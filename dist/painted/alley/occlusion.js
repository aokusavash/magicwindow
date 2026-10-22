(function(root){
  'use strict';
  // Scenery coordinates use the same 1600 × 900 plate as the actor. The old
  // x≈1147 wall cut THROUGH the bright pole (whose edge is nearer x=1160),
  // leaving a strip of hair painted on its face. Trace the actual edge and
  // the leaves extending beyond it, rather than using that imaginary wall.
  var objects=[
    {id:'left-shop-and-pole',depth:35,outline:[[0,0],[1158,0],[1162,500],[1159,530],[1160,552],[1164,565],[1160,576],[1154,603],[1154,628],[1155,648],[1154,672],[1151,700],[1148,709],[1144,717],[0,717]]},
    {id:'pole-leaf-high',depth:35,outline:[[1152,549],[1157,551],[1161,558],[1166,561],[1163,567],[1158,568],[1152,576]]},
    {id:'pole-leaf-low',depth:35,outline:[[1148,635],[1154,637],[1163,632],[1161,639],[1157,643],[1166,642],[1168,645],[1162,650],[1156,652],[1161,656],[1164,662],[1160,665],[1155,660],[1150,664],[1147,675]]},
    {id:'right-frontage',depth:35,outline:[[1268,0],[1600,0],[1600,751],[1266,751],[1253,652],[1236,528],[1245,365]]}
  ];
  function active(state,mode){return mode==='alley'?objects.filter(function(o){return state.z>o.depth;}):[];}
  function contains(outline,x,y){var inside=false;for(var i=0,j=outline.length-1;i<outline.length;j=i++){var a=outline[i],b=outline[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
  var api={objects:objects,active:active,contains:contains};root.AlleyOcclusion=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
