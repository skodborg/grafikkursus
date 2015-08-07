var AxisDrawer = (function () {
  var vBuffer, cBuffer;
  function AxisDrawer(x, y, z) {
    vBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();  
    this.axisVertices = [];
    this.axisColors = [];
    this.initAxisLines(x,y,z);

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.axisVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.axisColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );

  }

  AxisDrawer.prototype.render = function() {
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.vertexAttribPointer( vPositionLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.LINES, 0, this.axisVertices.length);
  };

  AxisDrawer.prototype.initAxisLines = function(x, y, z) {
    this.axisVertices = [
        vec3(x, y, z),
        vec3(x + 10.0, y, z),
        vec3(x, y, z),
        vec3(x, y + 10.0, z),
        vec3(x, y, z),
        vec3(x, y, z + 10.0)];

    this.axisColors = [
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 )];
};

  return AxisDrawer;
})();