var gl;

var world;

var vModelViewMatrix = mat4();
var vModelViewMatrixLoc;

var vSBRotationMatrix = mat4();
var vSBRotationMatrixLoc;

var CENTER_CURSOR_X;
var CENTER_CURSOR_Y;

var vPositionLoc;
var vNormalLoc;

var lightPosition = vec4(15, 5, 15, 1);
var lightPositionLoc;

var shininess = 100;
var shininessLoc;

var vNormalMatrix;
var vNormalMatrixLoc;

var BLOCK_SIZE = 1;
var WORLD_SIZE = 30;

var BLOCK_NORMALS = [vec4(0, 0, -1, 0),
                     vec4(1, 0, 0, 0),
                     vec4(0, 0, 1, 0),
                     vec4(-1,0, 0, 0),
                     vec4(0 ,1, 0, 0),
                     vec4(0,-1, 0, 0)];

var camera;
var player;
var crosshairDrawer;

var MOVEMENT_SPEED = 0.1;
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

// PICKING
var texture;
var framebuffer;
var vGridPosLoc;
var color = new Uint8Array(4);
var paintWireframe = false;
var currWireframeX;
var currWireframeY;
var currWireframeZ;


function init() {

    CENTER_CURSOR_X = canvas.width / 2;
    CENTER_CURSOR_Y = canvas.height / 2;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0, 0);


    // Initialize FBO
    framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    framebuffer.width = 1024;
    framebuffer.height = 1024;

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);

    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
    
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        alert('Framebuffer Not Complete');
    }

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);



    world = new World();
    camera = new Camera();
    player = new Player(WORLD_SIZE / 2, 5, WORLD_SIZE / 2, camera, world.world);
    wireframe = new Wireframe();
    // axisDrawer = new AxisDrawer(0,0,0);
    crosshair = new CrosshairDrawer(0.02);

    window.onkeydown = handleKeyPress;
    window.onkeyup = handleKeyRelease;


    // Associate out shader variables with our data buffer
    vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPositionLoc );


    // Associate out shader variables with our data buffer
    vNormalLoc = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray( vNormalLoc );


    vGridPosLoc = gl.getAttribLocation( program, "vGridPos" );
    gl.enableVertexAttribArray( vGridPosLoc );


    vSBRotationMatrixLoc = gl.getUniformLocation( program, "vSBRotationMatrix" );

    lightPositionLoc = gl.getUniformLocation( program, "lightPosition" );

    shininessLoc = gl.getUniformLocation( program, "shininess" );

    vNormalMatrixLoc = gl.getUniformLocation( program, "vNormalMatrix");

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    update();
    world.render();
    if (paintWireframe) {
        wireframe.render();
    }
    // axisDrawer.render();
    player.render();


    gl.uniform1i(gl.getUniformLocation( program, "i" ), 2);
    // TODO: change shader to avoid this uniform
    crosshair.render();
    gl.uniform1i(gl.getUniformLocation( program, "i" ), 0);


    window.requestAnimFrame(render);
}
//The function driving our animations
function update() {
    var currTime = new Date().getTime();
    elapsedTime = (currTime - lastTime) / 40;
    if(elapsedTime == 0) {
        elapsedTime = 0.00001;
    }

    lightPosition = multmv(rotate(1, vec3(1,0,1)), lightPosition);

    gl.uniform4fv(lightPositionLoc, flatten(lightPosition));
    gl.uniform1f(shininessLoc, shininess);

    player.handleKeys();
    player.updatePosition();
    camera.update();
    updateNormalMatrix();

    gl.uniformMatrix3fv(vNormalMatrixLoc, false, flatten(vNormalMatrix) );

    spinningBlockTheta = (spinningBlockTheta + 4) % 360;

    lastTime = currTime;
}

function updateNormalMatrix() {
  var temp = mult(vModelViewMatrix, vSBRotationMatrix);
  var normals = mat3();
  normals[0][0] = temp[0][0];
  normals[0][1] = temp[0][1];
  normals[0][2] = temp[0][2];
  normals[1][0] = temp[1][0];
  normals[1][1] = temp[1][1];
  normals[1][2] = temp[1][2];
  normals[2][0] = temp[2][0];
  normals[2][1] = temp[2][1];
  normals[2][2] = temp[2][2];

  vNormalMatrix = transpose(inverse(normals));
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
        //Camera
        case 67:
            // C pressed
            camera.toggleViewMode();
            break;
    }
}

function handleMouseClick(event) {

    
    
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


  if (elapsedTime > 0.5) {
    updateCursorWireframe();
  }

}

function updateCursorWireframe() {

    // RENDER OFFBUFFER
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1i(gl.getUniformLocation( program, "i" ), 1);

    // update();
    world.render();

    gl.readPixels(CENTER_CURSOR_X, CENTER_CURSOR_Y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);

    paintWireframe = true;
    var face = color[3];
    if (10 < face && face < 30) {
        wireframe.createWireframeAtGridPos(color[0], color[1], color[2]);
    }
    else if (30 < face && face < 60) {
        wireframe.createWireframeAtGridPos(color[0]+1, color[1], color[2]+1);
    }
    else if (60 < face && face < 90) {
        wireframe.createWireframeAtGridPos(color[0], color[1], color[2]+2);
    }
    else if (90 < face && face < 120) {
        wireframe.createWireframeAtGridPos(color[0]-1, color[1], color[2]+1);
    }
    else if (120 < face && face < 140) {
        wireframe.createWireframeAtGridPos(color[0], color[1]+1, color[2]+1);
    }
    else if (140 < face && face < 170) {
        wireframe.createWireframeAtGridPos(color[0], color[1]-1, color[2]+1);
    } else {
        paintWireframe = false;
    }

    // RENDER TO CANVAS
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1i(gl.getUniformLocation( program, "i" ), 0);
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