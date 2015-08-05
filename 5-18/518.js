var gl;
var billBoard = [];
var vPositions = [];
var vPositionLoc
var vColorLoc;
var vBuffer;
var cBuffer;
var bBuffer;
var vColors = [];
//Camera position
var xAngle = 0;
var yAngle = 0;
//Camera matrix components
var modelViewMatrix, projectionMatrix;
var rotationXMatrix, rotationYMatrix;
var transMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var applyCam = 1;
var applyCamLoc;

var near = 0.3;
var far = 4.0;
var  fovy = 60.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio



function init() {
    window.onkeydown = handleKeyPress;
    //Setup points
    setupObjects();

    //Object vertices
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vPositions), gl.STATIC_DRAW );

    vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );
    //Object colors
    fBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, fBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vColors), gl.STATIC_DRAW );

    vColorLoc = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorLoc );

    bBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(billBoard), gl.STATIC_DRAW );

    gl.enable(gl.DEPTH_TEST);

    setupCamera();

    applyCamLoc = gl.getUniformLocation( program, "applyCam" );
    gl.uniform1f(applyCamLoc, applyCam);

    render();
}

function setupCamera() {
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    transMatrix = translate(0,0,-2);
    rotationXMatrix = new mat4();
    rotationYMatrix = new mat4();
    moveCamera();
    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    applyCam = 1;
    gl.uniform1f(applyCamLoc, applyCam);
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.drawArrays(gl.TRIANGLES, 0, vPositions.length);

    applyCam = 0;
    gl.uniform1f(applyCamLoc, applyCam);

    gl.bindBuffer( gl.ARRAY_BUFFER, bBuffer );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(billBoard), gl.STATIC_DRAW );
    gl.drawArrays(gl.TRIANGLES, 0, billBoard.length);


    requestAnimFrame(render);
}



function moveCamera() {
    modelViewMatrix = transMatrix;
    var R = new mat4();
    R = mult(R, rotationXMatrix);
    R = mult(R, rotationYMatrix);
    modelViewMatrix = mult(transMatrix, R);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );


}

function handleKeyPress(event){
    switch (event.keyCode) {
        //Movement
        case 37:
            rotY(2);
            break;
        case 38:
            rotX(2);
            break;
        case 39:
            rotY(-2);
            break;
        case 40:
            rotX(-2);
            break;
        //Rotation
        case 65:
            left();
            break;
        case 87:
            forward();
            break;
        case 68:
            right();
            break;
        case 83:
            backward();
            break;
    }
}

function rotX(angle) {
    xAngle += angle;
    rotationXMatrix = rotate(xAngle, vec3(1,0,0));
    moveCamera();    
}

function rotY(angle) {
    yAngle += angle;
    rotationYMatrix = rotate(yAngle, vec3(0,1,0));
    moveCamera();
}

function left() {
    transMatrix[0][3] += 0.1;
    moveCamera();
}
function right() {
    transMatrix[0][3] -= 0.1;
    moveCamera();
}
function forward() {
    transMatrix[2][3] += 0.1;
    moveCamera();
}
function backward() {
    transMatrix[2][3] -= 0.1;
    moveCamera();
}


function setupObjects() {
    var initPoints = [vec4(-1, -0.5, 0, 1),
                  vec4(0, 0.5, 0, 1),
                  vec4(1, -0.5, 0, 1),

                  vec4(-1, -0.5, 0, 1),
                  vec4(1, -0.5, 0, 1),
                  vec4(0,-0.5,1,1),

                  vec4(-1, -0.5, 0, 1),
                  vec4(0, 0.5, 0, 1),
                  vec4(0,-0.5,1,1),

                  vec4(1, -0.5, 0, 1),
                  vec4(0, 0.5, 0, 1),
                  vec4(0,-0.5,1,1)];

    var initColors = [vec4(1,1,1,1),
                    vec4(1,1,1,1),
                    vec4(1,1,1,1),

                    vec4(0,0,0,1),
                    vec4(0,0,0,1),
                    vec4(0,0,0,1),

                    vec4(0,1,0,1),
                    vec4(0,1,0,1),
                    vec4(0,1,0,1),

                    vec4(1,1,0,1),
                    vec4(1,1,0,1),
                    vec4(1,1,0,1),
                    ];
    vPositions.push(initPoints[0]);
    vPositions.push(initPoints[1]);
    vPositions.push(initPoints[2]);
    vPositions.push(initPoints[3]);
    vPositions.push(initPoints[4]);
    vPositions.push(initPoints[5]);
    vPositions.push(initPoints[6]);
    vPositions.push(initPoints[7]);
    vPositions.push(initPoints[8]);
    vPositions.push(initPoints[9]);
    vPositions.push(initPoints[10]);
    vPositions.push(initPoints[11]);

    vPositions.push(add(initPoints[0], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[1], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[2], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[3], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[4], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[5], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[6], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[7], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[8], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[9], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[10], new vec4(1,.5,.5,1)));
    vPositions.push(add(initPoints[11], new vec4(1,.5,.5,1)));

    vColors.push(initColors[0]);
    vColors.push(initColors[1]);
    vColors.push(initColors[2]);
    vColors.push(initColors[3]);
    vColors.push(initColors[4]);
    vColors.push(initColors[5]);
    vColors.push(initColors[6]);
    vColors.push(initColors[7]);
    vColors.push(initColors[8]);
    vColors.push(initColors[9]);
    vColors.push(initColors[10]);
    vColors.push(initColors[11]);

    vColors.push(initColors[0]);
    vColors.push(initColors[1]);
    vColors.push(initColors[2]);
    vColors.push(initColors[3]);
    vColors.push(initColors[4]);
    vColors.push(initColors[5]);
    vColors.push(initColors[6]);
    vColors.push(initColors[7]);
    vColors.push(initColors[8]);
    vColors.push(initColors[9]);
    vColors.push(initColors[10]);
    vColors.push(initColors[11]);

    billBoard.push(new vec4(0.0,1,-1,1));
    billBoard.push(new vec4(1,1,-1,1));
    billBoard.push(new vec4(1,0.0,-1,1));

}