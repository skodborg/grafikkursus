
var gl;

var BLOCK_SIZE = 20;
var GRID_SIZE = 25;

var maxNumTriangles = 1000;  
var maxNumVertices  = 3 * maxNumTriangles;

var USE_WORLD_PREPOPULATION = true;

var index = 0;
var cIndex = 0;

var vBuffer;
var cBuffer;

var world = []; // 25x25 with 20x20 per block - assumes canvas of size 500x500
var worldColors = [];

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
  if (USE_WORLD_PREPOPULATION) {
  	gl.bufferData( gl.ARRAY_BUFFER, flatten2dArray(world), gl.STATIC_DRAW );
	}
  else {
  	gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
  }
    
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  if (USE_WORLD_PREPOPULATION) {
  	gl.bufferData( gl.ARRAY_BUFFER, flatten2dArray(worldColors), gl.STATIC_DRAW );	
  }
  else {
  	gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );	
  }

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

	render();
}

function flatten2dArray(array2d) {
	var result = [];
	for (var i = 0; i < array2d.length; i++) {
		result = result.concat(array2d[i]);
	}
	return flatten(result);
}

function colorBox(boxGridCoord, color) {
	var mat_idx = getCorrespondingWorldMatrixIndex(boxGridCoord);

	worldColors[mat_idx[0]][mat_idx[1]] = color;
	worldColors[mat_idx[0]][mat_idx[1]+1] = color;
	worldColors[mat_idx[0]][mat_idx[1]+2] = color;
	worldColors[mat_idx[0]][mat_idx[1]+3] = color;
}

function getCorrespondingWorldMatrixIndex(gridPoint) {
	return [gridPoint[0],gridPoint[1]*4];
}

function clickedSquare(p) {
	var mat_idx = getCorrespondingWorldMatrixIndex(p);
	var colorToWrite;

	if (worldColors[mat_idx[0]][mat_idx[1]] == colors[6]) {
		// clicked sky, create block of selected type
		worldColors[mat_idx[0]][mat_idx[1]] = colors[cIndex];
		colorToWrite = colors[cIndex];
	}
	else {
		// clicked some existing block, change state back to sky to remove the block
		worldColors[mat_idx[0]][mat_idx[1]] = colors[6];
		colorToWrite = colors[6];
	}

	// send updated data to the GPU
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
	var bufferX = p[0] * sizeof.vec4 * 100;
	var bufferY = p[1] * sizeof.vec4 * 4;
	var bufferIdx = bufferX + bufferY;
	gl.bufferSubData(gl.ARRAY_BUFFER, bufferIdx + sizeof.vec4*0, flatten(colorToWrite));
	gl.bufferSubData(gl.ARRAY_BUFFER, bufferIdx + sizeof.vec4*1, flatten(colorToWrite));
	gl.bufferSubData(gl.ARRAY_BUFFER, bufferIdx + sizeof.vec4*2, flatten(colorToWrite));
	gl.bufferSubData(gl.ARRAY_BUFFER, bufferIdx + sizeof.vec4*3, flatten(colorToWrite));
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
	  
	  t = vec4(colors[cIndex]);
	  gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-4), flatten(t));
	  gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-3), flatten(t));
	  gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-2), flatten(t));
	  gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-1), flatten(t));

}

function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	var length = flatten2dArray(world).length;
	for (var i = 0; i < length/2; i+=4) {
		gl.drawArrays( gl.TRIANGLE_STRIP, i, 4);
	}
  window.requestAnimFrame(render);
}

function handleMouseDown(event) {
	if (USE_WORLD_PREPOPULATION) {
		clickedSquare(pointToGrid(event.clientX, event.clientY));	
	}
	else {
		createSquare(vec2(pointToGrid(event.clientX, event.clientY)));	
	}
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

function prepopulateWorld() {
	var ll = -1;
	for (var i = 0; i < GRID_SIZE; i++) {
		var tmp = [];
		var tmpcolors = [];
		for (var j = 0; j < GRID_SIZE; j++) {
			var f = i *0.08;
			var g = j *0.08;

			tmp.push(vec2(ll+f,ll+g));
			tmp.push(vec2(ll+f+0.08,ll+g));
			tmp.push(vec2(ll+f,ll+g+0.08));
			tmp.push(vec2(ll+f+0.08,ll+g+0.08));
			tmpcolors.push(colors[6]);
			tmpcolors.push(colors[6]);
			tmpcolors.push(colors[6]);
			tmpcolors.push(colors[6]);
		}
		world.push(tmp);
		worldColors.push(tmpcolors);
	}

	// create ground
	var groundRows = 8;
	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = 0; j < groundRows * 4; j++) {
			worldColors[i][j] = colors[0];
		}
	}
	colorBox([23,8], colors[0]);
	colorBox([24,8], colors[0]);
	colorBox([22,8], colors[0]);
	colorBox([24,9], colors[0]);
	colorBox([0,8], colors[0]);
	colorBox([1,8], colors[0]);
	colorBox([2,8], colors[0]);
	colorBox([3,8], colors[0]);
	colorBox([4,8], colors[0]);
	colorBox([5,8], colors[0]);
	colorBox([4,9], colors[0]);
	colorBox([3,9], colors[0]);
	colorBox([2,9], colors[0]);
	colorBox([1,9], colors[0]);
	colorBox([0,9], colors[0]);
	colorBox([1,10], colors[0]);
	colorBox([0,10], colors[0]);
	colorBox([10,8], colors[0]);
	colorBox([11,8], colors[0]);
	colorBox([12,8], colors[0]);

	// cover with grass
	colorBox([0,11], colors[3]);
	colorBox([1,11], colors[3]);
	colorBox([2,10], colors[3]);
	colorBox([3,10], colors[3]);
	colorBox([4,10], colors[3]);
	colorBox([5,9], colors[3]);
	colorBox([6,8], colors[3]);
	colorBox([7,8], colors[3]);
	colorBox([8,8], colors[3]);
	colorBox([9,8], colors[3]);
	colorBox([10,9], colors[3]);
	colorBox([11,9], colors[3]);
	colorBox([12,9], colors[3]);
	colorBox([13,8], colors[3]);
	colorBox([14,8], colors[3]);
	colorBox([15,8], colors[3]);
	colorBox([16,8], colors[3]);
	colorBox([17,8], colors[3]);
	colorBox([18,8], colors[3]);
	colorBox([19,8], colors[3]);
	colorBox([20,8], colors[3]);
	colorBox([21,8], colors[3]);
	colorBox([22,9], colors[3]);
	colorBox([23,9], colors[3]);
	colorBox([24,10], colors[3]);

	// create tree
	colorBox([18,9], colors[2]);
	colorBox([18,10], colors[2]);
	colorBox([18,11], colors[2]);
	colorBox([18,12], colors[2]);
	// leaves of tree
	colorBox([17,12], colors[3]);
	colorBox([17,13], colors[3]);
	colorBox([18,13], colors[3]);
	colorBox([19,13], colors[3]);
	colorBox([19,12], colors[3]);
	colorBox([16,11], colors[3]);
	colorBox([16,12], colors[3]);
	colorBox([16,13], colors[3]);
	colorBox([17,14], colors[3]);
	colorBox([18,14], colors[3]);
	colorBox([19,14], colors[3]);
	colorBox([20,13], colors[3]);
	colorBox([20,12], colors[3]);
	colorBox([20,11], colors[3]);
}