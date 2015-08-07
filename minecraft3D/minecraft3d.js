var gl;

var vPositionLoc;
var vColorLoc;

var BLOCK_SIZE = 1;
var WORLD_SIZE = 30;
var BLOCK_NORMALS = [vec4(0, 0, 1, 0),
                     vec4(1, 0, 0, 0),
                     vec4(0, 0,-1, 0),
                     vec4(-1,0, 0, 0),
                     vec4(0 ,1, 0, 0),
                     vec4(0,-1, 0, 0)];

var axisVertices = [];
var axisColors = [];

var world = [];
var worldVertices = [];         // filled by worldToVerticeArray();
var worldVerticeColors = [];    // filled by worldToVerticeArray();
var worldBlockNormals = [];     // filled by worldToVerticeArray(); one normal per vertice


var wireframeVertices = [];
var wireframeColors = [];


var camera;
var player;

var wvBuffer;   // vertice buffer for world blocks
var wcBuffer;   // color buffer for world blocks
var vBuffer;
var cBuffer;

var MOVEMENT_SPEED = 0.3;
var ROTATION_SPEED = 0.1;
var lastTime = new Date().getTime();
var elapsedTime = 1;

// KEYS
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var aPressed = false;
var sPressed = false;
var dPressed = false;
var wPressed = false;
var spacePressed = false;
var shiftPressed = false;

var oldMouseX = undefined;
var oldMouseY = undefined;
var mouseLeftDown = false;

function init() {
    // initializes points for painting the axis indicator lines
    initAxisLines();
    initWorld();

    gl.enable(gl.DEPTH_TEST);
    // offsets the polygons defining the blocks from the lines outlining them
    // result is smooth outlining
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0, 0);

    camera = new Camera();
    player = new Player(0, 0, -2, camera);    

    drawWireframeAtGridPos(0,0,0);

    window.onkeydown = handleKeyPress;
    window.onkeyup = handleKeyRelease;
    window.onmousemove = handleMouseMove;
    window.onmousedown = handleMouseDown;
    window.onmouseup = handleMouseUp;


    vBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();

    var start = new Date().getTime();

    worldToVerticeArray(); // fills up worldVertices-array prior to binding it to the buffer

    var currTime = new Date().getTime();
    // console.log("javascript: " + (currTime - start));

    wvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVertices), gl.STATIC_DRAW );

    var newCurrTime = new Date().getTime();
    // console.log("WebGL: " + (newCurrTime - currTime));

    // Associate out shader variables with our data buffer
    vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPositionLoc );


    wcBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wcBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVerticeColors), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vColorLoc = gl.getAttribLocation( program, "vColor" );
    gl.enableVertexAttribArray( vColorLoc );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    update();

    // draw boxes
    gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, wcBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVerticeColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.TRIANGLES, 0, worldVertices.length);

    // draw wireframe
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(wireframeVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(wireframeColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.LINES, 0, wireframeVertices.length);

    // draw XYZ-indicators
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(axisVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(axisColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.LINES, 0, axisVertices.length);

    window.requestAnimFrame(render);
}
//The function driving our animations
function update() {
    var currTime = new Date().getTime();
    elapsedTime = (currTime - lastTime) / 40;
    if(elapsedTime == 0) {
        elapsedTime = 0.00001;
    }
    player.handleKeys();
    player.updatePosition();
    camera.update();
    lastTime = currTime;
}

function initWorld() {
    for (var i = 0; i < WORLD_SIZE; i++) {
        world[i] = [];
        for (var j = 0; j < WORLD_SIZE; j++) {
            world[i][j] = [];
        }
    }
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            for (var k = 0; k < 10; k++) {
                world[i][j][k] = new Block(i,j,k,1, "someMat");
            }
        }
    }
}

function drawWireframeAtGridPos(x, y, z) {

    wireframeVertices.push(vec4(x, y, z, 1));                                               // #1
    wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z, 1));                                  // #2
    wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z, 1));                                  // #2
    wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z, 1));                     // #4
    wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z, 1));                     // #4
    wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z, 1));                                  // #3
    wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z, 1));                                  // #3
    wireframeVertices.push(vec4(x, y, z, 1));                                               // #1

    wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z, 1));                     // #4
    wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));        // #8
    wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z - BLOCK_SIZE, 1));                     // #7
    wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z, 1));                                  // #3

    wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z - BLOCK_SIZE, 1));                     // #7
    wireframeVertices.push(vec4(x, y, z - BLOCK_SIZE, 1));                                  // #5
    wireframeVertices.push(vec4(x, y, z - BLOCK_SIZE, 1));                                  // #5
    wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));                     // #6
    wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));                     // #6
    wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));        // #8
    wireframeVertices.push(vec4(x + BLOCK_SIZE, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));        // #8
    wireframeVertices.push(vec4(x + BLOCK_SIZE, y, z - BLOCK_SIZE, 1));                     // #7

    wireframeVertices.push(vec4(x, y, z - BLOCK_SIZE, 1));                                  // #5
    wireframeVertices.push(vec4(x, y, z, 1));                                               // #1
    wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z, 1));                                  // #2
    wireframeVertices.push(vec4(x, y + BLOCK_SIZE, z - BLOCK_SIZE, 1));                     // #6

    
    for (var i = 0; i < 24; i++) {
        wireframeColors.push(vec4(0,0,0,1));
    }
}

