
var gl;

var BLOCK_SIZE = 20;
var GRID_SIZE = 25;
var BLOCK_WIDTH = 0.08;
var bufferLength;

var cIndex = 0; // current selected color index

var vBuffer; // vertice Buffer
var cBuffer; // color Buffer

var vPosition;
var vColor;


var currMousePos = vec2(-1.-1);
var currMousePosLoc;

var ripple;
var wireFrame;
var world = []; // 25x25 with 20x20 per block - assumes canvas of size 500x500

var colors = [
  vec4( 0.8, 0.65, 0.0, 1.0 ), // brown
  vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
  vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
  vec4( 0.0, 0.8, 0.0, 1.0 ),  // green
  vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
  vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
  vec4( 0.6, 0.9, 0.9, 1.0 )   // light blue
];



function init() {

	$('canvas').on('mousedown', handleMouseDown);
	$('canvas').mousemove(handleMouseMove);
	$(window).keypress(handleKeyDown);
	$('#material').change(function() {
      cIndex = $('#material option:selected').attr('value');
  });

	prepopulateWorld();

	ripple = new Ripple();
	wireFrame = new WireFrame();
	console.log(wireFrame);

	vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "vertices"), gl.STATIC_DRAW );

  vPosition = gl.getAttribLocation(program, "vPosition");
  gl.enableVertexAttribArray(vPosition);

  cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "colors"), gl.STATIC_DRAW );
  
  vColor = gl.getAttribLocation( program, "vColor" );
  gl.enableVertexAttribArray( vColor );

  currMousePosLoc =gl.getUniformLocation(program, "currMousePos");

	render();
}


function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );

  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

	ripple.animateRipple();

	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

	gl.drawArrays( gl.TRIANGLES, 0, bufferLength/2);

	wireFrame.render();


	window.requestAnimFrame(render);
}


function handleMouseMove(event) {
	var currGrid = pointToGrid(event.clientX, event.clientY);
	var currBlock = world[currGrid[0]][currGrid[1]];
	wireFrame.shouldPaintWireFrame = currBlock != undefined || 
												 getNeighbours(currGrid[0], currGrid[1]).length > 0;
	if (wireFrame.shouldPaintWireFrame) {
		currMousePos = gridCoordToBlock(currGrid[0], currGrid[1]);
	}
}


function handleMouseDown(event) {
	clickedSquare(pointToGrid(event.clientX, event.clientY));
}

function handleKeyDown(event) {
	var key = String.fromCharCode(event.keyCode);
	switch (key) {
		case '1':
			cIndex = 0;
			break;
		case '2':
			cIndex = 1;
			break;
		case '3':
			cIndex = 2;
			break;
		case '4':
			cIndex = 3;
			break;
		case '5':
			cIndex = 4;
			break;
	}
}