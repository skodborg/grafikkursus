var debugLevel = 1;
var gl;
var program;
window.onload = function() {
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

    //  Configure WebGL
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1, 1, 1, 1.0 );

  
  //  Load shaders and initialize attribute buffers
  
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  init();
};