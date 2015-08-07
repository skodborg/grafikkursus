var debugLevel = 1;
var gl;
var program;
window.onload = function() {
  var canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }


  canvas.requestPointerLock = canvas.requestPointerLock ||
           canvas.mozRequestPointerLock ||
           canvas.webkitRequestPointerLock;

  document.exitPointerLock = document.exitPointerLock ||
         document.mozExitPointerLock ||
         document.webkitExitPointerLock;

  canvas.onclick = function() {
    canvas.requestPointerLock();
  }

  // Hook pointer lock state change events for different browsers
  document.addEventListener('pointerlockchange', lockChangeAlert, false);
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
  document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);

  function lockChangeAlert() {
    if(document.pointerLockElement === canvas ||
    document.mozPointerLockElement === canvas ||
    document.webkitPointerLockElement === canvas) {
      // console.log('The pointer lock status is now locked');
      document.addEventListener("mousemove", handleMouseMove, false);
    } else {
      // console.log('The pointer lock status is now unlocked');  
      document.removeEventListener("mousemove", handleMouseMove, false);
    }
  }

  // Debug
  function logGLCall(functionName, args) {   
   console.log("gl." + functionName + "(" + 
      WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");   
  } 

  function throwOnGLError(err, funcName, args) {
    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
  };

  switch(debugLevel){
    case 2: // Update gl context to show every WebGL function call
      gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);
      break;
    case 1: 
      gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
      break;

  }

    //  Configure WebGL
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.9, 0.9, 0.9, 1.0 );

  
  //  Load shaders and initialize attribute buffers
  
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  init();
};