
var gl;
var points = [];
var turtle;
function init(program) {
  turtle = new Turtle(-1,-1,vec2(1,0));
  //sierpinski(2, 6);
  maze(5,6);
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

//n is x direction and m is y direction
function maze(n, m) {
  //This is our cells
  var cells = [];
  //Used to update which are now connected
  var connectedSet = [];
  var nonConnectedSet = [];

  for(var x = 0; x < n; x++) {
      cells[x] = [];
    for(var y = 0; y < m; y++) {
      //Add the cell;
      var cell = new Cell(x, y);
      //Do not the outer walls!
      if(x == 0) {
        cell.walls.splice(cell.walls.indexOf("l"),1);
      }
      if(x == n-1) {
        cell. walls.splice(cell.walls.indexOf("r"),1);
      }
      if(y == 0) {
        cell.walls.splice(cell.walls.indexOf("t"),1);
      }
      if(y == m-1) {
        cell.walls.splice(cell.walls.indexOf("b"),1);
      }
      //Add to nonConnectedSet
      cells[x][y] = cell;
      nonConnectedSet.push(cell);
    }
  }
  connectedSet = nonConnectedSet;
  function buildMazeFromGrid() {
    //Add a random starting element
    var firstCell = nonConnectedSet[Math.floor(Math.random() * nonConnectedSet.length)];
    nonConnectedSet.splice(nonConnectedSet.indexOf(firstCell), 1); //Remove from nonConnected
    connectedSet.push(firstCell); //Add to connected

    //Keep removing walls while adding elements to set.
    while(connectedSet.length != (n * m)) {
      //Choose a random connected element
      var index = Math.floor(Math.random() * connectedSet.length)
      var cell = connectedSet[index];
      if(cell.walls.length == 0) {
        continue; //If all walls are removed from this cell, just choose another one
      }
      var cellX = cell.x;
      var cellY = cell.y;
      //Choose a random existing wall to remove
      var wall = cell.walls[Math.floor(Math.random() * cell.walls.length)]
      //Remove wall from both elements, and add the cell next to wall to connected
      switch(wall) {
        case "l":
          //remove our left wall
          cell.walls.splice(cell.walls.indexOf("l"),1);
          //Find the cell to add to connected
          var xOfCell = cellX - 1;
          var yOfCell = cellY;
          var foundCell = $.grep(nonConnectedSet, function(e){ return e.x == xOfCell && e.y == yOfCell; });
          if(foundCell.length == 0) {
            continue;
          }
          foundCell[0].walls.splice(foundCell[0].walls.indexOf("r"),1); //Remove the right wall of found cell
          nonConnectedSet.splice(nonConnectedSet.indexOf(foundCell[0]),1); //Remove element from nonconnected
          connectedSet.push(foundCell[0]); //Add element to the connected once
          break;
        case "t":
          //remove our top wall
          cell.walls.splice(cell.walls.indexOf("t"),1);
          //Find the cell to add to connected
          var xOfCell = cellX;
          var yOfCell = cellY - 1;
          var foundCell = $.grep(nonConnectedSet, function(e){ return e.x == xOfCell && e.y == yOfCell; });
          if(foundCell.length == 0) {
            continue;
          }
          foundCell[0].walls.splice(foundCell[0].walls.indexOf("b"),1); //Remove the bottom wall of found cell
          nonConnectedSet.splice(nonConnectedSet.indexOf(foundCell[0]),1); //Remove element from nonconnected
          connectedSet.push(foundCell[0]); //Add element to the connected once
          break;
        case "r":
          //remove our right wall
          cell.walls.splice(cell.walls.indexOf("r"),1);
          //Find the cell to add to connected
          var xOfCell = cellX + 1;
          var yOfCell = cellY;
          var foundCell = $.grep(nonConnectedSet, function(e){ return e.x == xOfCell && e.y == yOfCell; });
          if(foundCell.length == 0) {
            continue;
          }
          foundCell[0].walls.splice(foundCell[0].walls.indexOf("l"),1); //Remove the left wall of found cell
          nonConnectedSet.splice(nonConnectedSet.indexOf(foundCell[0]),1); //Remove element from nonconnected
          connectedSet.push(foundCell[0]); //Add element to the connected once
          break;
        case "b":
          //remove our bottom wall
          cell.walls.splice(cell.walls.indexOf("b"),1);
          //Find the cell to add to connected
          var xOfCell = cellX;
          var yOfCell = cellY + 1;
          var foundCell = $.grep(nonConnectedSet, function(e){ return e.x == xOfCell && e.y == yOfCell; });
          if(foundCell.length == 0) {
            continue;
          }
          foundCell[0].walls.splice(foundCell[0].walls.indexOf("t"),1); //Remove the top wall of found cell
          nonConnectedSet.splice(nonConnectedSet.indexOf(foundCell[0]),1); //Remove element from nonconnected
          connectedSet.push(foundCell[0]); //Add element to the connected once
          break;
      }
    }
    console.log(connectedSet);
    console.log(nonConnectedSet);
  }
  drawCells();
  drawOuterWalls();

  function drawCells() {
    for(var i = 0; i < connectedSet.length; i++) {
      cell = connectedSet[i];
      for(var k = 0; k < cell.walls.length; k++) {
        wall = cell.walls[k];
        switch(wall) {
          case "l":
            line(vec2(cell.x / n, cell.y / m), vec2(cell.x / n, (cell.y + 1) / m));
            break;
          case "t":
            line(vec2(cell.x / n, (cell.y + 1) / m), vec2((cell.x + 1) / n, (cell.y + 1) / m));
            break;
          case "r":
            line(vec2((cell.x + 1) / n, cell.y / m), vec2((cell.x + 1) / n, (cell.y + 1) / m));
            break;
          case "b":
            line(vec2(cell.x / n, cell.y / m), vec2((cell.x + 1) / n, cell.y / m));
            break;
        }
      }
    }
  }

  function drawOuterWalls() {
    line(vec2(0,0), vec2(0,1));
    line(vec2(0,1), vec2(1,1));
    line(vec2(1,1), vec2(1,0));
    line(vec2(1,0), vec2(0,0));
  }


  function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.walls = ["l", "t", "r", "b"];
  }
  
  function line(a,b) {
      points.push(a);
      points.push(b);
    }
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

