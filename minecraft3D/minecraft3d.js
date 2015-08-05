var gl;

var vPositionLoc;
var vColorLoc;

var axisVertices = [];
var axisColors = [];

var world = [];
var worldVertices = [];         // filled by worldToVerticeArray();
var worldVerticeColors = [];    // filled by worldToVerticeArray();

var camera;

var vBuffer;
var cBuffer;

function init() {
    // initializes points for painting the axis indicator lines
    initAxisLines();
    initWorld();

    gl.enable(gl.DEPTH_TEST);

    worldToVerticeArray();

    window.onkeydown = handleKeyPress;

    camera = new Camera();

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );

    // Associate out shader variables with our data buffer
    vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPositionLoc );


    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );

    // Associate out shader variables with our data buffer
    vColorLoc = gl.getAttribLocation( program, "vColor" );
    gl.enableVertexAttribArray( vColorLoc );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    // draw boxes
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(worldVerticeColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.TRIANGLES, 0, worldVertices.length);

    camera.update();

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

function initWorld() {
    var someBlock = new Block(0, 0.5, 0, 0.1, "someMat");
    var someBlock2 = new Block(0, 0, 0, 0.1, "someMat");
    world.push(someBlock);
    world.push(someBlock2);
}

// rebuilds the current world state as an array of vertices, vec4
function worldToVerticeArray() {
    var result = [];

    for (var i = 0; i < world.length; i++) {
        var currBlock = world[i];

        var currBlockCorners = currBlock.getCorners();

        var llf = currBlockCorners[0];
        var tlf = currBlockCorners[1];
        var trf = currBlockCorners[2];
        var lrf = currBlockCorners[3];
        var llb = currBlockCorners[4];
        var tlb = currBlockCorners[5];
        var trb = currBlockCorners[6];
        var lrb = currBlockCorners[7];

        var frontColor = vec4(Math.random(), Math.random(), Math.random(), 1);
        var rightColor = vec4(Math.random(), Math.random(), Math.random(), 1);
        var backColor = vec4(Math.random(), Math.random(), Math.random(), 1);
        var leftColor = vec4(Math.random(), Math.random(), Math.random(), 1);
        var upColor = vec4(Math.random(), Math.random(), Math.random(), 1);
        var downColor = vec4(Math.random(), Math.random(), Math.random(), 1);

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
    worldVertices = result;
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
            camera.rotY(-1);
            break;
        case 38:
            camera.rotX(-1);
            break;
        case 39:
            camera.rotY(1);
            break;
        case 40:
            camera.rotX(1);
            break;
        //Rotation
        case 65:
            camera.left(0.1);
            break;
        case 87:
            camera.forward(0.1);
            break;
        case 68:
            camera.right(0.1);
            break;
        case 83:
            camera.backward(0.1);
            break;
    }
}