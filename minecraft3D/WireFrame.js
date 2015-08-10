//Wireframe Class
var Wireframe = (function () {
	var vBuffer, cBuffer;
  function Wireframe() {
  	vBuffer = gl.createBuffer();
  	cBuffer = gl.createBuffer();  
  	this.wireframeVertices = [];
	this.wireframeColors = [];
	this.createWireframeAtGridPos(0,0,0);
  }

  Wireframe.prototype.render = function() {
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.wireframeVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.wireframeColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vNormalLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.LINES, 0, this.wireframeVertices.length);
  };

	Wireframe.prototype.createWireframeAtGridPos = function(x, y, z) {

    this.wireframeVertices = [];
    this.wireframeColors = [];

    this.wireframeVertices.push(vec4(x, y, z, 1));                                               // #1
    this.wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z, 1));                                  // #2
    this.wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z, 1));                                  // #2
    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z, 1));                     // #4
    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z, 1));                     // #4
    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z, 1));                                  // #3
    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z, 1));                                  // #3
    this.wireframeVertices.push(vec4(x, y, z, 1));                                               // #1

    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z, 1));                     // #4
    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));        // #8
    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z - BLOCK_SIZE, 1));                     // #7
    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z, 1));                                  // #3

    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z - BLOCK_SIZE, 1));                     // #7
    this.wireframeVertices.push(vec4(x, y, z - BLOCK_SIZE, 1));                                  // #5
    this.wireframeVertices.push(vec4(x, y, z - BLOCK_SIZE, 1));                                  // #5
    this.wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));                     // #6
    this.wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));                     // #6
    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));        // #8
    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));        // #8
    this.wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z - BLOCK_SIZE, 1));                     // #7

    this.wireframeVertices.push(vec4(x, y, z - BLOCK_SIZE, 1));                                  // #5
    this.wireframeVertices.push(vec4(x, y, z, 1));                                               // #1
    this.wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z, 1));                                  // #2
    this.wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));                     // #6

    
    for (var i = 0; i < 24; i++) {
        this.wireframeColors.push(vec4(0,0,0,1));
    }
  };


  return Wireframe;
})();