// WireFrame class
var WireFrame = (function () {
  var wfBuffer; // wireframe Buffer
  var uWireframeColor;
  var wireFrameCorners = [];
  var wireFrameColor;

  function WireFrame() {

    this.shouldPaintWireFrame = false;

    wireFrameCorners = [0.0, 0.0, 
                          0.0, 0.0+BLOCK_WIDTH, 
                          0.0+BLOCK_WIDTH, 0.0+BLOCK_WIDTH, 
                          0.0+BLOCK_WIDTH, 0.0];

    wfBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wfBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(wireFrameCorners), gl.STATIC_DRAW);

    uWireframeColor = gl.getUniformLocation(program, "uWireframeColor");
  }

  WireFrame.prototype.render = function() {
    if (this.shouldPaintWireFrame) {
      program = initShaders( gl, "wireframe-vertex-shader", "wireframe-fragment-shader" );
      gl.useProgram( program );
      
      currMousePosLoc = gl.getUniformLocation( program, "currMousePos" );
      gl.uniform2f( currMousePosLoc, currMousePos[0], currMousePos[1] );

      uWireframeColor = gl.getUniformLocation(program, "uWireframeColor");
      gl.uniform4f(uWireframeColor, 1.0, 0.0, 0.0, 1.0);

      gl.bindBuffer( gl.ARRAY_BUFFER, wfBuffer);
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays( gl.LINE_LOOP, 0, wireFrameCorners.length/2);
    }
  }

  return WireFrame;
})();

