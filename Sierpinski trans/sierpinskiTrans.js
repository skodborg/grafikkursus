var gl;
var vPositions = [];
var fColorLoc;

var initPoints = [vec4(0, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(0.5, 1, 0, 1)];

function init(program) {

    vPositions.push(initPoints[0]);
    vPositions.push(initPoints[1]);
    vPositions.push(initPoints[2]);

    generateGasket(mat4(), 2);

    console.log(vPositions.length);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vPositions), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    fColorLoc = gl.getUniformLocation( program, "fColor" );
    gl.uniform4fv(fColorLoc, vec4(1,1,1,1));

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );


    for(var i = 0; i < vPositions.length; i += 3 ) {
        gl.drawArrays(gl.TRIANGLES, i, 3);

        gl.uniform4fv(fColorLoc, vec4(Math.random(), Math.random(), Math.random(), 1));
    }

}

function generateGasket (mat, recursions) {

    if(recursions == 0){
        vPositions.push(multmv(mat, initPoints[0]));
        vPositions.push(multmv(mat, initPoints[1]));
        vPositions.push(multmv(mat, initPoints[2]));
    } else {
        var transed = mult(mat, translate(mat[0][0]/2, mat[1][1], 0));
        var scaled = mult(mat, scalem(1/2, 1/2, 1));
        var tscaled = mult(scaled, translate(mat[0][0]/2, mat[1][1],0));
        generateGasket(scaled, recursions - 1);
        generateGasket(tscaled, recursions - 1);
        tscaled = mult(scaled, translate(mat[0][0], 0, 0));
        generateGasket(tscaled, recursions - 1);
    }
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