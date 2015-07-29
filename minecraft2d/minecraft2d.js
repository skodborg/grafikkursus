
var gl;
var points = [];
var colors = [];

function init(program) {
  render();
}

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );
  gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
