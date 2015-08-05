var Camera = (function () {
  var xRotationMatrix;
  var yRotationMatrix;
  var translationMatrix;

  var vModelViewMatrix;
  var vModelViewMatrixLoc;

  var vProjectionMatrix;
  var vProjectionMatrixLoc;

  function Camera () {
    xRotationMatrix = mat4();
    yRotationMatrix = mat4();
    translationMatrix = translate(0,0,-1);
    vModelViewMatrix = mat4();
    vProjectionMatrix = perspective(60,1, 0.01, 3);

    vModelViewMatrixLoc = gl.getUniformLocation(program, "vModelViewMatrix");

    vProjectionMatrixLoc = gl.getUniformLocation(program, "vProjectionMatrix");

    gl.uniformMatrix4fv( vProjectionMatrixLoc, false, flatten(vProjectionMatrix));
  }

  Camera.prototype.update = function () {
    var tempTrans = translate(-translationMatrix[0][3],
                              -translationMatrix[1][3],
                              -translationMatrix[2][3]);

    var R = mult(yRotationMatrix, xRotationMatrix);

    vModelViewMatrix = mult(translationMatrix, R);

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
