var gl;
var maze = [];
for(var i = 0; i < 25; i++){
    maze.push([]);
}
var vArray = [];
var ratPos;
var ratArray = [];
var ratBuffer;
var vBuffer;
var vPosition;
var fColorLoc;

function init(program)
{

    generateMaze();
    initRat();
    drawMaze();

    window.onkeydown = handleKeyPress;

    //Load data onto GPU
    vBuffer = gl.createBuffer();

    ratBuffer = gl.createBuffer();

    // Associate out shader variables with our data buffer

    vPosition = gl.getAttribLocation( program, "vPosition" );

    fColorLoc = gl.getUniformLocation( program, "color");

    render();
}

function left() {
    var temp = maze[ratPos[0]-1];
    if(temp[ratPos[1]]) return;
    ratPos[0] = ratPos[0] - 1
}

function right() {
    var temp = maze[ratPos[0]+1];
    if(temp[ratPos[1]]) return;
    ratPos[0] = ratPos[0] + 1
}

function down() {
    var temp = maze[ratPos[0]];
    if(ratPos[1]-1 < 0) return;
    if(temp[ratPos[1]-1]) return;
    ratPos[1] = ratPos[1] - 1
}

function up() {
    var temp = maze[ratPos[0]];
    if(ratPos[1]+1 >= 25) return;
    if(temp[ratPos[1]+1]) return;
    ratPos[1] = ratPos[1] + 1
}

function handleKeyPress(event){
    switch (event.keyCode) {
        case 37:
            left();
            break;
        case 38:
            up();
            break;
        case 39:
            right();
            break;
        case 40:
            down();
            break;
    }
}

function initRat() {
    var row;
    var colIndex;
    var rowIndex;
    do {
        colIndex = Math.floor(Math.random() * 25);
        rowIndex = Math.floor(Math.random() * 25);
        row = maze[rowIndex];
    } while (row[colIndex]);
    ratPos = vec2(rowIndex, colIndex);
}

function updateRatPosition() {
    ratArray.length = 0;
    var ll = gridCoordToBlock(ratPos[0], ratPos[1]);
    ratArray.push(vec2(ll[0]+0.01, ll[1]+0.01));
    ratArray.push(vec2(ll[0]+0.01, ll[1]+0.07));
    ratArray.push(vec2(ll[0]+0.07, ll[1]+0.01));
    ratArray.push(vec2(ll[0]+0.07, ll[1]+0.07));
}

function generateMaze() {
    for(var i = 0; i < 150; i++) {
        var row;
        var colIndex;
        do {
            row = maze[Math.floor(Math.random() * 25)];
            colIndex = Math.floor(Math.random() * 25);
        } while (row[colIndex]);
        row[colIndex] = true;
    }
}

function drawMaze() {
    vArray.length = 0;
    for(var i = 0; i < 25; i++){
        var row = maze[i];
        for(var j = 0; j < 25; j++){
            if(row[j]){
                var ll = gridCoordToBlock(i, j);
                vArray.push(ll);
                vArray.push(vec2(ll[0], ll[1]+0.08));
                vArray.push(vec2(ll[0]+0.08, ll[1]));
                vArray.push(vec2(ll[0]+0.08, ll[1]+0.08));
            }
        }
    }
}

function gridCoordToBlock(x, y) {
    var halfGridSize = 25 / 2;
    var col = (x / halfGridSize) -1;
    var row = (y / halfGridSize) -1;
    return [col, row];
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.uniform4f(fColorLoc, 0,1,0,1);

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vArray), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    for(var i = 0; i < vArray.length/4; i++){
        gl.drawArrays( gl.TRIANGLE_STRIP, i*4, 4);
    }

    updateRatPosition();


    gl.uniform4f(fColorLoc, 1,0,0,1);

    gl.bindBuffer(gl.ARRAY_BUFFER, ratBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(ratArray), gl.STATIC_DRAW);

    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimFrame(render);
}