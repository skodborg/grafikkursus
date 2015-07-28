
var gl;
var points = [];
var turtle;
function init(program) {
  turtle = new Turtle(-1,-1,vec2(1,0));
  sierpinski(2, 6);
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

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );
  gl.drawArrays( gl.LINES, 0, points.length );
}

function sierpinski(length, numberOfSubdivisions) {
  //Base case
  if(numberOfSubdivisions == 0) {
    triangle(length);
  } else {
    numberOfSubdivisions--;
    sierpinski(length / 2, numberOfSubdivisions);
    turtle.forward(length / 2);
    sierpinski(length / 2, numberOfSubdivisions);
    turtle.left(120);
    turtle.forward(length/2);
    turtle.right(120);
    sierpinski(length / 2, numberOfSubdivisions);
    turtle.right(120);
    turtle.forward(length/2);
    turtle.left(120);
  }

  function triangle(length) {
    turtle.pen(true);
    turtle.forward(length);
    turtle.left(120);
    turtle.forward(length);
    turtle.left(120);
    turtle.forward(length);
    turtle.left(120);
    turtle.pen(false);
  }
}


//Turtle Class
var Turtle = (function () {
  
  var currPoint;
  var direction;
  var isPenDown;

  function Turtle(x, y, theta) {
    isPenDown = true;
    currPoint = vec2(x,y);
    direction = theta;  
  }

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
    this.left(-angle);
  };

  Turtle.prototype.pen = function(up_down) {
    isPenDown = up_down;
  };

  return Turtle;
})();

