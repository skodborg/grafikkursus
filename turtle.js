
var gl;
var points = [];

function init(program)
{
  var turtle = new Turtle();
  turtle.init(0,0, vec2(1,0));
  turtle.forward(.5);
  turtle.left(90);
  turtle.forward(.5);
  // Load the data into the GPU

  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  // Associate out shader variables with our data buffer

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  render();

};

//Turtle specific

function Turtle() {
  var currPoint;
  var direction;
  var isPenDown = false;
}

Turtle.prototype.init = function(x, y, theta) {
  isPenDown = true;
  currPoint = vec2(x,y);
  direction = theta;  
};


Turtle.prototype.forward = function(distance) {
  var from = currPoint;
  currPoint = add(currPoint, scale(distance, direction));
  if(isPenDown) {
    line(from, currPoint);
  }
  
  function line(a,b) {
    points.push(a);
    points.push(b);
  }
};

Turtle.prototype.left = function(angle) {
  var x = direction[0] * Math.cos(radians(angle)) - direction[1] * Math.sin(radians(angle));
  var y = direction[0] * Math.sin(radians(angle)) + direction[1] * Math.cos(radians(angle));
  direction = vec2(x,y);
};

Turtle.prototype.right = function(angle) {
  left(-angle);
}

Turtle.prototype.pen = function(up_down) {
  isPenDown = up_down;
}


function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );
  gl.drawArrays( gl.LINES, 0, points.length );
}
