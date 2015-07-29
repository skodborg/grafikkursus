
var points = [];
var colors = [];

function init(program) {
  $('canvas').on('mousedown', handleMouseDown);
  render();
}

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );
  gl.drawArrays( gl.TRIANGLES, 0, points.length );
}


function handleMouseDown(event) {
  console.log(pointToGrid(event.clientX, event.clientY));
}

function pointToGrid(x, y) {
  col = Math.floor(x / 10);
  row = Math.floor(y / 10);
  return [col,row];
}