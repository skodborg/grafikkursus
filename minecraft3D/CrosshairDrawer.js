var CrosshairDrawer = (function () {
  var vBuffer, cBuffer;
  function CrosshairDrawer(size, color) {
    vBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();
    gBuffer = gl.createBuffer();
    this.crosshairVertices = [];
    this.crosshairColors = [];
    this.crosshairGridPos = [];
    this.size = size;
    this.color = color;
    this.initCrosshairLines();


    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.crosshairVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.crosshairColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vNormalLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, gBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.crosshairGridPos), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vGridPosLoc, 4, gl.FLOAT, false, 0, 0 );

  }

  CrosshairDrawer.prototype.render = function() {
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.vertexAttribPointer( vNormalLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, gBuffer );
    gl.vertexAttribPointer( vGridPosLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.LINES, 0, this.crosshairVertices.length);
  };

  CrosshairDrawer.prototype.initCrosshairLines = function() {
    this.crosshairVertices = [
        vec4(-this.size, 0, 0, 1),
        vec4(this.size, 0, 0, 1),
        vec4(0, -this.size, 0, 1),
        vec4(0, this.size, 0, 1)];

    this.crosshairColors = [
        vec4(0,0,0,0),
        vec4(0,0,0,0),
        vec4(0,0,0,0),
        vec4(0,0,0,0)];

    this.crosshairGridPos = [
        vec4(0,0,0,0),
        vec4(0,0,0,0),
        vec4(0,0,0,0),
        vec4(0,0,0,0)];
    };

  return CrosshairDrawer;
})();