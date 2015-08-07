//World Class
var World = (function () {
  var wvBuffer;
  var wcBuffer;
  function World() {
    this.world = [];
    this.worldVertices = [];         // filled by worldToVerticeArray();
    this.worldVerticeColors = [];    // filled by worldToVerticeArray();
    this.worldBlockNormals = [];     // filled by worldToVerticeArray(); one normal per vertice

    this.initWorld();
    this.worldToVerticeArray();

    wvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldVertices), gl.STATIC_DRAW );

    wcBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wcBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.worldVerticeColors), gl.STATIC_DRAW );

  }

  World.prototype.render = function() {
      // draw boxes
    gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, wcBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVerticeColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.TRIANGLES, 0, this.worldVertices.length);
  };

  World.prototype.initWorld = function() {
    for (var i = 0; i < WORLD_SIZE; i++) {
        this.world[i] = [];
        for (var j = 0; j < WORLD_SIZE; j++) {
            this.world[i][j] = [];
        }
    }
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            for (var k = 0; k < 10; k++) {
                this.world[i][j][k] = new Block(i,j,k,1, "someMat");
            }
        }
    }
  };

  // rebuilds the current world state as an array of vertices, vec4
  World.prototype.worldToVerticeArray = function() {
    var result = [];

    for (var i = 0; i < WORLD_SIZE; i++) {
        for (var j = 0; j < WORLD_SIZE; j++) {
            for (var k = 0; k < WORLD_SIZE; k++) {
                var currBlock = this.world[i][j][k];

                if (currBlock == undefined) continue;

                if (this.getNeighbourBlocks(i,j,k).length > 5) continue;

                var currBlockCorners = currBlock.getCorners();

                var llf = currBlockCorners[0];
                var tlf = currBlockCorners[1];
                var trf = currBlockCorners[2];
                var lrf = currBlockCorners[3];
                var llb = currBlockCorners[4];
                var tlb = currBlockCorners[5];
                var trb = currBlockCorners[6];
                var lrb = currBlockCorners[7];

                var fstVec = subtract(llf, tlf);
                var sndVec = subtract(tlf, trf);
                var normal = normalize(cross(sndVec, fstVec));
                this.worldBlockNormals = this.worldBlockNormals.concat([normal, normal, normal, normal, normal, normal]);
                var frontColor = vec4(normal);
                
                fstVec = subtract(lrf, trf);
                sndVec = subtract(lrf, lrb);
                normal = normalize(cross(sndVec, fstVec));
                this.worldBlockNormals = this.worldBlockNormals.concat([normal, normal, normal, normal, normal, normal]);
                var rightColor = vec4(normal, 1);

                fstVec = subtract(lrb, trb);
                sndVec = subtract(lrb, llb);
                normal = normalize(cross(sndVec, fstVec));
                this.worldBlockNormals = this.worldBlockNormals.concat([normal, normal, normal, normal, normal, normal]);
                var backColor = vec4(add(vec3(1,1,1), normal), 1);

                fstVec = subtract(llb, tlb);
                sndVec = subtract(llb, llf);
                normal = normalize(cross(sndVec, fstVec));
                this.worldBlockNormals = this.worldBlockNormals.concat([normal, normal, normal, normal, normal, normal]);
                var leftColor = vec4(add(vec3(1,1,1), normal), 1);

                fstVec = subtract(tlf, tlb);
                sndVec = subtract(tlf, trf);
                normal = normalize(cross(sndVec, fstVec));
                this.worldBlockNormals = this.worldBlockNormals.concat([normal, normal, normal, normal, normal, normal]);
                var upColor = vec4(normal, 1);

                fstVec = subtract(llf, lrf);
                sndVec = subtract(llf, llb);
                normal = normalize(cross(sndVec, fstVec));
                this.worldBlockNormals = this.worldBlockNormals.concat([normal, normal, normal, normal, normal, normal]);
                var downColor = vec4(add(vec3(1,1,1), normal), 1);

                // front face triangles
                result = result.concat([llf, tlf, trf]);
                result = result.concat([llf, trf, lrf]);
                this.worldVerticeColors = this.worldVerticeColors.concat([frontColor, frontColor, frontColor, 
                                                                frontColor, frontColor, frontColor]);
                
                // right face triangles
                result = result.concat([lrf, trf, lrb]);
                result = result.concat([lrb, trf, trb]);
                this.worldVerticeColors = this.worldVerticeColors.concat([rightColor, rightColor, rightColor, 
                                                                rightColor, rightColor, rightColor]);
                
                // // back face triangles
                result = result.concat([lrb, trb, llb]);
                result = result.concat([llb, trb, tlb]);
                this.worldVerticeColors = this.worldVerticeColors.concat([backColor, backColor, backColor, 
                                                                backColor, backColor, backColor]);

                // // left face triangles
                result = result.concat([llb, tlb, tlf]);
                result = result.concat([llb, tlf, llf]);
                this.worldVerticeColors = this.worldVerticeColors.concat([leftColor, leftColor, leftColor, 
                                                                leftColor, leftColor, leftColor]);

                // // up face triangles
                result = result.concat([tlf, tlb, trb]);
                result = result.concat([tlf, trb, trf]);
                this.worldVerticeColors = this.worldVerticeColors.concat([upColor, upColor, upColor, 
                                                                upColor, upColor, upColor]);

                // // down face triangles
                result = result.concat([llf, llb, lrb]);
                result = result.concat([llf, lrb, lrf]);
                this.worldVerticeColors = this.worldVerticeColors.concat([downColor, downColor, downColor, 
                                                                downColor, downColor, downColor]);
            }
        }
    }
    this.worldVertices = result;
  };

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