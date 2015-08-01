//Block Class
var Block = (function () {
  
  function Block(x, y, mat) {
    this.x = x;
    this.y = y;
    this.material = mat;
    this.type;
    this.color = [mat, mat, mat, mat, mat, mat];

    switch (mat){
      case colors[0] : //Dirt
          this.type = "dirt";
          break;
      case colors[1] : //Fire
          this.type = "fire";
          break;
      case colors[2] : //Pee
          this.type = "pee";
          break;
      case colors[3] : //Grass
          this.type = "grass";
          break;
      case colors[4] : //Water
          this.type = "water";
          break;
      case colors[5] : //Metal
          this.type = "metal";
          break;
    }
  }

  //Return the corners of this block, in render list order
  Block.prototype.getCorners = function() {
    var ll = gridCoordToBlock(this.x, this.y);
    var tl = vec2(ll[0], ll[1] + BLOCK_WIDTH);
    var tr = vec2(ll[0] + BLOCK_WIDTH, ll[1] + BLOCK_WIDTH);
    var lr = vec2(ll[0] + BLOCK_WIDTH, ll[1]);
    var result = [ll, tl, tr, lr];
    return result;
  };


  return Block;
})();

