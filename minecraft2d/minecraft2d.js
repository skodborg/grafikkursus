
var gl;

var BLOCK_SIZE = 20;
var GRID_SIZE = 25;
var BLOCK_WIDTH = 0.08;

var cIndex = 0; // current selected color index

var vBuffer; // vertice Buffer
var cBuffer; // color Buffer

var vPosition;
var vColor;

var shouldPaintWireFrame = false;
var currMousePos;

var world = []; // 25x100 with 20x20 per block - assumes canvas of size 500x500
var player; // holds the player object

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

	$('#material').change(function() {
      cIndex = $('#material option:selected').attr('value');
  });

	prepopulateWorld();
  player = new Player(0,12);

  console.log(player);

  pBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, pBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(player.getVertices()), gl.STATIC_DRAW );

	vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "vertices"), gl.STATIC_DRAW );

  vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "colors"), gl.STATIC_DRAW );
  
  vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

	render();
}

function paintWireFrame(mouseGridPos) {
	var ll = gridToWorld(mouseGridPos[0],mouseGridPos[1]);
  var tl = vec2(ll[0], ll[1] + BLOCK_WIDTH);
  var tr = vec2(ll[0] + BLOCK_WIDTH, ll[1] + BLOCK_WIDTH);
  var lr = vec2(ll[0] + BLOCK_WIDTH, ll[1]);

	var currBoxCorners = [ll, tl, tr, lr];
	var colorOfWireFrame = [colors[5],colors[5],colors[5],colors[5]];

	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(currBoxCorners) , gl.STATIC_DRAW );
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colorOfWireFrame), gl.STATIC_DRAW );
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
}

function worldToBuffer(array2d, whatToGet) {
	var result = [];
	for (var i = 0; i < array2d.length; i++) {
		for(var j = 0; j < array2d[i].length; j++) {
			var entry = array2d[i][j];
			if(whatToGet === "vertices") {
				if (entry != undefined) {
					result = result.concat(entry.getCorners());
				}
			}
			if(whatToGet === "colors") {
				if (entry != undefined) {
					result = result.concat(entry.color);
				}
			}
		}
	}
	return flatten(result);
}

function clickedSquare(p) {
	var clickedBlock = world[p[0]][p[1]];
	if (world[p[0]][p[1]] == undefined) { //We clicked the sky
		if (getNeighbours(p[0], p[1]).length > 0) {//We do have a neighbour, so we can build box
			var newBlock = new Block(p[0], p[1], colors[cIndex]);
			 world[p[0]][p[1]] = newBlock;

			gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
		  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "vertices"), gl.STATIC_DRAW );
		  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

		  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
		  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "colors"), gl.STATIC_DRAW );
		  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

	  	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
		}
	}
	else { //We clicked on an existing box
		world[p[0]][p[1]] = undefined;

		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
	  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "vertices"), gl.STATIC_DRAW );
	  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

	  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
	  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "colors"), gl.STATIC_DRAW );
	  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

	  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
	}
}

function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );

	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

	var length = worldToBuffer(world, "vertices").length;
	for (var i = 0; i < length/2; i+=4) {
		gl.lineWidth(2.0);
		gl.drawArrays( gl.TRIANGLE_STRIP, i, 4);
	}

	if (shouldPaintWireFrame) {
		//paintWireFrame(currMousePos);
		//gl.drawArrays( gl.LINE_LOOP, 0, 4);
	}

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

  shouldPaintWireFrame = currBlock != undefined ||
      getNeighbours(currGrid[0], currGrid[1]).length > 0;
  currMousePos = currGrid;
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
      player.moveLeft();
			break;
		case 38:
			player.jump();
			break;
		case 39:
      player.moveRight();
			break;
		case 40:
			// maybe duck
			break;
	}
}