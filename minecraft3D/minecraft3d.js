var gl;

var vPositionLoc;
var vColorLoc;

var BLOCK_SIZE = 1;
var WORLD_SIZE = 30;
var BLOCK_NORMALS = [vec4(0, 0, 1, 0),
                     vec4(1, 0, 0, 0),
                     vec4(0, 0,-1, 0),
                     vec4(-1,0, 0, 0),
                     vec4(0 ,1, 0, 0),
                     vec4(0,-1, 0, 0)];

var axisVertices = [];
var axisColors = [];

var camera;
var player;

var MOVEMENT_SPEED = 0.3;
var ROTATION_SPEED = 0.1;
var lastTime = new Date().getTime();
var elapsedTime = 1;

// KEYS
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var aPressed = false;
var sPressed = false;
var dPressed = false;
var wPressed = false;
var spacePressed = false;
var shiftPressed = false;

var oldMouseX = undefined;
var oldMouseY = undefined;
var mouseLeftDown = false;

function init() {
    // initializes points for painting the axis indicator lines
    initAxisLines();

    gl.enable(gl.DEPTH_TEST);
    // offsets the polygons defining the blocks from the lines outlining them
    // result is smooth outlining
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0, 0);
    world = new World();
    camera = new Camera();
    player = new Player(0, 0, -2, camera);
    wireframe = new Wireframe();

    window.onkeydown = handleKeyPress;
    window.onkeyup = handleKeyRelease;
    window.onmousemove = handleMouseMove;
    window.onmousedown = handleMouseDown;
    window.onmouseup = handleMouseUp;


    // Associate out shader variables with our data buffer
    vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPositionLoc );


    // Associate out shader variables with our data buffer
    vColorLoc = gl.getAttribLocation( program, "vColor" );
    gl.enableVertexAttribArray( vColorLoc );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    update();
    world.render();
    wireframe.render();

    // draw XYZ-indicators
    /*gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(axisVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(axisColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.LINES, 0, axisVertices.length);*/

    window.requestAnimFrame(render);
}
//The function driving our animations
function update() {
    var currTime = new Date().getTime();
    elapsedTime = (currTime - lastTime) / 40;
    if(elapsedTime == 0) {
        elapsedTime = 0.00001;
    }
    player.handleKeys();
    player.updatePosition();
    camera.update();
    lastTime = currTime;
}

function initAxisLines() {
    axisVertices = [
        vec3(0.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 0.0, 1.0)];

    axisColors = [
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 )];
}

function handleKeyPress(event){
    switch (event.keyCode) {
        //Movement
        case 37:
            leftPressed = true;
            break;
        case 38:
            upPressed = true;
            break;
        case 39:
            rightPressed = true;
            break;
        case 40:
            downPressed = true;
            break;
        //Rotation
        case 65:
            aPressed = true;
            break;
        case 87:
            wPressed = true;
            break;
        case 68:
            dPressed = true;
            break;
        case 83:
            sPressed = true;
            break;
        case 32:
            spacePressed = true;
            break;
        case 16:
            shiftPressed = true;
            break;
    }
}

function handleKeyRelease(event){
    switch (event.keyCode) {
        //Movement
        case 37:
            leftPressed = false;
            break;
        case 38:
            upPressed = false;
            break;
        case 39:
            rightPressed = false;
            break;
        case 40:
            downPressed = false;
            break;
        //Rotation
        case 65:
            aPressed = false;
            break;
        case 87:
            wPressed = false;
            break;
        case 68:
            dPressed = false;
            break;
        case 83:
            sPressed = false;
            break;
        case 32:
            spacePressed = false;
            break;
        case 16:
            shiftPressed = false;
            break;
    }
}

function handleMouseMove(event) {
    if(!mouseLeftDown) {
        return;
    }
    if(oldMouseX == undefined) {
        oldMouseX = event.clientX;
        return;
    }
    if(oldMouseY == undefined) {
        oldMouseY = event.clientY;
        return;
    }
    player.handleMouseMove((event.clientX - oldMouseX), (event.clientY - oldMouseY));
    oldMouseX = event.clientX;
    oldMouseY = event.clientY;
}

function handleMouseDown(event) {
    mouseLeftDown = true;
    oldMouseX = event.clientX;
    oldMouseY = event.clientY;
}

function handleMouseUp() {
    mouseLeftDown = false;
}


function multmv( m, v )
{
    var result = [];

    if ( m.matrix && v.length > 1 && !v.matrix ) {
        for ( var i = 0; i < 4; i++ ) {
            var sum = 0.0;
            for ( var j = 0; j < 4; j++ ) {
                sum += m[i][j]*v[j];
            }
            result.push(sum);
        }
    }

    return vec4(result);
}