function getNeighbourBlocks(x, y, z) {
    var result = [];
    if (x < WORLD_SIZE-1) {
        var currNeighbour = world[x+1][y][z];
        if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    if (x > 0) {
        var currNeighbour = world[x-1][y][z];
        if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    if (y < WORLD_SIZE-1) {
        var currNeighbour = world[x][y+1][z];
        if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    if (y > 0) {
        var currNeighbour = world[x][y-1][z];
        if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    if (z < WORLD_SIZE-1) {
        var currNeighbour = world[x][y][z+1];
        if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    if (z > 0) {
        var currNeighbour = world[x][y][z-1];
        if (currNeighbour !== undefined) result.push(currNeighbour);
    }
    return result;
}

function removeBlockFromWorld(x, y, z) {
    if (world[x][y][z] != undefined) {
        world[x][y][z] = undefined;
        worldToVerticeArray();
        gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVertices), gl.STATIC_DRAW );
        gl.bindBuffer( gl.ARRAY_BUFFER, wcBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVerticeColors), gl.STATIC_DRAW );
    }
}

function addBlockToWorld(x, y, z, block) {
    if (world[x][y][z] == undefined) {
        world[x][y][z] = block;
        worldToVerticeArray();
        gl.bindBuffer( gl.ARRAY_BUFFER, wvBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVertices), gl.STATIC_DRAW );
        gl.bindBuffer( gl.ARRAY_BUFFER, wcBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVerticeColors), gl.STATIC_DRAW );
    }
}

// rebuilds the current world state as an array of vertices, vec4
function worldToVerticeArray() {
    var result = [];
    var normals = [];
    worldVerticeColors = [];
    worldBlockNormals = [];
    worldVertices = [];

    for (var i = 0; i < WORLD_SIZE; i++) {
        for (var j = 0; j < WORLD_SIZE; j++) {
            for (var k = 0; k < WORLD_SIZE; k++) {
                var currBlock = world[i][j][k];

                if (currBlock == undefined) continue;

                if (getNeighbourBlocks(i,j,k).length > 5) continue;

                var currBlockCorners = currBlock.getCorners();

                var llf = currBlockCorners[0];
                var tlf = currBlockCorners[1];
                var trf = currBlockCorners[2];
                var lrf = currBlockCorners[3];
                var llb = currBlockCorners[4];
                var tlb = currBlockCorners[5];
                var trb = currBlockCorners[6];
                var lrb = currBlockCorners[7];

                var frontNormal = BLOCK_NORMALS[0];
                var rightNormal = BLOCK_NORMALS[1];
                var backNormal = BLOCK_NORMALS[2];
                var leftNormal = BLOCK_NORMALS[3];
                var upNormal = BLOCK_NORMALS[4];
                var downNormal = BLOCK_NORMALS[5];
                normals = normals.concat([frontNormal, frontNormal, 
                                          frontNormal, frontNormal, 
                                          frontNormal, frontNormal]);


                var frontColor = vec4(vec3(frontNormal), 1);
                // var frontColor = vec4(0,0,1,1);
                
                
                normals = normals.concat([rightNormal, rightNormal, 
                                          rightNormal, rightNormal, 
                                          rightNormal, rightNormal]);
                var rightColor = vec4(vec3(rightNormal, 1));
                // var rightColor = vec4(1,0,0,1);
                
                
                normals = normals.concat([backNormal, backNormal, 
                                          backNormal, backNormal, 
                                          backNormal, backNormal]);
                var backColor = vec4(add(vec3(1,1,1), vec3(backNormal)), 1);
                // var backColor = vec4(1,1,0,1);
                
                
                normals = normals.concat([leftNormal, leftNormal, 
                                          leftNormal, leftNormal, 
                                          leftNormal, leftNormal]);
                var leftColor = vec4(add(vec3(1,1,1), vec3(leftNormal)), 1);
                // var leftColor = vec4(0,1,1,1);
                
                
                normals = normals.concat([upNormal, upNormal,
                                          upNormal, upNormal, 
                                          upNormal, upNormal]);
                var upColor = vec4(vec3(upNormal), 1);
                // var upColor = vec4(0,1,0,1);
                

                normals = normals.concat([downNormal, downNormal,
                                          downNormal, downNormal, 
                                          downNormal, downNormal]);
                var downColor = vec4(add(vec3(1,1,1), vec3(downNormal)), 1);
                // var downColor = vec4(1,0,1,1);


                // front face triangles
                result = result.concat([llf, tlf, trf]);
                result = result.concat([llf, trf, lrf]);
                worldVerticeColors = worldVerticeColors.concat([frontColor, frontColor, frontColor, 
                                                                frontColor, frontColor, frontColor]);
                
                // right face triangles
                result = result.concat([lrf, trf, lrb]);
                result = result.concat([lrb, trf, trb]);
                worldVerticeColors = worldVerticeColors.concat([rightColor, rightColor, rightColor, 
                                                                rightColor, rightColor, rightColor]);
                
                // // back face triangles
                result = result.concat([lrb, trb, llb]);
                result = result.concat([llb, trb, tlb]);
                worldVerticeColors = worldVerticeColors.concat([backColor, backColor, backColor, 
                                                                backColor, backColor, backColor]);

                // // left face triangles
                result = result.concat([llb, tlb, tlf]);
                result = result.concat([llb, tlf, llf]);
                worldVerticeColors = worldVerticeColors.concat([leftColor, leftColor, leftColor, 
                                                                leftColor, leftColor, leftColor]);

                // // up face triangles
                result = result.concat([tlf, tlb, trb]);
                result = result.concat([tlf, trb, trf]);
                worldVerticeColors = worldVerticeColors.concat([upColor, upColor, upColor, 
                                                                upColor, upColor, upColor]);

                // // down face triangles
                result = result.concat([llf, llb, lrb]);
                result = result.concat([llf, lrb, lrf]);
                worldVerticeColors = worldVerticeColors.concat([downColor, downColor, downColor, 
                                                                downColor, downColor, downColor]);
            }
        }
    }
    worldVertices = result;
    worldBlockNormals = normals;
}

