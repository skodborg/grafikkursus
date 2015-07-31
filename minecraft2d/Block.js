//Block Class
var Block = (function () {
  
  function Block(x, y, mat) {
    this.x = x;
    this.y = y;
    this.material = mat;
    this.color = [mat, mat, mat, mat, mat, mat];
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

