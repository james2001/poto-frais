//function cancelTap(){tapValid=false}function cancelHold(){if(rightClickPending){window.clearTimeout(holdTimeout);rightClickPending=false;rightClickEvent=null}}function startHold(e){if(rightClickPending)return;rightClickPending=true;rightClickEvent=e.changedTouches[0];holdTimeout=window.setTimeout("doRightClick();",800)}function doRightClick(){rightClickPending=false;var e=rightClickEvent,t=document.createEvent("MouseEvent");t.initMouseEvent("mouseup",true,true,window,1,e.screenX,e.screenY,e.clientX,e.clientY,false,false,false,false,0,null);e.target.dispatchEvent(t);t=document.createEvent("MouseEvent");t.initMouseEvent("mousedown",true,true,window,1,e.screenX,e.screenY,e.clientX,e.clientY,false,false,false,false,2,null);e.target.dispatchEvent(t);t=document.createEvent("MouseEvent");t.initMouseEvent("contextmenu",true,true,window,1,e.screenX+50,e.screenY+5,e.clientX+50,e.clientY+5,false,false,false,false,2,null);e.target.dispatchEvent(t);cancelMouseUp=true;rightClickEvent=null}function iPadTouchStart(e){var t=e.changedTouches,n=t[0],r="mouseover",i=document.createEvent("MouseEvent");i.initMouseEvent(r,true,true,window,1,n.screenX,n.screenY,n.clientX,n.clientY,false,false,false,false,0,null);n.target.dispatchEvent(i);r="mousedown";i=document.createEvent("MouseEvent");i.initMouseEvent(r,true,true,window,1,n.screenX,n.screenY,n.clientX,n.clientY,false,false,false,false,0,null);n.target.dispatchEvent(i);if(!tapValid){lastTap=n.target;tapValid=true;tapTimeout=window.setTimeout("cancelTap();",600);startHold(e)}else{window.clearTimeout(tapTimeout);if(n.target==lastTap){lastTap=null;tapValid=false;r="click";i=document.createEvent("MouseEvent");i.initMouseEvent(r,true,true,window,1,n.screenX,n.screenY,n.clientX,n.clientY,false,false,false,false,0,null);n.target.dispatchEvent(i);r="dblclick";i=document.createEvent("MouseEvent");i.initMouseEvent(r,true,true,window,1,n.screenX,n.screenY,n.clientX,n.clientY,false,false,false,false,0,null);n.target.dispatchEvent(i)}else{lastTap=n.target;tapValid=true;tapTimeout=window.setTimeout("cancelTap();",600);startHold(e)}}}function iPadTouchHandler(e){var t="",n=0;if(e.touches.length>1)return;switch(e.type){case"touchstart":if($(e.changedTouches[0].target).is("select")){return}iPadTouchStart(e);e.preventDefault();return false;break;case"touchmove":cancelHold();t="mousemove";e.preventDefault();break;case"touchend":if(cancelMouseUp){cancelMouseUp=false;e.preventDefault();return false}cancelHold();t="mouseup";break;default:return}var r=e.changedTouches,i=r[0],s=document.createEvent("MouseEvent");s.initMouseEvent(t,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,n,null);i.target.dispatchEvent(s);if(t=="mouseup"&&tapValid&&i.target==lastTap){s=document.createEvent("MouseEvent");s.initMouseEvent("click",true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,n,null);i.target.dispatchEvent(s)}}$(function(){$.extend($.support,{touch:typeof Touch=="object"});if($.support.touch){document.addEventListener("touchstart",iPadTouchHandler,false);document.addEventListener("touchmove",iPadTouchHandler,false);document.addEventListener("touchend",iPadTouchHandler,false);document.addEventListener("touchcancel",iPadTouchHandler,false)}});var lastTap=null;var tapValid=false;var tapTimeout=null;var rightClickPending=false;var rightClickEvent=null;var holdTimeout=null;var cancelMouseUp=false