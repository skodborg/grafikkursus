
var gl;

var BLOCK_SIZE = 20;
var GRID_SIZE = 25;
var BLOCK_WIDTH = 0.08;

var cIndex = 0; // current selected color index

var vBuffer; // vertice Buffer
var cBuffer; // color Buffer
var vPosition;
var vColor;

var world = []; // 25x100 with 20x20 per block - assumes canvas of size 500x500

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
	$(window).keypress(handleKeyDown);
	$('#material').change(function() {
      cIndex = $('#material option:selected').attr('value');
    });

	prepopulateWorld();

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

//Get neighbours of a grid element
function getNeighbours(x, y) {
	var result = [];
	if(x > 0 && world[x -1][y] != undefined) {
		result.push(world[x -1][y]);
	}
	if(world[x][y + 1] != undefined) {
		result.push(world[x][y + 1]);
	}
	if(x < GRID_SIZE-1 && world[x + 1][y] != undefined) {
		result.push(world[x + 1][y]);
	}
	if(world[x][y - 1] != undefined) {
		result.push(world[x][y - 1]);
	}
	return result;
}

function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	var length = worldToBuffer(world, "vertices").length;
	for (var i = 0; i < length/2; i+=4) {
		gl.drawArrays( gl.TRIANGLE_STRIP, i, 4);
	}
    window.requestAnimFrame(render);
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

// returns lower left corner of block
function gridCoordToBlock(x, y) {
	var halfGridSize = GRID_SIZE/2;
	var col = (x / halfGridSize) -1;
	var row = (y / halfGridSize) -1;
	return vec2(col, row);
}

// returns grid index corresponding to mouse click
function pointToGrid(x, y) {
  col = Math.floor(x / BLOCK_SIZE);
  row = (GRID_SIZE-1) - Math.floor(y / BLOCK_SIZE);
  return [col, row];
}

function prepopulateWorld() {

	for (var i = 0; i < GRID_SIZE; i++) {
		world.push([]);
	}

	var groundRows = 8;
	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = 0; j < groundRows; j++) {
				world[i][j] = new Block(i,j, colors[0]);
		}
	}

	world[23][8] = new Block(23,8, colors[0]);
	world[24][8] = new Block(24,8, colors[0]);
	world[22][8] = new Block(22,8, colors[0]);
	world[24][9] = new Block(24,9, colors[0]);
	world[0][8] = new Block(0,8, colors[0]);
	world[1][8] = new Block(1,8, colors[0]);
	world[2][8] = new Block(2,8, colors[0]);
	world[3][8] = new Block(3,8, colors[0]);
	world[4][8] = new Block(4,8, colors[0]);
	world[5][8] = new Block(5,8, colors[0]);
	world[4][9] = new Block(4,9, colors[03]);
	world[3][9] = new Block(3,9, colors[0]);
	world[2][9] = new Block(2,9, colors[0]);
	world[1][9] = new Block(1,9, colors[0]);
	world[0][9] = new Block(0,9, colors[0]);
	world[1][10] = new Block(1,10, colors[0]);
	world[0][10] = new Block(0,10, colors[0]);
	world[10][8] = new Block(10,8, colors[0]);
	world[11][8] = new Block(11,8, colors[0]);
	world[12][8] = new Block(12,8, colors[0]);

	// cover with grass
	world[0][11] = new Block(0,11, colors[3]);
	world[1][11] = new Block(1,11, colors[3]);
	world[2][10] = new Block(2,10, colors[3]);
	world[3][10] = new Block(3,10, colors[3]);
	world[4][10] = new Block(4,10, colors[3]);
	world[5][9]  = new Block(5,9, colors[3]);
	world[6][8]  = new Block(6,8, colors[3]);
	world[7][8]  = new Block(7,8, colors[3]);
	world[8][8]  = new Block(8,8, colors[3]);
	world[9][8]  = new Block(9,8, colors[3]);
	world[10][9] = new Block(10,9, colors[3]);
	world[11][9] = new Block(11,9, colors[3]);
	world[12][9] = new Block(12,9, colors[3]);
	world[13][8] = new Block(13,8, colors[3]);
	world[14][8] = new Block(14,8, colors[3]);
	world[15][8] = new Block(15,8, colors[3]);
	world[16][8] = new Block(16,8, colors[3]);
	world[17][8] = new Block(17,8, colors[3]);
	world[18][8] = new Block(18,8, colors[3]);
	world[19][8] = new Block(19,8, colors[3]);
	world[20][8] = new Block(20,8, colors[3]);
	world[21][8] = new Block(21,8, colors[3]);
	world[22][9] = new Block(22,9, colors[3]);
	world[23][9] = new Block(23,9, colors[3]);
	world[24][10] = new Block(24,10, colors[3]);

	// create tree
	world[18][9] = new Block(18,9, colors[2]);
	world[18][10] = new Block(18,10, colors[2]);
	world[18][11] = new Block(18,11, colors[2]);
	world[18][12] = new Block(18,12, colors[2]);
	world[17][12] = new Block(17,12, colors[3]);
	world[17][13] = new Block(17,13, colors[3]);
	world[18][13] = new Block(18,13, colors[3]);
	world[19][13] = new Block(19,13, colors[3]);
	world[19][12] = new Block(19,12, colors[3]);
	world[16][11] = new Block(16,11, colors[3]);
	world[16][12] = new Block(16,12, colors[3]);
	world[16][13] = new Block(16,13, colors[3]);
	world[17][14] = new Block(17,14, colors[3]);
	world[18][14] = new Block(18,14, colors[3]);
	world[19][14] = new Block(19,14, colors[3]);
	world[20][13] = new Block(20,13, colors[3]);
	world[20][12] = new Block(20,12, colors[3]);
	world[20][11] = new Block(20,11, colors[3]);
}