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

var vTexCoordLoc;

var sunPosition = vec4(60, 0, -60, 1);
var sunPositionLoc;
var sunAmbient = vec4(0.2,0.2,0.2,1);
var sunDiffuse = vec4(1,1,1,1);
var sunSpecular = vec4(1,1,1,1);
var sunAmbientLoc;
var sunDiffuseLoc;
var sunSpecularLoc;
var sunIsVisible = false;

var moonPosition = vec4(-60, 0, 60, 1);
var moonPositionLoc;
var moonAmbient = vec4(0.0,0.0,0.05,1);
var moonDiffuse = vec4(0,0,0.5,1);
var moonSpecular = vec4(0,0,0.5,1);
var moonAmbientLoc;
var moonDiffuseLoc;
var moonSpecularLoc;
var moonIsVisible = true;

var torchAmbient = vec4(0.0, 0.0, 0.0, 1);
var torchDiffuse = vec4(1.0, 0.1, 0.0, 1);
var torchSpecular = vec4(1.0, 0.05, 0.0, 1);
var torchAmbientLoc;
var torchDiffuseLoc;
var torchSpecularLoc;
var torchIsVisible = true;

var dark = vec4(0,0,0,1);


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
var texImage;
var texture;
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
var fboTexture;
var framebuffer;
var vGridPosLoc;
var color = new Uint8Array(4);
var paintWireframe = false;
var currWireframeX;
var currWireframeY;
var currWireframeZ;


function init() {


  texImage = document.getElementById("texImage");
  configureTexture(texImage);

    CENTER_CURSOR_X = canvas.width / 2;
    CENTER_CURSOR_Y = canvas.height / 2;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0, 0);


    // Initialize FBO
    /*framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    framebuffer.width = 1024;
    framebuffer.height = 1024;

    fboTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fboTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);

    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTexture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
    
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        alert('Framebuffer Not Complete');
    }

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);*/



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

    vGridPosLoc = gl.getAttribLocation( program, "vGridPos" );
    gl.enableVertexAttribArray( vGridPosLoc );


    vSBRotationMatrixLoc = gl.getUniformLocation( program, "vSBRotationMatrix" );


  // Associate out shader variables with our data buffer
  vNormalLoc = gl.getAttribLocation( program, "vNormal" );
  gl.enableVertexAttribArray( vNormalLoc );

  sunPositionLoc = gl.getUniformLocation( program, "sunPosition" );
  sunAmbientLoc = gl.getUniformLocation( program, "sunAmbient" );
  sunDiffuseLoc = gl.getUniformLocation( program, "sunDiffuse" );
  sunSpecularLoc = gl.getUniformLocation( program, "sunSpecular" );

  moonPositionLoc = gl.getUniformLocation( program, "moonPosition" );
  moonAmbientLoc = gl.getUniformLocation( program, "moonAmbient" );
  moonDiffuseLoc = gl.getUniformLocation( program, "moonDiffuse" );
  moonSpecularLoc = gl.getUniformLocation( program, "moonSpecular" );

  torchAmbientLoc = gl.getUniformLocation( program, "torchAmbient" );
  torchDiffuseLoc = gl.getUniformLocation( program, "torchDiffuse" );
  torchSpecularLoc = gl.getUniformLocation( program, "torchSpecular" );


  vTexCoordLoc = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer( vTexCoordLoc, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vTexCoordLoc );


  shininessLoc = gl.getUniformLocation( program, "shininess" );

  vNormalMatrixLoc = gl.getUniformLocation( program, "vNormalMatrix");

  lightsOn("sun");
  lightsOut("moon");
  lightsOut("torch");

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

  sunPosition = multmv(rotate(0.1, vec3(1,0,1)), sunPosition);
  moonPosition = multmv(rotate(0.1, vec3(1,0,1)), moonPosition);

  if(sunPosition[1] < -10) {
    lightsOut("sun");
  } else {
    lightsOn("sun");
  }
  if(moonPosition[1] < -10) {
    lightsOut("moon");
    lightsOut("torch");
  } else {
    lightsOn("moon");
    lightsOn("torch");
  }

  gl.uniform4fv(sunPositionLoc, flatten(sunPosition));
  gl.uniform4fv(moonPositionLoc, flatten(moonPosition));

  gl.uniform1f(shininessLoc, shininess);

  player.handleKeys();
  player.updatePosition();
  camera.update();
  updateNormalMatrix();

  gl.uniformMatrix3fv(vNormalMatrixLoc, false, flatten(vNormalMatrix) );

  spinningBlockTheta = (spinningBlockTheta + 4) % 360;

  lastTime = currTime;
}

function lightsOut(source) {
  switch (source) {
    case "sun":
      if(!sunIsVisible) break;
      sunIsVisible = false;
      gl.uniform4fv(sunAmbientLoc, flatten(dark));
      gl.uniform4fv(sunDiffuseLoc, flatten(dark));
      gl.uniform4fv(sunSpecularLoc, flatten(dark));
      break;
    case "moon":
      if(!moonIsVisible) break;
      moonIsVisible = false;
      gl.uniform4fv(moonAmbientLoc, flatten(dark));
      gl.uniform4fv(moonDiffuseLoc, flatten(dark));
      gl.uniform4fv(moonSpecularLoc, flatten(dark));
      break;
    case "torch":
      if(!torchIsVisible) break;
      torchIsVisible = false;
      gl.uniform4fv(torchAmbientLoc, flatten(dark));
      gl.uniform4fv(torchDiffuseLoc, flatten(dark));
      gl.uniform4fv(torchSpecularLoc, flatten(dark));
      break;
  }
}

function lightsOn(source) {
  switch (source) {
    case "sun":
      if(sunIsVisible) break;
      sunIsVisible = true;
      gl.uniform4fv(sunAmbientLoc, flatten(sunAmbient));
      gl.uniform4fv(sunDiffuseLoc, flatten(sunDiffuse));
      gl.uniform4fv(sunSpecularLoc, flatten(sunSpecular));
      break;
    case "moon":
      if(moonIsVisible) break;
      moonIsVisible = true;
      gl.uniform4fv(moonAmbientLoc, flatten(moonAmbient));
      gl.uniform4fv(moonDiffuseLoc, flatten(moonDiffuse));
      gl.uniform4fv(moonSpecularLoc, flatten(moonSpecular));
      break;
    case "torch":
      if(torchIsVisible) break;
      torchIsVisible = true;
      gl.uniform4fv(torchAmbientLoc, flatten(torchAmbient));
      gl.uniform4fv(torchDiffuseLoc, flatten(torchDiffuse));
      gl.uniform4fv(torchSpecularLoc, flatten(torchSpecular));
      break;
  }
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

function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(program, "texture"),0);
}