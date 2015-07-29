
var gl;
//var points = [];

var BLOCK_SIZE = 20;
var GRID_SIZE = 25;

var maxNumTriangles = 500;  
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;

var vBuffer;
var cBuffer;

var world = []; // 50x50 with 10x10 per block - assumes canvas of size 500x500

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

function init(program) {

	$('canvas').on('mousedown', handleMouseDown);

	vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
    
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

	render();
}

function createSquare(p) {

	  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer)

		var gridCoord = pointToGrid(p[0], p[1]);
		var blockLowerLeft = gridCoordToBlock(p[0], p[1]);

		var el = 2/GRID_SIZE;

	  t1 = vec2(blockLowerLeft);
	  t2 = vec2(t1[0], t1[1]+el);
	  t3 = vec2(t1[0]+el, t1[1]);
	  t4 = vec2(t1[0]+el, t1[1]+el);

	  gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
	  gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t3));
	  gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(t2));
	  gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(t4));
	  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
	  index += 4;
	  
	  t = vec4(colors[3]);
	  gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-4), flatten(t));
	  gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-3), flatten(t));
	  gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-2), flatten(t));
	  gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-1), flatten(t));

}

function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	for(var i = 0; i<index; i+=4)
        gl.drawArrays( gl.TRIANGLE_STRIP, i, 4 );
  window.requestAnimFrame(render);
}

function handleMouseDown(event) {
  createSquare(vec2(pointToGrid(event.clientX, event.clientY)));
}

// returns lower left corner of block
function gridCoordToBlock(x, y) {
	var halfGridSize = GRID_SIZE / 2;
	var col = (x / halfGridSize) -1;
	var row = (y / halfGridSize) -1;
	return [col, row];
}

// returns grid index corresponding to mouse click
function pointToGrid(x, y) {
  col = Math.floor(x / BLOCK_SIZE);
  row = (GRID_SIZE-1) - Math.floor(y / BLOCK_SIZE);
  return [col, row];
}