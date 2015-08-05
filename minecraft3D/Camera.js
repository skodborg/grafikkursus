var Camera = (function () {
  var vRotationMatrix;
  var translationMatrix;

  var vModelViewMatrix;
  var vModelViewMatrixLoc;

  var vProjectionMatrix;
  var vProjectionMatrixLoc;

  function Camera() {
    vRotationMatrix = mat4();
    translationMatrix = translate(0,0,-2);
    vModelViewMatrix = mat4();
    vProjectionMatrix = perspective(60,1, 0.01, 3);

    vModelViewMatrixLoc = gl.getUniformLocation(program, "vModelViewMatrix");

    vProjectionMatrixLoc = gl.getUniformLocation(program, "vProjectionMatrix");

    gl.uniformMatrix4fv( vProjectionMatrixLoc, false, flatten(vProjectionMatrix));
  }

  Camera.prototype.update = function () {

    vModelViewMatrix = mult(translationMatrix, vRotationMatrix);

    gl.uniformMatrix4fv( vModelViewMatrixLoc, false, flatten(vModelViewMatrix) );
  };

  //-------------------- movement ----------------------//

  Camera.prototype.rotX = function (angle) {
    vRotationMatrix = mult(vRotationMatrix, rotate(angle, vec3(1,0,0)));
  };

  Camera.prototype.rotY = function (angle) {
    vRotationMatrix = mult(vRotationMatrix, rotate(angle, vec3(0,1,0)));
  };

  Camera.prototype.forward = function (amount) {
    translationMatrix = mult(translationMatrix, translate(0,0,amount));
  };

  Camera.prototype.backward = function (amount) {
    translationMatrix = mult(translationMatrix, translate(0,0,-amount));
  };

  Camera.prototype.left = function (amount) {
    translationMatrix = mult(translationMatrix, translate(-amount,0,0));
  };

  Camera.prototype.right = function (amount) {
    translationMatrix = mult(translationMatrix, translate(amount,0,0));
  };

  return Camera;
})();
