var Camera = (function () {
  var xRotationMatrix;
  var yRotationMatrix;
  var translationMatrix;

  var vModelViewMatrix;
  var vModelViewMatrixLoc;

  var vProjectionMatrix;
  var vProjectionMatrixLoc;

  function Camera() {
    xRotationMatrix = mat4();
    yRotationMatrix = mat4();
    translationMatrix = translate(0,0,-2);
    vModelViewMatrix = mat4();
    vProjectionMatrix = perspective(60,1, 0.01, 3);

    vModelViewMatrixLoc = gl.getUniformLocation(program, "vModelViewMatrix");

    vProjectionMatrixLoc = gl.getUniformLocation(program, "vProjectionMatrix");

    gl.uniformMatrix4fv( vProjectionMatrixLoc, false, flatten(vProjectionMatrix));
  }

  Camera.prototype.update = function () {
    
    var vRotationMatrix = mult(xRotationMatrix, yRotationMatrix);

    vModelViewMatrix = mult(vRotationMatrix, translationMatrix);
    gl.uniformMatrix4fv( vModelViewMatrixLoc, false, flatten(vModelViewMatrix) );
  };

  //-------------------- movement ----------------------//

  Camera.prototype.rotX = function (angle) {
    xRotationMatrix = mult(xRotationMatrix, rotate(angle, vec3(1,0,0)));
  };

  Camera.prototype.rotY = function (angle) {
    yRotationMatrix = mult(yRotationMatrix, rotate(angle, vec3(0,1,0)));
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

  return Camera;
})();
