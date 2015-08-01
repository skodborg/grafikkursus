//Player class
var Player = (function () {
  var pBuffer;
  var playerColor;
  function Player (x, y) {
    this.x = x;
    this.y = y;
    this.velocity = vec2(0,0);
    this.truePosition = gridCoordToBlock(x,y);
    this.vertices = this.getVertices();
    pBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.getVertices()), gl.STATIC_DRAW );

    //This is the same uniform as used for wireframe!
    uPlayerColor = gl.getUniformLocation(program, "uWireframeColor");
  }

  Player.prototype.render = function() {
    /*
      Ensure that we use the shaders for wireframe and player
      Loading thish as the effect of resetting colour and mouse position
    */
    program = initShaders( gl, "wireframe-vertex-shader", "wireframe-fragment-shader" );
    gl.useProgram( program );

    uWireframeColor = gl.getUniformLocation(program, "uWireframeColor");
    gl.uniform4f(uWireframeColor, 0.0, 0.0, 0.0, 1.0);

    //Translate all vertices to the players current position.
    //This way we do not have to update vertices once player is build.
    //We are kind of abusing mousePos varriable, maybe we should make a seperate one for js side.
    currMousePosLoc = gl.getUniformLocation( program, "currMousePos" );
    gl.uniform2f( currMousePosLoc, this.truePosition[0] + 1, this.truePosition[1] + 0.04 );

    gl.bindBuffer( gl.ARRAY_BUFFER, pBuffer );
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, this.vertices.length);
  };

  /*---------------- Vertices ---------------------*/

  Player.prototype.getVertices = function () {
    var vertices = [];

    vertices.push(this.truePosition);
    vertices.push(add(this.truePosition, vec2(0.03, 0.05)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.05)));
    vertices.push(add(this.truePosition, vec2(0.06, 0)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.05)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.12)));
    vertices.push(add(this.truePosition, vec2(0.01, 0.07)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.11)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.11)));
    vertices.push(add(this.truePosition, vec2(0.05, 0.08)));
    vertices.push(add(this.truePosition, vec2(0.05, 0.08)));
    vertices.push(add(this.truePosition, vec2(0.06, 0.1)));

    //TODO draw head

    return vertices
  };

  /*---------------- Vertices end ---------------------*/

  /*---------------- Movement ---------------------*/

  Player.prototype.moveLeft = function () {
    if( this.velocity[0] > - 0.025 ) {
      this.velocity = add(this.velocity, vec2(-0.02, 0));
    }
  };

  Player.prototype.moveRight = function () {
    if ( this.velocity[0] < 0.025) {
      this.velocity = add(this.velocity, vec2(0.02, 0));
    }
  };

  Player.prototype.jump = function () {
    if(this.velocity[1] == 0) {
      this.velocity = add(this.velocity, vec2(0,0.05));
    }
  };

  Player.prototype.updatePosition = function (){
    if(leftKeyDown) this.moveLeft();
    if(rightKeyDown) this.moveRight();
    if(upKeyDown) this.jump();

    this.truePosition = add(this.truePosition, this.velocity);

    // Gravity
    if(!this.isStandingOnBlock()) {
      if(this.isTouchingWater()) {
        this.velocity[1] = Math.max(add(this.velocity, vec2(0,-0.0000005))[1], -0.001);
      }
      this.velocity = add(this.velocity, vec2(0,-0.01));
    } else {
      this.velocity = vec2(this.velocity[0], 0);
    }

    if(this.velocity[0] > 0) {
      this.velocity = add(this.velocity, vec2(-0.005,0));
    } else if (this.velocity[0] < 0) {
      this.velocity = add(this.velocity, vec2(0.005, 0));
    }

    if(Math.abs(this.velocity[0]) < 0.001){
      this.velocity[0] = 0;
    }

    if(this.colliding()){
      this.velocity[0] = 0;
    }

    if(this.hitFire()){
      this.velocity = add(this.velocity, vec2(0, 0.04));
    }

    var gridPos = worldToGrid(this.truePosition[0], this.truePosition[1]);
    this.x = gridPos[0];
    this.y = gridPos[1];
  };

  /*---------------- Movement end ---------------------*/

  /*---------------- Collision detection --------------*/

  Player.prototype.isStandingOnBlock = function () {
    if (this.y == 0) return true;
    if (world[this.x] != undefined) {
      var lowerBlock = world[this.x][this.y - 1];
    }
    if (lowerBlock != undefined && lowerBlock.type != "water" &&
        gridCoordToBlock(lowerBlock.x, lowerBlock.y)[1] + 0.08 >= this.truePosition[1]) {
      this.truePosition[1] = gridCoordToBlock(lowerBlock.x, lowerBlock.y)[1] + 0.08;
      return true;
    }
    var rightLeg = worldToGrid(this.truePosition[0] + 0.04, this.truePosition[1]);

    if (world[rightLeg[0]] != undefined) {
      lowerBlock = world[rightLeg[0]][rightLeg[1]];
    }
    if (lowerBlock != undefined && lowerBlock.type != "water" &&
        gridCoordToBlock(lowerBlock.x, lowerBlock.y)[1] + 0.08 >= this.truePosition[1]) {
      this.truePosition[1] = gridCoordToBlock(lowerBlock.x, lowerBlock.y)[1] + 0.08;
      return true;
    }
  };

  Player.prototype.hitFire = function () {
    if(world[this.x] != undefined){
      var lowerBlock = world[this.x][this.y - 1];
      if (lowerBlock && lowerBlock.type == "fire"){
        return true;
      }
    }
    //right leg is on the next block
    if(this.truePosition[0]+0.06 >= gridCoordToBlock(this.x+1, this.y-1)[0]){
      if(world[this.x+1] != undefined){
        var lowerRight = world[this.x+1][this.y-1];
        if( lowerRight && lowerRight.type == "fire"){
          return true;
        }
      }
    }
    return false;
  };

  Player.prototype.isTouchingWater = function () {
    if(world[this.x] != undefined) {
      var touchingBlock = world[this.x][this.y];
      if(touchingBlock && touchingBlock.type == "water") {
        return true;
      };
    }
  };

  Player.prototype.colliding = function () {
    if (this.x == 0) return true;
    var leftNeighbour;
    var leftNeighbour2;
    var rightNeighbour;
    var rightNeighbour2;
    var upperNeighbour;
    var upperNeighbour2;
    if(world[this.x -1] != undefined) {
      leftNeighbour = world[this.x - 1][this.y];
    }
    if(world[this.x -1] != undefined && this.y +1 <=25) {
      leftNeighbour2 = world[this.x - 1][this.y+1];
    }
    if(world[this.x+1] != undefined) {
      rightNeighbour = world[this.x + 1][this.y];
    }
    if(world[this.x+1] != undefined && this.y +1 <= 25) {
      rightNeighbour2 = world[this.x + 1][this.y +1];
    }
    if(world[this.x] != undefined && this.y +2 <= 25) {
      upperNeighbour = world[this.x][this.y +2];
    }
    if(world[this.x+1] != undefined && this.y +2 <= 25) {
      upperNeighbour = world[this.x+1][this.y +2];
    }

    if(leftNeighbour != undefined && leftNeighbour.type != "water" && !this.isTouchingWater() &&
        gridCoordToBlock(leftNeighbour.x, leftNeighbour.y)[0]+0.08 >= this.truePosition[0]) {
      this.truePosition[0] = gridCoordToBlock(leftNeighbour.x, leftNeighbour.y)[0]+0.08;
      return true;
    }
    if(leftNeighbour2 != undefined && leftNeighbour2.type != "water" &&
        gridCoordToBlock(leftNeighbour2.x, leftNeighbour2.y)[0]+0.08 >= this.truePosition[0]) {
      this.truePosition[0] = gridCoordToBlock(leftNeighbour2.x, leftNeighbour2.y)[0]+0.08;
      return true;
    }

    if(rightNeighbour != undefined && rightNeighbour.type != "water" && !this.isTouchingWater() &&
        gridCoordToBlock(rightNeighbour.x, rightNeighbour.y)[0] <= this.truePosition[0]+0.06) {
      this.truePosition[0] = gridCoordToBlock(rightNeighbour.x, rightNeighbour.y)[0]-0.06;
    }
    if(rightNeighbour2 != undefined && rightNeighbour2.type != "water" &&
        gridCoordToBlock(rightNeighbour2.x, rightNeighbour2.y)[0] <= this.truePosition[0]+0.06) {
      this.truePosition[0] = gridCoordToBlock(rightNeighbour2.x, rightNeighbour2.y)[0]-0.06;
    }

    if(upperNeighbour != undefined && upperNeighbour.type != "water" &&
        gridCoordToBlock(upperNeighbour.x, upperNeighbour.y)[1] <= this.truePosition[1]+0.13) {
      this.truePosition[1] = gridCoordToBlock(upperNeighbour.x, upperNeighbour.y)[1] - 0.13;
    }

    if(upperNeighbour2 != undefined && upperNeighbour2.type != "water" &&
        gridCoordToBlock(upperNeighbour2.x, upperNeighbour2.y)[1] <= this.truePosition[1]+0.13) {
      this.truePosition[1] = gridCoordToBlock(upperNeighbour2.x, upperNeighbour2.y)[1] - 0.13;
    }

    if(this.truePosition[0] <= -1){
      this.truePosition[0] = -1;
      this.velocity[1] = 0;
    }
    if(this.truePosition[1] <= -1){
      this.truePosition[1] = -1;
      this.velocity[1] = 0;
    }
    if(this.truePosition[0] >= 1-0.06){
      this.truePosition[0] = 1-0.06;
      this.velocity[0] = 0;
    }
    if(this.truePosition[1] >= 1-0.16){
      this.truePosition[1] = 1-0.13;
      this.velocity[1] = -0.05;
    }
  }

  /*---------------- Collision detection end ----------*/

  Player.prototype.getX = function () {
    return this.truePosition[0];
  };

  Player.prototype.getY = function () {
    return this.truePosition[1];
  }

  return Player;
})();
