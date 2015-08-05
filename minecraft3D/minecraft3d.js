var gl;

var vPositionLoc;
var vColorLoc;

var axisVertices = [];
var axisColors = [];

var camera;

var vBuffer;
var cBuffer;

function init() {
    // initializes points for painting the axis indicator lines
    initAxisLines();

    window.onkeydown = handleKeyPress;

    camera = new Camera();

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );

    // Associate out shader variables with our data buffer

    vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );



    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );

    // Associate out shader variables with our data buffer

    vColorLoc = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorLoc );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

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
            camera.rotY(2);
            break;
        case 38:
            camera.rotX(2);
            break;
        case 39:
            camera.rotY(-2);
            break;
        case 40:
            camera.rotX(-2);
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