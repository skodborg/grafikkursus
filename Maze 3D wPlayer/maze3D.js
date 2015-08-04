var gl;
var maze = [];
for(var i = 0; i < 25; i++){
    maze.push([]);
}
var blocked = false;
var animInterval = 0;
var animDirection = "left";
var vArray = [];
var camPos;
var camCenter;
var moveDirection = vec2(1,0);
var camDirection = vec3(moveDirection[0],moveDirection[1],0);
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
    initCamera();
    drawMaze();

    window.onkeydown = handleKeyPress;

    gl.enable(gl.DEPTH_TEST);

    //Load data onto GPU
    vBuffer = gl.createBuffer();
    vIndexBuffer = gl.createBuffer();

    // Associate out shader variables with our data buffer

    vPosition = gl.getAttribLocation( program, "vPosition" );

    fColorLoc = gl.getUniformLocation( program, "color");

    vRotationMatrixLoc = gl.getUniformLocation( program, "vRotationMatrix");

    render();
}

function left() {
    if(blocked) return;
    blocked = true;
    animDirection = "left";
    animInterval = 18;
    moveDirection = vec2(-moveDirection[1], moveDirection[0]);
    camDirection = vec3(camCenter[0] + moveDirection[0], camCenter[1] + moveDirection[1], -0.04);
}

function right() {
    if(blocked) return;
    blocked = true;
    animDirection = "right";
    animInterval = 18;
    moveDirection = vec2(moveDirection[1], -moveDirection[0]);
    camDirection = vec3(camCenter[0] + moveDirection[0], camCenter[1] + moveDirection[1], -0.04);
}

function up() {
    if(blocked) return;
    var temp = maze[camPos[0]];
    if(moveDirection[0] == 0) {
        if ( camPos[1] + moveDirection[1] >= 25 ||
             camPos[1] + moveDirection[1] < 0 ) return;
        if (temp[camPos[1] + moveDirection[1]]) return;
        camPos[1] = camPos[1] + moveDirection[1];
    } else {
        if ( camPos[0] + moveDirection[0] >= 25 ||
            camPos[0] + moveDirection[0] < 0 ) return;
        temp = maze[camPos[0]+moveDirection[0]];
        if (temp[camPos[1]]) return;
        camPos[0] = camPos[0] + moveDirection[0];
    }

    var ll = gridCoordToBlock(camPos[0], camPos[1]);
    camCenter = vec3(ll[0]+0.04,ll[1]+0.04, -0.04);
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
            //down();
            break;
    }
}

function initCamera() {
    var row;
    var colIndex;
    var rowIndex;
    do {
        colIndex = Math.floor(Math.random() * 25);
        rowIndex = Math.floor(Math.random() * 25);
        row = maze[rowIndex];
    } while (row[colIndex]);
    camPos = vec2(rowIndex, colIndex);
}

function updateCameraPosition() {

    var ll = gridCoordToBlock(camPos[0], camPos[1]);
    camCenter = vec3(ll[0]+0.04,ll[1]+0.04, -0.04);

    if(animInterval > 0){
        vRotationMatrix = lookAt(camCenter, camDirection, vec3(0,0,1));
        if(animDirection == "left") {
            vRotationMatrix = mult(rotate(5 * animInterval, vec3(0, 1, 0)), vRotationMatrix);
        } else {
            vRotationMatrix = mult(rotate(-5 * animInterval, vec3(0, 1, 0)), vRotationMatrix);
        }
        vRotationMatrix = mult(perspective(45,1,0.001,5), vRotationMatrix);
        animInterval--;
    } else {
        blocked = false;

        vRotationMatrix = lookAt(camCenter, camDirection, vec3(0,0,1));

        vRotationMatrix = mult(perspective(45,1,0.001, 5),vRotationMatrix);
    }

    gl.uniformMatrix4fv(vRotationMatrixLoc, false, flatten(vRotationMatrix));
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

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    updateCameraPosition();

    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, vIndexBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vIndices), gl.STATIC_DRAW );

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

    window.requestAnimFrame(render);
}