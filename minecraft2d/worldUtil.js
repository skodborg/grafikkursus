

// returns lower left corner of block
function gridCoordToBlock(x, y) {
  var halfGridSize = GRID_SIZE/2;
  var col = (x / halfGridSize) -1;
  var row = (y / halfGridSize) -1;
  return vec2(col, row);
}

// returns grid index corresponding to mouse click
function pointToGrid(x, y) {
  col = Math.floor(x / BLOCK_SIZE);
  row = (GRID_SIZE-1) - Math.floor(y / BLOCK_SIZE);
  return [col, row];
}

// returns grid index corresponding to world coord
function worldToGrid(x, y){
  col = Math.floor((x+1)/(2/GRID_SIZE));
  row = Math.floor((y+1)/(2/GRID_SIZE));
  return [col, row];
}

function gridToWorld(x, y) {
  var newX = -1 + 2*x/GRID_SIZE;
  var newY = -1 + 2*y/GRID_SIZE;
  return vec2(newX, newY);
}

//Get neighbours of a grid element
function getNeighbours(x, y) {
  var result = [];
  if(x > 0 && world[x -1][y] != undefined) {
    result.push(world[x -1][y]);
  }
  if(world[x][y + 1] != undefined) {
    result.push(world[x][y + 1]);
  }
  if(x < GRID_SIZE-1 && world[x + 1][y] != undefined) {
    result.push(world[x + 1][y]);
  }
  if(world[x][y - 1] != undefined) {
    result.push(world[x][y - 1]);
  }
  return result;
}

function prepopulateWorld() {

  for (var i = 0; i < GRID_SIZE; i++) {
    world.push([]);
  }

  var groundRows = 8;
  for (var i = 0; i < GRID_SIZE; i++) {
    for (var j = 0; j < groundRows; j++) {
      world[i][j] = new Block(i,j, colors[0]);
    }
  }

  world[23][8] = new Block(23,8, colors[0]);
  world[24][8] = new Block(24,8, colors[0]);
  world[22][8] = new Block(22,8, colors[0]);
  world[24][9] = new Block(24,9, colors[0]);
  world[0][8] = new Block(0,8, colors[0]);
  world[1][8] = new Block(1,8, colors[0]);
  world[2][8] = new Block(2,8, colors[0]);
  world[3][8] = new Block(3,8, colors[0]);
  world[4][8] = new Block(4,8, colors[0]);
  world[5][8] = new Block(5,8, colors[0]);
  world[4][9] = new Block(4,9, colors[03]);
  world[3][9] = new Block(3,9, colors[0]);
  world[2][9] = new Block(2,9, colors[0]);
  world[1][9] = new Block(1,9, colors[0]);
  world[0][9] = new Block(0,9, colors[0]);
  world[1][10] = new Block(1,10, colors[0]);
  world[0][10] = new Block(0,10, colors[0]);
  world[10][8] = new Block(10,8, colors[0]);
  world[11][8] = new Block(11,8, colors[0]);
  world[12][8] = new Block(12,8, colors[0]);

  // cover with grass
  world[0][11] = new Block(0,11, colors[3]);
  world[1][11] = new Block(1,11, colors[3]);
  world[2][10] = new Block(2,10, colors[3]);
  world[3][10] = new Block(3,10, colors[3]);
  world[4][10] = new Block(4,10, colors[3]);
  world[5][9]  = new Block(5,9, colors[3]);
  world[6][8]  = new Block(6,8, colors[3]);
  world[7][8]  = new Block(7,8, colors[3]);
  world[8][8]  = new Block(8,8, colors[3]);
  world[9][8]  = new Block(9,8, colors[3]);
  world[10][9] = new Block(10,9, colors[3]);
  world[11][9] = new Block(11,9, colors[3]);
  world[12][9] = new Block(12,9, colors[3]);
  world[13][8] = new Block(13,8, colors[3]);
  world[14][8] = new Block(14,8, colors[3]);
  world[15][8] = new Block(15,8, colors[3]);
  world[16][8] = new Block(16,8, colors[3]);
  world[17][8] = new Block(17,8, colors[3]);
  world[18][8] = new Block(18,8, colors[3]);
  world[19][8] = new Block(19,8, colors[3]);
  world[20][8] = new Block(20,8, colors[3]);
  world[21][8] = new Block(21,8, colors[3]);
  world[22][9] = new Block(22,9, colors[3]);
  world[23][9] = new Block(23,9, colors[3]);
  world[24][10] = new Block(24,10, colors[3]);

  // create tree
  world[18][9] = new Block(18,9, colors[2]);
  world[18][10] = new Block(18,10, colors[2]);
  world[18][11] = new Block(18,11, colors[2]);
  world[18][12] = new Block(18,12, colors[2]);
  world[17][12] = new Block(17,12, colors[3]);
  world[17][13] = new Block(17,13, colors[3]);
  world[18][13] = new Block(18,13, colors[3]);
  world[19][13] = new Block(19,13, colors[3]);
  world[19][12] = new Block(19,12, colors[3]);
  world[16][11] = new Block(16,11, colors[3]);
  world[16][12] = new Block(16,12, colors[3]);
  world[16][13] = new Block(16,13, colors[3]);
  world[17][14] = new Block(17,14, colors[3]);
  world[18][14] = new Block(18,14, colors[3]);
  world[19][14] = new Block(19,14, colors[3]);
  world[20][13] = new Block(20,13, colors[3]);
  world[20][12] = new Block(20,12, colors[3]);
  world[20][11] = new Block(20,11, colors[3]);
}
