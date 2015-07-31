
var gl;

var BLOCK_SIZE = 20;
var GRID_SIZE = 25;
var BLOCK_WIDTH = 0.08;
var bufferLength;

var leftKeyDown = false;
var rightKeyDown = false;
var upKeyDown = false;

var cIndex = 0; // current selected color index

var vBuffer; // vertice Buffer
var cBuffer; // color Buffer

var vPosition;
var vColor;

var shouldPaintWireFrame = false;
var currMousePos;

var world = []; // 25x100 with 20x20 per block - assumes canvas of size 500x500
var player; // holds the player object
var currMousePos = vec2(-1.-1);
var currMousePosLoc;

var ripple;
var wireFrame;

var colors = [
  vec4( 0.8, 0.65, 0.0, 1.0 ), // brown
  vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
  vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
  vec4( 0.0, 0.8, 0.0, 1.0 ),  // green
  vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
  vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
  vec4( 0.6, 0.9, 0.9, 1.0 )   // light blue
];

function init(program) {

	$('canvas').on('mousedown', handleMouseDown);
	$('canvas').mousemove(handleMouseMove);

  window.onkeydown = handleKeyDown;
  window.onkeyup = handleKeyUp;

	$('#material').change(function() {
      cIndex = $('#material option:selected').attr('value');
  });

	prepopulateWorld();
  player = new Player(0,12);

	ripple = new Ripple();
	wireFrame = new WireFrame();


  pBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, pBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(player.getVertices()), gl.STATIC_DRAW );

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

  gl.bindBuffer( gl.ARRAY_BUFFER, pBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(player.getVertices()), gl.STATIC_DRAW );
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINES, 0, player.getVertices().length);

  player.updatePosition();

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
  switch (event.keyCode) {
		case 37:
        leftKeyDown = true;
			break;
		case 38:
        upKeyDown = true;
			break;
		case 39:
        rightKeyDown = true;
			break;
		case 40:
			// maybe duck
			break;
	}
}

function handleKeyUp(event) {
  switch (event.keyCode) {
    case 37:
      leftKeyDown = false;
      break;
    case 38:
      upKeyDown = false;
      break;
    case 39:
      rightKeyDown = false;
      break;
    case 40:
      break;
  }
}