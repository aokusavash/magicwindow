(function(root){
  'use strict';
  var WIDTH=1600, HEIGHT=900;
  function groundY(x){return 658-(x/WIDTH)*7;}
  function familyAt(seconds, pace){
    // Match the prototype's middle walking speed at this wider canvas scale.
    var baseSpeed=(.12+2*.045)*20*(WIDTH/640);
    var moveDuration=(1120/baseSpeed)/pace, pauseDuration=3, leg=moveDuration+pauseDuration;
    var phase=((seconds%(leg*2))+leg*2)%(leg*2), returning=phase>=leg;
    var local=returning?phase-leg:phase;
    var progress=Math.min(1,local/moveDuration), direction=returning?-1:1;
    var x=returning?1360-progress*1120:240+progress*1120;
    return {x:x,direction:direction,moving:local<moveDuration,gait:seconds*pace*5.2};
  }
  function anchors(family){
    // Keep the child clear of the span between the handler and the collar.
    var parentX=family.x-27, childX=family.x-70, dogX=family.x+23;
    return {
      parent:{x:parentX,y:groundY(parentX)},child:{x:childX,y:groundY(childX)},dog:{x:dogX,y:groundY(dogX)},
      hand:{x:parentX+10,y:groundY(parentX)-29},collar:{x:dogX+family.direction*9,y:groundY(dogX)-15}
    };
  }
  var api={width:WIDTH,height:HEIGHT,groundY:groundY,familyAt:familyAt,anchors:anchors};
  root.MagicWindowMotion=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
