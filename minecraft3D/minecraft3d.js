var gl;


var vModelViewMatrix;
var vModelViewMatrixLoc;

var vSBRotationMatrix = mat4();
var vSBRotationMatrixLoc;

var vPositionLoc;
var vNormalLoc;

var BLOCK_SIZE = 1;
var WORLD_SIZE = 10;
var BLOCK_NORMALS = [vec4(0, 0, 1, 0),
                     vec4(1, 0, 0, 0),
                     vec4(0, 0,-1, 0),
                     vec4(-1,0, 0, 0),
                     vec4(0 ,1, 0, 0),
                     vec4(0,-1, 0, 0)];

var camera;
var player;

var MOVEMENT_SPEED = 0.3;
var ROTATION_SPEED = 0.1;
var lastTime = new Date().getTime();
var elapsedTime = 1;

var spinningBlockTheta = 0;

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

function init() {

    gl.enable(gl.DEPTH_TEST);
    // offsets the polygons defining the blocks from the lines outlining them
    // result is smooth outlining
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1, 1);
    world = new World();
    camera = new Camera();
    player = new Player(5,2,5, camera);
    wireframe = new Wireframe();
    axisDrawer = new AxisDrawer(0,0,0);

    window.onkeydown = handleKeyPress;
    window.onkeyup = handleKeyRelease;


    // Associate out shader variables with our data buffer
    vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPositionLoc );


    // Associate out shader variables with our data buffer
    vNormalLoc = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray( vNormalLoc );

    vSBRotationMatrixLoc = gl.getUniformLocation( program, "vSBRotationMatrix" );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    update();
    world.render();
    wireframe.render();
    axisDrawer.render();
    player.render();


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

    spinningBlockTheta = (spinningBlockTheta + 4) % 360;

    lastTime = currTime;
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

  var movementX = event.movementX ||
      event.mozMovementX          ||
      event.webkitMovementX       ||
      0;

  var movementY = event.movementY ||
      event.mozMovementY      ||
      event.webkitMovementY   ||
      0;

  player.handleMouseMove(movementX, movementY);
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

function calcNormal( u, v ) {
    return normalize(cross(v, u));
}