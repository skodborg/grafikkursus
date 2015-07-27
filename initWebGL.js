var debugLevel = 1;

window.onload = function initial() {
  var canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

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
  init(canvas);
};