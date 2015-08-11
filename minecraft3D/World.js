//World Class
var World = (function () {
  var wvBuffer;
  var wcBuffer;
  var wNormalBuffer;
  var texBuffer;

  var wvposBuffer;

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
    this.texCoordsArray = [];

    this.spinningBlocks = [];
    this.worldSpinningBlockVertices = [];
    this.worldSpinningBlockNormals = [];

    this.worldVerticePos = [];


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

    texBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, texBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.texCoordsArray), gl.STATIC_DRAW );


    wvposBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wvposBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldVerticePos), gl.STATIC_DRAW );


  }

  World.prototype.render = function() {
    // draw boxes
    gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, wNormalBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVerticeColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vNormalLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, texBuffer );
    gl.vertexAttribPointer( vTexCoordLoc, 2, gl.FLOAT, false, 0, 0 );


    gl.bindBuffer( gl.ARRAY_BUFFER, wvposBuffer );
    gl.vertexAttribPointer( vGridPosLoc, 4, gl.FLOAT, false, 0, 0 );


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
      var rotateM = rotate(54.8, vec3(1,0,1));
      var rotateFactor = rotate(spinningBlockTheta, vec3(0,1,0));

      // rotate spinning boxes
      vSBRotationMatrix = mult(inverse4(moveToOrigo), mult(rotateFactor, mult(rotateM, moveToOrigo)));
      updateNormalMatrix();
      gl.uniformMatrix3fv(vNormalMatrixLoc, false, flatten(vNormalMatrix) );

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


    // for (var i = 0; i < WORLD_SIZE; i++) {
    //   for (var j = 0; j < 2; j++) {
    //     for (var k = 0; k < WORLD_SIZE; k++) {
    //       this.world[i][j][k] = new Block(i,j,k,1,"someMat");
    //     }
    //   }
    // }
    // this.world[15][4][12] = new Block(15,4,12,1,"lol");


    var centerX = WORLD_SIZE/2;
    var centerY = WORLD_SIZE/2;
    var radius = WORLD_SIZE/2;


    for (var i = 0; i < WORLD_SIZE; i++) {
      for (var j = 0; j < 1; j++) {
        for (var k = 0; k < WORLD_SIZE; k++) {
            if (Math.pow(i-centerX, 2) + Math.pow(k-centerY, 2) <= Math.pow(radius,2)) {
                this.world[i][j][k] = new Block(i,j,k,1, "grass");
            }
        }
      }
    }
    
    for (var i = 0; i < WORLD_SIZE; i++) {
      for (var j = 0; j < WORLD_SIZE; j++) {
        for (var k = 0; k < WORLD_SIZE; k++) {

            var hillHeight = 8;

            var c = vec2(WORLD_SIZE/4, WORLD_SIZE/4);
            var x = vec2(i,k);
            var cx = length(subtract(c,x));
            var worldDiag = Math.sqrt(Math.pow(WORLD_SIZE/2,2)*2);
            var y = Math.sin((1/2 - (cx/worldDiag)) * Math.PI)*hillHeight;
            if (Math.pow(i-centerX, 2) + Math.pow(k-centerY, 2) <= Math.pow(radius,2) &&
                j <= y) {
                // j <= Math.abs(Math.sin((i+k) * Math.PI / (WORLD_SIZE*2))) * 4) {
                this.world[i][j][k] = new Block(i,j,k,1, "dirt");
            }

            hillHeight = 5;

            var c = vec2(WORLD_SIZE/4+5, WORLD_SIZE/4+5);
            var x = vec2(i,k);
            var cx = length(subtract(c,x));
            var worldDiag = Math.sqrt(Math.pow(WORLD_SIZE/2,2)*2);
            var y = Math.sin((1/2 - (cx/worldDiag)) * Math.PI)*hillHeight;
            if (Math.pow(i-centerX, 2) + Math.pow(k-centerY, 2) <= Math.pow(radius,2) &&
                j <= y) {
                // j <= Math.abs(Math.sin((i+k) * Math.PI / (WORLD_SIZE*2))) * 4) {
                this.world[i][j][k] = new Block(i,j,k,1, "dirt");
            }

            hillHeight = 3;

            var c = vec2(WORLD_SIZE/4+15, WORLD_SIZE/4+10);
            var x = vec2(i,k);
            var cx = length(subtract(c,x));
            var worldDiag = Math.sqrt(Math.pow(WORLD_SIZE/2,2)*2);
            var y = Math.sin((1/2 - (cx/worldDiag)) * Math.PI)*hillHeight;
            if (Math.pow(i-centerX, 2) + Math.pow(k-centerY, 2) <= Math.pow(radius,2) &&
                j <= y) {
                // j <= Math.abs(Math.sin((i+k) * Math.PI / (WORLD_SIZE*2))) * 4) {
                this.world[i][j][k] = new Block(i,j,k,1, "dirt");
            }
        }
      }
    }

    // TREE 1
    var treeX = 10;
    var treeZ = 25;
    var treeHeight = 6;
    var treeCrownRadius = 3;

    for (var i = 0; i < treeHeight; i++) {
        this.world[treeX][i][treeZ] = new Block(treeX,i,treeZ,1, "wood");
    }

    for (var i = treeX-(treeCrownRadius); i <= treeX+(treeCrownRadius); i++) {
        for (var j = treeHeight-treeCrownRadius; j <= treeHeight+treeCrownRadius+10; j++) {
            for (var k = treeZ-(treeCrownRadius); k <= treeZ+(treeCrownRadius); k++) {


                // center = treeX, treeHeight-(treeCrownRadius/2), treeZ
                if (Math.pow(i - treeX, 2) + Math.pow(j - treeHeight-(treeCrownRadius/2), 2) + Math.pow(k-treeZ , 2) <= Math.pow(treeCrownRadius,2)) {
                    this.world[i][j][k] = new Block(i,j,k,1, "grass");
                }
            }
        }
    }


    // TREE 2
    treeX = 20;
    treeZ = 5;
    treeHeight = 5;
    treeCrownRadius = 4;    

    for (var i = treeX-(treeCrownRadius); i <= treeX+(treeCrownRadius); i++) {
        for (var j = treeHeight-treeCrownRadius; j <= treeHeight+treeCrownRadius+10; j++) {
            for (var k = treeZ-(treeCrownRadius); k <= treeZ+(treeCrownRadius); k++) {


                // center = treeX, treeHeight-(treeCrownRadius/2), treeZ
                if (Math.pow(i - treeX, 2) + Math.pow(j - treeHeight-(treeCrownRadius/2), 2) + Math.pow(k-treeZ , 2) <= Math.pow(treeCrownRadius,2)) {
                    this.world[i][j][k] = new Block(i,j,k,1, "grass");
                }
            }
        }
    }

    for (var i = 0; i < treeHeight; i++) {
        this.world[treeX][i][treeZ] = new Block(treeX,i,treeZ,1, "wood");
    }


    this.world[9][9][9] = new SpinningBlock(9,9,9,0.25,1,"wood");

  };

  // rebuilds the current world state as an array of vertices, vec4
  World.prototype.worldToVerticeArray = function() {
    this.worldVertices = [];
    this.worldBlockNormals = [];
    this.worldWireframeVertices = [];
    this.worldWireframeColors = [];
    this.worldSpinningBlockVertices = [];
    this.worldSpinningBlockNormals = [];


    this.worldVerticePos = [];



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


            currBlock.gridPosIndex = this.worldVerticePos.length;
            this.worldVerticePos = this.worldVerticePos.concat(currBlock.gridPos);


            // fill wireframe of block
            var wflines = [llf, tlf, tlf, trf, trf, lrf, lrf, llf,
            llb, tlb, tlb, trb, trb, lrb, lrb, llb,
            lrf, lrb, trf, trb, llf, llb, tlf, tlb];
            currBlock.frameIndex = this.worldWireframeVertices.length;
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
            currBlock.index = this.worldVertices.length;
            currBlock.textureIndex = this.texCoordsArray.length;
            this.worldVertices = this.worldVertices.concat(blockToVertices(currBlock));
            this.texCoordsArray = this.texCoordsArray.concat(currBlock.textureCoords);

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
    var currBlock = this.world[x][y][z];
    if (currBlock == undefined) {
      return;
    }
    this.removeVerticesFromArray(currBlock.index, currBlock.frameIndex);
    this.world[x][y][z] = undefined;
    var neighbours = this.getNeighbourBlocks(x,y,z);
    for(var i = 0; i < neighbours.length; i++) {
      if(this.getNeighbourBlocks(neighbours[i].llfx, neighbours[i].llfy, neighbours[i].llfz).length == 5) {
        
        neighbours[i].index = this.worldVertices.length;
        neighbours[i].frameIndex = this.worldWireframeColors.length;
        neighbours[i].textureIndex = this.texCoordsArray.length;
        neighbours[i].gridPosIndex = this.worldVerticePos.length;

        this.worldVertices = this.worldVertices.concat(blockToVertices(neighbours[i]));
        this.worldBlockNormals = this.worldBlockNormals.concat(this.standardNormals());
        this.texCoordsArray = this.texCoordsArray.concat(neighbours[i].textureCoords);
        this.worldVerticePos = this.worldVerticePos.concat(neighbours[i].gridPos);

        var wfcolors = [vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1)];
        this.worldWireframeColors = this.worldWireframeColors.concat(wfcolors);
      }
    }

    gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldVertices), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, wNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldBlockNormals), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, wfvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldWireframeVertices), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, wfcBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldWireframeColors), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, wvposBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldVerticePos), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, texBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.texCoordsArray), gl.STATIC_DRAW );
  }

  World.prototype.addBlock = function(x, y, z, block) {
    if(this.world[x][y][z] != undefined) {
      return;
    }
    this.world[x][y][z] = block;
    block.index = this.worldVertices.length;
    block.frameIndex = this.worldWireframeColors.length;

    block.textureIndex = this.texCoordsArray.length;
    this.texCoordsArray = this.texCoordsArray.concat(block.textureCoords);
    

    block.gridPosIndex = this.worldVerticePos.length;
    this.worldVerticePos = this.worldVerticePos.concat(block.gridPos);

    this.worldVertices = this.worldVertices.concat(blockToVertices(block));


    var neighbours = this.getNeighbourBlocks(block.llfx, block.llfy, block.llfz);
    for(var i = 0; i < neighbours.length; i++) {
      this.hideIfHidden(neighbours[i]);
    }
    this.worldBlockNormals = this.worldBlockNormals.concat(this.standardNormals());
    var wfcolors = [vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
    vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
    vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
    vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
    vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
    vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
    vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1),
    vec4(0, 0, 0, 1), vec4(0, 0, 0, 1), vec4(0, 0, 0, 1)];
    this.worldWireframeColors = this.worldWireframeColors.concat(wfcolors);


    gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldVertices), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, wNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldBlockNormals), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, wfvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldWireframeVertices), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, wfcBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldWireframeColors), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, wvposBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldVerticePos), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, texBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.texCoordsArray), gl.STATIC_DRAW );

  };

  World.prototype.hideIfHidden = function(block) {
    if(this.getNeighbourBlocks(block.llfx, block.llfy, block.llfz).length > 5) {
      this.removeVerticesFromArray(block.index, block.frameIndex, block.textureIndex, block.gridPosIndex);
    }
  };

  World.prototype.removeVerticesFromArray = function(index, frameIndex, textureIndex, gridPosIndex) {
    this.worldVertices.splice(index, 36);
    this.worldWireframeVertices.splice(frameIndex, 24);
    this.worldBlockNormals.splice(0, 36);
    this.worldWireframeColors.splice(0, 24);
    this.texCoordsArray.splice(index, 36);
    this.worldVerticePos.splice(index, 36);
    for (var i = 0; i < WORLD_SIZE; i++) {
      for (var j = 0; j < WORLD_SIZE; j++) {
        for (var k = 0; k < WORLD_SIZE; k++) {
          currBlock = this.world[i][j][k];
          if(currBlock == undefined) {
            continue;
          }
          if(!(currBlock instanceof Block)) {
            continue;
          }
          if(currBlock.index >= index) {
            currBlock.index = currBlock.index - 36;
            currBlock.frameIndex = currBlock.frameIndex - 24;
            currBlock.textureIndex -= 36;
            currBlock.gridPosIndex -= 36;
          }
        }
      }
    }
  };

  World.prototype.standardNormals = function () {
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

  return World;
})();