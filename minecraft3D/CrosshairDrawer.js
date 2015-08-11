var CrosshairDrawer = (function () {
  var vBuffer, cBuffer;
  function CrosshairDrawer(size, color) {
    vBuffer = gl.createBuffer();
    this.crosshairVertices = [];
    this.crosshairColors = [];
    this.crosshairGridPos = [];
    this.size = size;
    this.color = color;
    this.initCrosshairLines();


    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.crosshairVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );

  }

  CrosshairDrawer.prototype.render = function() {
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.LINES, 0, this.crosshairVertices.length);
  };

  CrosshairDrawer.prototype.initCrosshairLines = function() {
    this.crosshairVertices = [
        vec4(-this.size, 0, 0, 1),
        vec4(this.size, 0, 0, 1),
        vec4(0, -this.size, 0, 1),
        vec4(0, this.size, 0, 1)];


    };

  return CrosshairDrawer;
})();