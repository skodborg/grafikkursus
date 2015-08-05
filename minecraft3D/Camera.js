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
    translationMatrix = translate(0,0,1);
    vModelViewMatrix = mat4();
    vProjectionMatrix = perspective(60,1, 0.01, 3);

    vModelViewMatrixLoc = gl.getUniformLocation(program, "vModelViewMatrix");

    vProjectionMatrixLoc = gl.getUniformLocation(program, "vProjectionMatrix");
  }

  Camera.prototype.update = function () {
    vModelViewMatrix = mult(translationMatrix, mult(yRotationMatrix, xRotationMatrix));
    gl.uniformMatrix4fv( vModelViewMatrixLoc, false, flatten(vModelViewMatrix) );
  };

  //-------------------- Rotations ----------------------//

  return Camera;
})();
