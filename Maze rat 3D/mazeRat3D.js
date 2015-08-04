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
var vIndexBuffer;
var vPosition;
var vIndices = [];
var vLineIndices = [];
var fColorLoc;
var drawOrder = [
    1, 2, 3,
    2, 3, 4,
    3, 4, 7,
    4, 7, 8,
    7, 8, 5,
    8, 5, 6,
    5, 6, 1,
    6, 1, 2,
    2, 6, 4,
    6, 4, 8,
    1, 5, 3,
    5, 3, 7
];
var lineDrawOrder = [
    1,2,
    2,4,
    4,3,
    3,1,
    3,7,
    7,8,
    8,4,
    7,5,
    5,6,
    6,8,
    6,2,
    5,1
];

var vRotationMatrixLoc;
var vRotationMatrix = mat4();

function init()
{
    gl.clearColor(0.3, 0.3, 0.3, 1);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1,1);

    generateMaze();
    initRat();
    drawMaze();

    window.onkeydown = handleKeyPress;

    gl.enable(gl.DEPTH_TEST);

    //Load data onto GPU
    vBuffer = gl.createBuffer();
    vIndexBuffer = gl.createBuffer();
    ratBuffer = gl.createBuffer();

    // Associate out shader variables with our data buffer

    vPosition = gl.getAttribLocation( program, "vPosition" );

    fColorLoc = gl.getUniformLocation( program, "color");

    vRotationMatrixLoc = gl.getUniformLocation( program, "vRotationMatrix");

    render();
}

function left() {
    if(ratPos[0]-1 < 0) return;
    var temp = maze[ratPos[0]-1];
    if(temp[ratPos[1]]) return;
    ratPos[0] = ratPos[0] - 1
}

function right() {
    if(ratPos[0]+1 >= 25) return;
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
    ratArray.push(vec3(ll[0]+0.01, ll[1]+0.01, 0));
    ratArray.push(vec3(ll[0]+0.01, ll[1]+0.07, 0));
    ratArray.push(vec3(ll[0]+0.07, ll[1]+0.01, 0));
    ratArray.push(vec3(ll[0]+0.07, ll[1]+0.07, 0));
    ratArray.push(vec3(ll[0]+0.01, ll[1]+0.01, -0.08));
    ratArray.push(vec3(ll[0]+0.01, ll[1]+0.07, -0.08));
    ratArray.push(vec3(ll[0]+0.07, ll[1]+0.01, -0.08));
    ratArray.push(vec3(ll[0]+0.07, ll[1]+0.07, -0.08));
}

function generateMaze() {
    for(var i = 0; i < 200; i++) {
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
    var cubeCount = 0;
    for(var i = 0; i < 25; i++){
        var row = maze[i];
        for(var j = 0; j < 25; j++){
            if(row[j]) {
                var ll = gridCoordToBlock(i, j);
                vArray.push(vec3(ll[0], ll[1], 0));
                vArray.push(vec3(ll[0], ll[1] + 0.08, 0));
                vArray.push(vec3(ll[0] + 0.08, ll[1], 0));
                vArray.push(vec3(ll[0] + 0.08, ll[1] + 0.08, 0));
                vArray.push(vec3(ll[0], ll[1], -0.08));
                vArray.push(vec3(ll[0], ll[1] + 0.08, -0.08));
                vArray.push(vec3(ll[0] + 0.08, ll[1], -0.08));
                vArray.push(vec3(ll[0] + 0.08, ll[1] + 0.08, -0.08));

                var indexOffset = cubeCount * 8;
                cubeCount++;

                vIndices = vIndices.concat(
                    $.map(drawOrder, function (ii) {
                        return ii - 1 + indexOffset
                    })
                );

                vLineIndices = vLineIndices.concat(
                    $.map(lineDrawOrder, function(ii) {
                        return ii - 1 + indexOffset
                    })
                );
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

var rAngle = 0;
var rAxis = vec3(0,0,0);

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    rAngle += 1;
    rAxis = vec3((Math.sin(rAxis[0]+0.1)), (Math.sin((rAxis[1]+0.1))),0.51);

    vRotationMatrix = rotate(rAngle, rAxis);

    gl.uniformMatrix4fv(vRotationMatrixLoc, false, flatten(vRotationMatrix));

    updateRatPosition();

    gl.uniform4f(fColorLoc, 1,0,0,1);

    gl.bindBuffer(gl.ARRAY_BUFFER, ratBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(ratArray), gl.STATIC_DRAW);

    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, vIndexBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vIndices), gl.STATIC_DRAW );

    gl.drawElements( gl.TRIANGLES, drawOrder.length, gl.UNSIGNED_SHORT, 0);

    gl.uniform4f(fColorLoc, 0,1,0,1);

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vArray), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.drawElements( gl.TRIANGLES, 200*36, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, vIndexBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vLineIndices), gl.STATIC_DRAW );

    gl.uniform4f(fColorLoc, 0,0,0,1);

    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0,0);

    gl.drawElements( gl.LINES, vLineIndices.length, gl.UNSIGNED_SHORT, 0);

    console.log(vIndices.length);

    window.requestAnimFrame(render);
}