var gl;
var vPositions = [];
var fColorLoc;

var initPoints = [vec4(0, 0, 0, 1),
                  vec4(1, 0, 0, 1),
                  vec4(0.5, 1, 0, 1)];

function init() {

    vPositions.push(initPoints[0]);
    vPositions.push(initPoints[1]);
    vPositions.push(initPoints[2]);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vPositions), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );

    fColorLoc = gl.getUniformLocation( program, "fColor" );
    gl.uniform4fv(fColorLoc, vec4(1,1,1,1));

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays(gl.TRIANGLES, 0, vPositions.length);

}
