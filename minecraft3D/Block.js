//Block Class
var Block = (function () {
  
  function Block(llfx, llfy, llfz, size, mat) {
    this.llfx = llfx;
    this.llfy = llfy;
    this.llfz = llfz;
    this.size = size;
    this.corners = this.calculateCorners();
    this.normals = this.calculateNormals();
    this.index = -1;
    this.frameIndex = -1;
    this.textureIndex = -1;
    this.gridPosIndex = -1;
    this.material = this.getMaterial(mat);
    this.textureCoords = this.getTextureCoords();
    this.gridPos = this.calculateGridPos();
    this.color = mat;
  }

  Block.prototype.getMaterial = function(mat) {
    if(mat == "grass") {
        return [0,0.5];
    }
    if(mat == "dirt") {
        return [0.5,0.5];
    }
    if(mat == "dirt") {
        return [0.5,0];
    }
    return [0,0];
  };

  Block.prototype.getTextureCoords = function() {
    var result = [];
    result.push(vec2(0.5,0));
    result.push(vec2(0.5,0.5));
    result.push(vec2(0,0.5));
    result.push(vec2(0.5,0));
    result.push(vec2(0,0.5));
    result.push(vec2(0,0));

    result.push(vec2(0.5,0));
    result.push(vec2(0.5,0.5));
    result.push(vec2(0,0));
    result.push(vec2(0,0));
    result.push(vec2(0.5,0.5));
    result.push(vec2(0,0.5));

    result.push(vec2(0.5,0));
    result.push(vec2(0.5,0.5));
    result.push(vec2(0,0));
    result.push(vec2(0,0));
    result.push(vec2(0.5,0.5));
    result.push(vec2(0,0.5));

    result.push(vec2(0.5,0));
    result.push(vec2(0.5,0.5));
    result.push(vec2(0,0.5));
    result.push(vec2(0.5,0));
    result.push(vec2(0,0.5));
    result.push(vec2(0,0));

    result.push(vec2(0.5,0));
    result.push(vec2(0.5,0.5));
    result.push(vec2(0,0.5));
    result.push(vec2(0.5,0));
    result.push(vec2(0,0.5));
    result.push(vec2(0,0));

    result.push(vec2(0.5,0));
    result.push(vec2(0.5,0.5));
    result.push(vec2(0,0.5));
    result.push(vec2(0.5,0));
    result.push(vec2(0,0.5));
    result.push(vec2(0,0));
    for(var i = 0; i < result.length; i++) {
        result[i][0] += this.material[0];
        result[i][1] += this.material[1];
    }
    return result;

  }

  Block.prototype.calculateGridPos = function() {
    var currBlockPos = [vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.1), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.1), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.1),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.1), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.1), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.1),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.2), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.2), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.2),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.2), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.2), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.2),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.3), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.3), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.3),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.3), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.3), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.3),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.4), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.4), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.4),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.4), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.4), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.4),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.5), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.5), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.5),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.5), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.5), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.5),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.6), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.6), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.6),
                        vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.6), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.6), vec4(this.llfx/255,this.llfy/255,this.llfz/255,0.6)];
    return currBlockPos;
  }

  //Return the corners of this block, in render list order
  Block.prototype.calculateCorners = function() {
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

  Block.prototype.calculateNormals = function () {
    var result = [];
    var normal = BLOCK_NORMALS[0];
    result = result.concat([normal, normal, normal, normal, normal, normal]);
    normal = BLOCK_NORMALS[1];
    result = result.concat([normal, normal, normal, normal, normal, normal]);
    normal = BLOCK_NORMALS[2];
    result = result.concat([normal, normal, normal, normal, normal, normal]);
    normal = BLOCK_NORMALS[3];
    result = result.concat([normal, normal, normal, normal, normal, normal]);
    normal = BLOCK_NORMALS[4];
    result = result.concat([normal, normal, normal, normal, normal, normal]);
    normal = BLOCK_NORMALS[5];
    result = result.concat([normal, normal, normal, normal, normal, normal]);
    return result;
  };

  return Block;
})();