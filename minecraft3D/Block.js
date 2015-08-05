//Block Class
var Block = (function () {
  
  function Block(llfx, llfy, llfz, size, mat) {
    this.llfx = llfx;
    this.llfy = llfy;
    this.llfz = llfz
    this.size = size;
    this.color = mat;
  }

  //Return the corners of this block, in render list order
  Block.prototype.getCorners = function() {
    var llf = vec4(this.llfx, this.llfy, this.llfz, 1);
    var tlf = vec4(this.llfx, this.llfy + this.size, this.llfz, 1);
    var trf = vec4(this.llfx + this.size, this.llfy + this.size, this.llfz, 1);
    var lrf = vec4(this.llfx + this.size, this.llfy, this.llfz, 1);
    var llb = vec4(this.llfx, this.llfy, this.llfz + this.size, 1);
    var tlb = vec4(this.llfx, this.llfy + this.size, this.llfz + this.size, 1);
    var trb = vec4(this.llfx + this.size, this.llfy + this.size, this.llfz + this.size, 1);
    var lrb = vec4(this.llfx + this.size, this.llfy, this.llfz + this.size, 1);

    var result = [llf, tlf, trf, lrf, llb, tlb, trb, lrb];
    return result;
  };

  return Block;
})();