function initAxisLines() {
    axisVertices = [
        vec3(0.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 0.0, 1.0)];

    axisColors = [
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 )];
}

function handleKeyPress(event){
    switch (event.keyCode) {
        //Movement
        case 37:
            addBlockToWorld(3, 3, 3, new Block(3,3,3,0.5, "lol"));
            leftPressed = true;
            break;
        case 38:
            upPressed = true;
            break;
        case 39:
            removeBlockFromWorld(3,3,3);
            rightPressed = true;
            break;
        case 40:
            downPressed = true;

            break;
        //Rotation
        case 65:
            aPressed = true;
            break;
        case 87:
            wPressed = true;
            break;
        case 68:
            dPressed = true;
            break;
        case 83:
            sPressed = true;
            break;
        case 32:
            spacePressed = true;
            break;
        case 16:
            shiftPressed = true;
            break;
    }
}

function handleKeyRelease(event){
    switch (event.keyCode) {
        //Movement
        case 37:
            leftPressed = false;
            break;
        case 38:
            upPressed = false;
            break;
        case 39:
            rightPressed = false;
            break;
        case 40:
            downPressed = false;
            break;
        //Rotation
        case 65:
            aPressed = false;
            break;
        case 87:
            wPressed = false;
            break;
        case 68:
            dPressed = false;
            break;
        case 83:
            sPressed = false;
            break;
        case 32:
            spacePressed = false;
            break;
        case 16:
            shiftPressed = false;
            break;
    }
}

function handleMouseMove(event) {
    if(!mouseLeftDown) {
        return;
    }
    if(oldMouseX == undefined) {
        oldMouseX = event.clientX;
        return;
    }
    if(oldMouseY == undefined) {
        oldMouseY = event.clientY;
        return;
    }
    player.handleMouseMove((event.clientX - oldMouseX), (event.clientY - oldMouseY));
    oldMouseX = event.clientX;
    oldMouseY = event.clientY;
}

function handleMouseDown(event) {
    mouseLeftDown = true;
    oldMouseX = event.clientX;
    oldMouseY = event.clientY;
}

function handleMouseUp() {
    mouseLeftDown = false;
}


function multmv( m, v )
{
    var result = [];

    if ( m.matrix && v.length > 1 && !v.matrix ) {
        for ( var i = 0; i < 4; i++ ) {
            var sum = 0.0;
            for ( var j = 0; j < 4; j++ ) {
                sum += m[i][j]*v[j];
            }
            result.push(sum);
        }
    }

    return vec4(result);
}