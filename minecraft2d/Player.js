//Player class
var Player = (function () {

  function Player (x, y) {
    this.x = x;
    this.y = y;
    this.velocity = vec2(0,0);
    this.truePosition = gridCoordToBlock(x,y);
  }

  /*---------------- Vertices ---------------------*/

  Player.prototype.getVertices = function () {
    var vertices = [];

    vertices.push(this.truePosition);
    vertices.push(add(this.truePosition, vec2(0.03, 0.05)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.05)));
    vertices.push(add(this.truePosition, vec2(0.06, 0)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.05)));
    vertices.push(add(this.truePosition, vec2(0, 0.12)));
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
      this.velocity = add(this.velocity, vec2(-0.01, 0));
    }
  };

  Player.prototype.moveRight = function () {
    if ( this.velocity[0] < 0.025) {
      this.velocity = add(this.velocity, vec2(0.01, 0));
    }
  };

  Player.prototype.jump = function () {
    if(this.velocity[1] == 0) {
      this.velocity = add(this.velocity, vec2(0,0.1));
    }
  };

  Player.prototype.updeatPosition = function (){
    this.truePosition = add(this.truePosition, this.velocity);

    // Gravity
    if(this.velocity[0] > 0) {
      this.velocity = add(this.velocity, vec2(-0.005,-0.01));
    } else if (this.velocity[0] < 0) {
      this.velocity = add(this.velocity, vec2(0.005,-0.01));
    }

    //TODO Check for collisions
  };

  /*---------------- Movement end ---------------------*/

  Player.prototype.getX = function () {
    return this.truePosition[0];
  };

  Player.prototype.getY = function () {
    return this.truePosition[1];
  }
});
