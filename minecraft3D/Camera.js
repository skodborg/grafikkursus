var Camera = (function () {
  var xRotationMatrix;
  var yRotationMatrix;
  var translationMatrix;
  var perspectiveMatrix;

  var overviewModelViewMatrix;
  var overviewProjectionMatrix;

  var vProjectionMatrix;
  var vProjectionMatrixLoc;

  var vModelViewMatrix;

  var overviewMode;

  function Camera() {
    xRotationMatrix = mat4();
    yRotationMatrix = mat4();
    translationMatrix = translate(0,0,-2);
    vModelViewMatrix = mat4();
    perspectiveMatrix = perspective(60,1, 0.01, 20);
    overviewModelViewMatrix = lookAt(vec3(WORLD_SIZE/2,WORLD_SIZE+10,WORLD_SIZE/2), 
                                     vec3(WORLD_SIZE/2,0,WORLD_SIZE/2), 
                                     vec3(0,0,-1));
    overviewProjectionMatrix = ortho(-WORLD_SIZE, WORLD_SIZE,
                                     -WORLD_SIZE, WORLD_SIZE,
                                     0.0001,      WORLD_SIZE+10);
    overviewMode = false;

    vModelViewMatrixLoc = gl.getUniformLocation(program, "vModelViewMatrix");
    vProjectionMatrixLoc = gl.getUniformLocation(program, "vProjectionMatrix");

    gl.uniformMatrix4fv( vProjectionMatrixLoc, false, flatten(perspectiveMatrix));
  }

  Camera.prototype.update = function () {

    if (!overviewMode) {
      var vRotationMatrix = mult(xRotationMatrix, yRotationMatrix);
      vModelViewMatrix = mult(vRotationMatrix, translationMatrix);
      vProjectionMatrix = perspectiveMatrix;
    }
    else {
      vModelViewMatrix = overviewModelViewMatrix;
      vProjectionMatrix = overviewProjectionMatrix;
    }
    gl.uniformMatrix4fv( vModelViewMatrixLoc, false, flatten(vModelViewMatrix) );
    gl.uniformMatrix4fv( vProjectionMatrixLoc, false, flatten(vProjectionMatrix) );
  };

  Camera.prototype.toggleViewMode = function() {
    overviewMode = !overviewMode;
  }

  //-------------------- movement ----------------------//

  Camera.prototype.rotX = function (angle) {
    yRotationMatrix = mult(yRotationMatrix, rotate(angle, vec3(0,1,0)));
  };

  Camera.prototype.rotY = function (angle) {
    xRotationMatrix = mult(xRotationMatrix, rotate(angle, vec3(1,0,0)));
  };

  Camera.prototype.forward = function (amount) {
    var direction = vec4(0,0,amount,0);
    direction = multmv(mult(xRotationMatrix, yRotationMatrix), direction);
    translationMatrix = mult(translationMatrix, translate(-direction[0],0, direction[2]));
  };

  Camera.prototype.backward = function (amount) {
    var direction = vec4(0,0,-amount,0);
    direction = multmv(mult(xRotationMatrix, yRotationMatrix), direction);
    translationMatrix = mult(translationMatrix, translate(-direction[0],0, direction[2]));
  };

  Camera.prototype.left = function (amount) {
    var direction = vec4(-amount,0,0,0);
    direction = multmv(mult(xRotationMatrix, yRotationMatrix), direction);
    translationMatrix = mult(translationMatrix, translate(-direction[0],0, direction[2]));
  };

  Camera.prototype.right = function (amount) {
    var direction = vec4(amount,0,0,0);
    direction = multmv(mult(xRotationMatrix, yRotationMatrix), direction);
    translationMatrix = mult(translationMatrix, translate(-direction[0],0, direction[2]));
  };

  Camera.prototype.up = function (amount) {
    var direction = vec4(0,amount,0,0);
    direction = multmv(mult(xRotationMatrix, yRotationMatrix), direction);
    translationMatrix = mult(translationMatrix, translate(-direction[0], 0, direction[2]));
  };

  Camera.prototype.move = function (vector) {
    this.forward(vector[2]);
    this.right(vector[0]);
    this.up(vector[1]);
  };

  Camera.prototype.setPosition = function (vector) {
    translationMatrix[0][3] = vector[0];
    translationMatrix[1][3] = vector[1];
    translationMatrix[2][3] = vector[2];
  };

  return Camera;
})();
