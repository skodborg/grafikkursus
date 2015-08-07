//World Class
var World = (function () {
  var wvBuffer;
  var wcBuffer;
  var wNormalBuffer;

  var wSBVBuffer;
  var wSBNBuffer;

  var wfvBuffer;
  var wfcBuffer;
  function World() {
    this.world = [];
    this.worldVertices = [];         // filled by worldToVerticeArray();
    this.worldBlockNormals = [];     // filled by worldToVerticeArray(); one normal per vertice
    this.worldWireframeVertices = [];
    this.worldWireframeColors = [];

    this.spinningBlocks = [];
    this.worldSpinningBlockVertices = [];
    this.worldSpinningBlockNormals = [];

    this.initWorld();
    this.worldToVerticeArray();

    wvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldVertices), gl.STATIC_DRAW );

    wNormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldBlockNormals), gl.STATIC_DRAW );

    wfvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wfvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldWireframeVertices), gl.STATIC_DRAW );

    wfcBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wfcBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldWireframeColors), gl.STATIC_DRAW );

    wSBVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wSBVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldSpinningBlockVertices), gl.STATIC_DRAW );

    wSBNBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wSBNBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldSpinningBlockNormals), gl.STATIC_DRAW );

  }

  World.prototype.render = function() {
    // draw boxes
    gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, wNormalBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVerticeColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vNormalLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.TRIANGLES, 0, this.worldVertices.length);

    // draw box wireframes
    gl.bindBuffer( gl.ARRAY_BUFFER, wfvBuffer );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, wfcBuffer );
    gl.vertexAttribPointer( vNormalLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.LINES, 0, this.worldWireframeVertices.length);

    for(var i = 0; i < this.spinningBlocks.length; i++) {
      var currBlock = this.spinningBlocks[i];

      var moveToOrigo = translate(-currBlock.llfx, -currBlock.llfy, -currBlock.llfz);
      var rotateM = rotate(53.5, vec3(1,0,1));
      var rotateFactor = rotate(spinningBlockTheta, vec3(0,1,0));

      // rotate spinning boxes
      vSBRotationMatrix = mult(inverse4(moveToOrigo), mult(rotateFactor, mult(rotateM, moveToOrigo)));
      gl.uniformMatrix4fv(vSBRotationMatrixLoc, false, flatten(vSBRotationMatrix));

      // draw spinning boxes
      gl.bindBuffer(gl.ARRAY_BUFFER, wSBVBuffer);
      gl.vertexAttribPointer(vPositionLoc, 4, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, wSBNBuffer);
      gl.vertexAttribPointer(vNormalLoc, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, this.worldSpinningBlockVertices.length);
    }

    vSBRotationMatrix = mat4();
    gl.uniformMatrix4fv(vSBRotationMatrixLoc, false, flatten(vSBRotationMatrix));
  };

  World.prototype.initWorld = function() {
    for (var i = 0; i < WORLD_SIZE; i++) {
      this.world[i] = [];
      for (var j = 0; j < WORLD_SIZE; j++) {
        this.world[i][j] = [];
      }
    }
    for (var i = 0; i < WORLD_SIZE; i++) {
      for (var j = 0; j < WORLD_SIZE; j++) {
        for (var k = 0; k < WORLD_SIZE; k++) {
          this.world[i][j][k] = new Block(i,j,k,1, "someMat");
        }
      }
    }

    this.world[9][9][9] = new SpinningBlock(9,9,9,0.25,1,"someMat");
  };

  // rebuilds the current world state as an array of vertices, vec4
  World.prototype.worldToVerticeArray = function() {
    var result = [];
    var sResult = [];

    for (var i = 0; i < WORLD_SIZE; i++) {
      for (var j = 0; j < WORLD_SIZE; j++) {
        for (var k = 0; k < WORLD_SIZE; k++) {
          var currBlock = this.world[i][j][k];
          if (currBlock == undefined) continue;
          if (currBlock instanceof Block) {

            if (this.getNeighbourBlocks(i, j, k).length > 5) continue;

            currBlockCorners = currBlock.corners;

            var llf = currBlockCorners[0];
            var tlf = currBlockCorners[1];
            var trf = currBlockCorners[2];
            var lrf = currBlockCorners[3];
            var llb = currBlockCorners[4];
            var tlb = currBlockCorners[5];
            var trb = currBlockCorners[6];
            var lrb = currBlockCorners[7];

            // fill wireframe of block
            var wflines = [llf, tlf, tlf, trf, trf, lrf, lrf, llf,
              llb, tlb, tlb, trb, trb, lrb, lrb, llb,
              lrf, lrb, trf, trb, llf, llb, tlf, tlb];
            this.worldWireframeVertices = this.worldWireframeVertices.concat(wflines);

            var wfcolors = [vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
              vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
              vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
              vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
              vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
              vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
              vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
              vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1)];
            this.worldWireframeColors = this.worldWireframeColors.concat(wfcolors);

            this.worldBlockNormals = this.worldBlockNormals.concat(currBlock.normals);

            this.worldVertices = this.worldVertices.concat(blockToVertices(currBlock));

          } else if (currBlock instanceof SpinningBlock) {
            this.worldSpinningBlockVertices = this.worldSpinningBlockVertices.concat(blockToVertices(currBlock));
            this.spinningBlocks.push(currBlock);
            this.worldSpinningBlockNormals = this.worldSpinningBlockNormals.concat(currBlock.normals);
          }
        }
      }
    }
  };

  function blockToVertices(block){
    var result = [];
    var currBlockCorners = block.corners;

    var llf = currBlockCorners[0];
    var tlf = currBlockCorners[1];
    var trf = currBlockCorners[2];
    var lrf = currBlockCorners[3];
    var llb = currBlockCorners[4];
    var tlb = currBlockCorners[5];
    var trb = currBlockCorners[6];
    var lrb = currBlockCorners[7];

    // front face triangles
    result = result.concat([llf, tlf, trf]);
    result = result.concat([llf, trf, lrf]);

    // right face triangles
    result = result.concat([lrf, trf, lrb]);
    result = result.concat([lrb, trf, trb]);

    // // back face triangles
    result = result.concat([lrb, trb, llb]);
    result = result.concat([llb, trb, tlb]);

    // // left face triangles
    result = result.concat([llb, tlb, tlf]);
    result = result.concat([llb, tlf, llf]);

    // // up face triangles
    result = result.concat([tlf, tlb, trb]);
    result = result.concat([tlf, trb, trf]);

    // // down face triangles
    result = result.concat([llf, llb, lrb]);
    result = result.concat([llf, lrb, lrf]);

    return result;
  }

  World.prototype.getNeighbourBlocks = function(x, y, z) {
    var result = [];
    if (x < WORLD_SIZE-1) {
      var currNeighbour = this.world[x+1][y][z];
      if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    if (x > 0) {
      var currNeighbour = this.world[x-1][y][z];
      if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    if (y < WORLD_SIZE-1) {
      var currNeighbour = this.world[x][y+1][z];
      if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    if (y > 0) {
      var currNeighbour = this.world[x][y-1][z];
      if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    if (z < WORLD_SIZE-1) {
      var currNeighbour = this.world[x][y][z+1];
      if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    if (z > 0) {
      var currNeighbour = this.world[x][y][z-1];
      if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    return result;
  };

  World.prototype.removeBlock = function(x, y, z) {
    if (world[x][y][z] != undefined) {
      world[x][y][z] = undefined;
      worldToVerticeArray();
      gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVertices), gl.STATIC_DRAW );
      gl.bindBuffer( gl.ARRAY_BUFFER, wcBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVerticeColors), gl.STATIC_DRAW );
    }
  }

  World.prototype.addBlock = function(x, y, z, block) {
    if (world[x][y][z] == undefined) {
      world[x][y][z] = block;
      worldToVerticeArray();
      gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVertices), gl.STATIC_DRAW );
      gl.bindBuffer( gl.ARRAY_BUFFER, wcBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVerticeColors), gl.STATIC_DRAW );
    }
  }

  return World;
})();