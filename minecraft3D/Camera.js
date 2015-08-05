var Camera = (function () {
  var xRotationMatrix;
  var yRotationMatrix;
  var translationMatrix;

  var vModelViewMatrix;
  var vModelViewMatrixLoc;

  var vProjectionMatrix;
  var vProjectionMatrixLoc;

  var lookingUpDown = 0;
  var lookingLeftRight = 0;
  var movingForwardBackward = 0;
  var movingLeftRight = 0;

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

  	updateMatrices();

    var vRotationMatrix = mult(xRotationMatrix, yRotationMatrix);

    vModelViewMatrix = mult(vRotationMatrix, translationMatrix);
    gl.uniformMatrix4fv( vModelViewMatrixLoc, false, flatten(vModelViewMatrix) );
  };

  //-------------------- movement ----------------------//

  Camera.prototype.rotX = function (angle) {
  	lookingUpDown = angle;
  };

  Camera.prototype.rotY = function (angle) {
  	lookingLeftRight = angle;
  };

  Camera.prototype.forward = function (amount) {
  	movingForwardBackward = amount;
  };

  Camera.prototype.backward = function (amount) {
  	movingForwardBackward = -amount;
  };

  Camera.prototype.left = function (amount) {
  	movingLeftRight = -amount;
  };

  Camera.prototype.right = function (amount) {
  	movingLeftRight = amount;
  };

  function updateMatrices() {
  	if (lookingLeftRight !== 0) {
  		yRotationMatrix = mult(yRotationMatrix, rotate(lookingLeftRight, vec3(0,1,0)));
  	}

  	if (lookingUpDown !== 0) {
  		xRotationMatrix = mult(xRotationMatrix, rotate(lookingUpDown, vec3(1,0,0)));
  	}

  	if (movingLeftRight !== 0) {
  		var direction = vec4(movingLeftRight,0,0,0);
	    direction = multmv(mult(xRotationMatrix, yRotationMatrix), direction);
	    translationMatrix = mult(translationMatrix, translate(-direction[0],0, direction[2]));
  	}

  	if (movingForwardBackward !== 0) {
  		var direction = vec4(0,0,movingForwardBackward,0);
	    direction = multmv(mult(xRotationMatrix, yRotationMatrix), direction);
	    translationMatrix = mult(translationMatrix, translate(-direction[0],0, direction[2]));
  	}
  }

  return Camera;
})();
