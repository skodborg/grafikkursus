//Wireframe Class
var Wireframe = (function () {
	var vBuffer;//, cBuffer;
  function Wireframe() {
  	vBuffer = gl.createBuffer();  
  	this.wireframeVertices = [];
	this.createWireframeAtGridPos(0,0,0);
  }

  Wireframe.prototype.render = function() {
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.wireframeVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.LINES, 0, this.wireframeVertices.length);
  };

	Wireframe.prototype.createWireframeAtGridPos = function(x, y, z) {

    this.wireframeVertices = [];
    //this.wireframeColors = [];

    var llf = vec4(x, y, z, 1);
    var tlf = vec4(x, y + BLOCK_SIZE, z, 1);
    var trf = vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z, 1);
    var lrf = vec4(x + BLOCK_SIZE, y, z, 1);
    var llb = vec4(x, y, z + BLOCK_SIZE, 1);
    var tlb = vec4(x, y + BLOCK_SIZE, z + BLOCK_SIZE, 1);
    var trb = vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z + BLOCK_SIZE, 1);
    var lrb = vec4(x + BLOCK_SIZE, y, z + BLOCK_SIZE, 1);

    // fill wireframe of block
    this.wireframeVertices = [llf, tlf, tlf, trf, trf, lrf, lrf, llf,
      llb, tlb, tlb, trb, trb, lrb, lrb, llb,
      lrf, lrb, trf, trb, llf, llb, tlf, tlb];
  };


  return Wireframe;
})();