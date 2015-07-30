
var gl;
var lines = [];
var cross = [];
var circle = [];
var GRID_SIZE = 3;
var cross_circle = true;

var lineBuffer;
var crossBuff;
var circleBuff;
var vPosition;
//Used for conversion between canvas and world coordinates
var CANVAS_HEIGHT; //Are set in init
var CANVAS_WIDTH; //Are set in init
var WORLD_X_START = -1;
var WORLD_Y_START = -1;
var WORLD_WIDTH = 2;
var WORLD_HEIGHT = 2;


function init() {
	$('canvas').on('mousedown', handleMouseDown);

	lines.push(vec2(-0.333,1.0));
	lines.push(vec2(-0.333,-1.0));
	lines.push(vec2(0.333,1.0));
	lines.push(vec2(0.333,-1.0));
	lines.push(vec2(1.0,-0.333));
	lines.push(vec2(-1.0,-0.333));
	lines.push(vec2(1.0,0.333));
	lines.push(vec2(-1.0,0.333));

	lineBuffer = gl.createBuffer();
  	gl.bindBuffer( gl.ARRAY_BUFFER, lineBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(lines), gl.STATIC_DRAW );

  	vPosition = gl.getAttribLocation( program, "vPosition" );
  	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  	gl.enableVertexAttribArray( vPosition );

  	crossBuff = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, crossBuff);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(cross), gl.STATIC_DRAW);

	circleBuff = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, circleBuff);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(circle), gl.STATIC_DRAW);


	render();
}



function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );


  	gl.bindBuffer( gl.ARRAY_BUFFER, lineBuffer );
  	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.drawArrays(gl.LINES, 0 , lines.length);


  	gl.bindBuffer( gl.ARRAY_BUFFER, crossBuff );
  	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.drawArrays(gl.LINES, 0 , cross.length);

	gl.bindBuffer( gl.ARRAY_BUFFER, circleBuff );
  	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  	for(var i = 0; i < circle.length; i += 63) {
		gl.drawArrays(gl.LINE_LOOP, i , 63);
	}

	window.requestAnimFrame(render);
}

function handleMouseDown(event) {
	var point = canvasToWorldCoords(event.clientX, event.clientY);
	var coords = worldToGridCoords(point[0], point[1]);
	if(cross_circle) {
		createCross(coords[0], coords[1]);
		gl.bindBuffer( gl.ARRAY_BUFFER, crossBuff );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(cross), gl.STATIC_DRAW );
	} else {
		createCircle(coords[0], coords[1]);
		gl.bindBuffer( gl.ARRAY_BUFFER, circleBuff );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(circle), gl.STATIC_DRAW );
	}
	cross_circle = !cross_circle;

}

function createCircle(x, y) {
	for(var i = 0; i < 2 * Math.PI; i += 0.1) {
		circle.push(scale(0.3333,vec2(Math.cos(i) + (x * 2) - 2, Math.sin(i) + (y * 2) - 2)));
	}
}

function createCross(x, y) {
	var lb = vec2(-1 + (x * 0.66), -1 + (y * 0.66));
	var rt = vec2(lb[0] + 0.66, lb[1] + 0.66);
	var lt = vec2(-1 + (x * 0.66), -1 + (y * 0.66) + 0.66);
	var rb = vec2(lb[0] + 0.66, lb[1] + 0.66 - 0.66);
	cross.push(lb);
	cross.push(rt);
	cross.push(lt);
	cross.push(rb);
}

function canvasToWorldCoords(x, y) {
	var canvasX = x;
	var canvasY = y;
	var worldX = WORLD_X_START + ((WORLD_WIDTH * canvasX) / CANVAS_WIDTH);
	var worldY = WORLD_Y_START + ((WORLD_HEIGHT * (CANVAS_HEIGHT - canvasY)) / CANVAS_WIDTH);
	return [worldX, worldY];
}

function worldToGridCoords(x, y) {
	var gridX = Math.floor((GRID_SIZE / 2) + ((GRID_SIZE * x) / WORLD_WIDTH));
	var gridY = Math.floor((GRID_SIZE / 2) + ((GRID_SIZE * y) / WORLD_HEIGHT));
	return [gridX, gridY];
}


