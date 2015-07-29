var gl;
var points = [];
var turtle;

var skew = 0.000;
function init(program) {
  turtle = new Turtle(-1,-1,vec2(1,0));
  //sierpinski(2, 6);

  //tri(vec2(0.0, 0.0), vec2(1.0, 0.0), vec2(1.0, 1.0));
  //fractionMountain(vec2(0.0, 0.0), vec2(1.0, 0.0), vec2(0.5, 1.0), 0);

  fractionMountain(vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(0, 1), 6);

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

function getRandom() {
  var neg = Math.random() > 0.5 ? 1 : -1;
  return Math.random()*3/10 * neg;
}

// u = vec4(vec2(x,y), vec2(x', y'));
function getDegreesOfLineRelativeToHorizontal(u) {
  var x = vec2(u[0], u[1]);
  var y = vec2(u[2], u[3]);
  return Math.atan((y[1] - x[0]) / (y[0] - x[0])) * 180/Math.PI;
}

function fractionMountain(a, b, c, numberOfSubdivisions) {
  if (numberOfSubdivisions == 0) {
    tri(a,b,c);
  }
  else {
    numberOfSubdivisions--;

    var newRandomB = vec2(b[0], b[1]);
    var newAB = mix(a,newRandomB,0.5);
    var newAC = mix(a,c,0.5);
    fractionMountain(a, newAB, newAC, numberOfSubdivisions);

    turtle.pen(false);
    var dist_a_newAB = Math.sqrt(Math.pow(newAB[0] - a[0], 2) + Math.pow(newAB[1] - a[1], 2));
    var a_newAB_cos = (Math.acos((newAB[0] - a[0]) / dist_a_newAB) * (180 / Math.PI));
    turtle.forward(dist_a_newAB);
    var newAB_b_cos = Math.acos((getDistanceBetweenPoints(vec2(newAB[0], b[1]), b)) / getDistanceBetweenPoints(newAB, b)) * 180/Math.PI;
    turtle.right(newAB_b_cos);

    var newBC = mix(b,c,(0.5 + skew));

    fractionMountain(newAB, b, newBC, numberOfSubdivisions);

    turtle.pen(false);
    turtle.left(180);
    turtle.forward(dist_a_newAB);
    turtle.left(180);

    var ab = getDistanceBetweenPoints(a,b);
    var bc = getDistanceBetweenPoints(b,c);
    var ca = getDistanceBetweenPoints(c,a);

    var abc_cos = (Math.pow(ca,2) + Math.pow(ab,2) - Math.pow(bc,2)) / (2*ca*ab);
    var abc = Math.acos(abc_cos) * (180 / Math.PI);
    turtle.left(abc);
    turtle.forward(getDistanceBetweenPoints(a, newAC));

    fractionMountain(newAC, newBC, c, numberOfSubdivisions);


    turtle.pen(false);
    turtle.left(180);
    turtle.left(abc);
    turtle.forward(getDistanceBetweenPoints(newAC, a));
    turtle.left(180);
    turtle.right(abc);


  }
  
}

function toDegrees(radians) {
  return radians * (180/Math.PI);
}

function getDegreeAngleBetweenVectors(u, v) {
  var t = dot(u,v);
  var n = Math.sqrt(Math.pow(u[0],2) + Math.pow(u[1],2)) * 
          Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2));
  return toDegrees(Math.acos(t/n));
}

function getDistanceBetweenPoints(p, q) {
  return Math.sqrt(Math.pow(q[0] - p[0], 2) + Math.pow(q[1] - p[1], 2));
}

function tri(a, b, c) {
  var ab = getDistanceBetweenPoints(a,b);
  var ab_cos = (Math.acos((b[0] - a[0]) / ab) * (180 / Math.PI));
  var bc = getDistanceBetweenPoints(b,c);
  //var bc_cos = (Math.acos(Math.pow(c[0] - b[0], 2) / bc) * (180 / Math.PI));
  var ca = getDistanceBetweenPoints(c,a);
  //var ca_cos = 180-(Math.acos(Math.pow(a[0] - c[0], 2) / ca) * (180 / Math.PI));

  var abc_cos = (Math.pow(ca,2) + Math.pow(ab,2) - Math.pow(bc,2)) / (2*ca*ab);
  var abc = Math.acos(abc_cos) * (180 / Math.PI);

  var bca_cos = (Math.pow(bc,2) + Math.pow(ab,2) - Math.pow(ca,2)) / (2*bc*ab);
  var bca = Math.acos(bca_cos) * (180 / Math.PI);

  var cab_cos = (Math.pow(bc,2) + Math.pow(ca,2) - Math.pow(ab,2)) / (2*bc*ca);
  var cab = Math.acos(cab_cos) * (180 / Math.PI);

  var vect1 = vec2(0,0)

  turtle.pen(true);
  turtle.left(ab_cos - turtle.getDirectionInDegrees());
  turtle.forward(ab);
  turtle.left(180);
  turtle.right(bca);
  turtle.forward(bc);
  turtle.left(180);
  turtle.right(cab);
  turtle.forward(ca);
  turtle.left(180);
  turtle.right(abc);
  // turtle.forward(5);
  // turtle.pen(false);
  // turtle.left(180);
  // turtle.forward(5);
  // turtle.left(180);
  // turtle.pen(false);
  // turtle.printCurrPosition();
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

  Turtle.prototype.printCurrPosition = function() {
    console.log("currPoint: " + currPoint);
  };

  Turtle.prototype.getDirection = function() {
    return direction;
  }

  Turtle.prototype.getCurrPoint = function() {
    return currPoint;
  }

  Turtle.prototype.getDirectionInDegrees = function() {
    return getDegreeAngleBetweenVectors(turtle.getDirection(), vec2(1,0));
  }

  Turtle.prototype.left = function(angle) {
    var x = direction[0] * Math.cos(radians(angle)) - direction[1] * Math.sin(radians(angle));
    var y = direction[0] * Math.sin(radians(angle)) + direction[1] * Math.cos(radians(angle));
    direction = normalize(vec2(x,y));
  };

  Turtle.prototype.right = function(angle) {
    this.left(-angle);
  };

  Turtle.prototype.pen = function(up_down) {
    isPenDown = up_down;
  };

  return Turtle;
})();

