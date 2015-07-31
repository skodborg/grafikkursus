function worldToBuffer(array2d, whatToGet) {
	var result = [];
	for (var i = 0; i < array2d.length; i++) {
		for(var j = 0; j < array2d[i].length; j++) {
			var entry = array2d[i][j];
			if(whatToGet === "vertices") {
				if (entry != undefined) {
					var resultTrianglesCorners = [];
					var entryCorners = entry.getCorners();
					resultTrianglesCorners.push(entryCorners[0]);
					resultTrianglesCorners.push(entryCorners[1]);
					resultTrianglesCorners.push(entryCorners[2]);
					resultTrianglesCorners.push(entryCorners[0]);
					resultTrianglesCorners.push(entryCorners[2]);
					resultTrianglesCorners.push(entryCorners[3]);
					result = result.concat(resultTrianglesCorners);
				}
			}
			if(whatToGet === "colors") {
				if (entry != undefined) {
					result = result.concat(entry.color);
				}
			}
		}
	}
	if(whatToGet === "vertices") {
		bufferLength = flatten(result).length;
	}
	return flatten(result);
}



function clickedSquare(p) {
	var clickedBlock = world[p[0]][p[1]];
	if (world[p[0]][p[1]] == undefined) { //We clicked the sky
		if (getNeighbours(p[0], p[1]).length > 0) {//We do have a neighbour, so we can build box
			var newBlock = new Block(p[0], p[1], colors[cIndex]);
			 world[p[0]][p[1]] = newBlock;

			gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
		  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "vertices"), gl.STATIC_DRAW );

		  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
		  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "colors"), gl.STATIC_DRAW );

	  	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
	  	ripple.createRipple(p[0], p[1]);
		}
	}
	else { //We clicked on an existing box
		world[p[0]][p[1]] = undefined;

		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
	  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "vertices"), gl.STATIC_DRAW );

	  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
	  gl.bufferData( gl.ARRAY_BUFFER, worldToBuffer(world, "colors"), gl.STATIC_DRAW );

	  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
	  ripple.createRipple(p[0], p[1]);
	}
}