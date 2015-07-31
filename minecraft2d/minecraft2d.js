
var gl;

var BLOCK_SIZE = 20;
var GRID_SIZE = 25;
var BLOCK_WIDTH = 0.08;
var bufferLength;

var cIndex = 0; // current selected color index

var vBuffer; // vertice Buffer
var cBuffer; // color Buffer
var wfBuffer; // wireframe Buffer

var vPosition;
var vColor;
var uWireframeColor;

var shouldPaintWireFrame = false;
var wireFrameCorners = [];
var wireFrameColor;

var currMousePos = vec2(-1.-1);
var currMousePosLoc;

var ripple;

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


	wireFrameCorners = [0.0, 0.0, 
												0.0, 0.0+BLOCK_WIDTH, 
												0.0+BLOCK_WIDTH, 0.0+BLOCK_WIDTH, 
												0.0+BLOCK_WIDTH, 0.0];

  wfBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, wfBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(wireFrameCorners), gl.STATIC_DRAW);

  uWireframeColor = gl.getUniformLocation(program, "uWireframeColor");

	render();
}


function handleMouseMove(event) {
	var currGrid = pointToGrid(event.clientX, event.clientY);
	var currBlock = world[currGrid[0]][currGrid[1]];

	shouldPaintWireFrame = currBlock != undefined || 
												 getNeighbours(currGrid[0], currGrid[1]).length > 0
	if (shouldPaintWireFrame) {

	}
	currMousePos = gridCoordToBlock(currGrid[0], currGrid[1]);
}

function worldToBuffer(array2d, whatToGet) {
	var result = [];
	for (var i = 0; i < array2d.length; i++) {
		for(var j = 0; j < array2d[i].length; j++) {
			var entry = array2d[i][j];
			if(whatToGet === "vertices") {
				if (entry != undefined) {
					var resultTrianglesCorners = [];
					var entryCorners = entry.getCorners();
					resultTrianglesCorners.push(entryCorners[0]);
					resultTrianglesCorners.push(entryCorners[1]);
					resultTrianglesCorners.push(entryCorners[2]);
					resultTrianglesCorners.push(entryCorners[0]);
					resultTrianglesCorners.push(entryCorners[2]);
					resultTrianglesCorners.push(entryCorners[3]);
					result = result.concat(resultTrianglesCorners);
				}
			}
			if(whatToGet === "colors") {
				if (entry != undefined) {
					result = result.concat(entry.color);
				}
			}
		}
	}
	if(whatToGet === "vertices") {
		bufferLength = flatten(result).length;
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

		  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
		  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "colors"), gl.STATIC_DRAW );

	  	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
	  	ripple.createRipple(p[0], p[1]);
		}
	}
	else { //We clicked on an existing box
		world[p[0]][p[1]] = undefined;

		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
	  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "vertices"), gl.STATIC_DRAW );

	  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
	  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "colors"), gl.STATIC_DRAW );

	  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
	  ripple.createRipple(p[0], p[1]);
	}
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

	if (shouldPaintWireFrame) {
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