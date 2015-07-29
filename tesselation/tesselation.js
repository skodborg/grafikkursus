
var gl;
var points = [];
var vRotation = 0.1;
var vRotataionLoc;

function init(program) {

    //triangle(vec2(-0.1,-0.1), vec2(0.1,-0.1), vec2(0,0.1));
    //triangle(vec2(0.6,0.6), vec2(0.3,0.3), vec2(0.2,0.9));

    generateDividedTriangle(vec2(-0.7,-0.7), vec2(0,0.7), vec2(0.7,-0.7), 10);

    // Load the data into the GPU

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    vRotataionLoc = gl.getUniformLocation( program, "vRotation" );

    render();

}

function triangle(a, b, c) {
    points.push(a);
    points.push(b);
    points.push(c);
}

function generateDividedTriangle(a, b, c, divisions){
    if(divisions==0){
        triangle(a,b,c);
    } else {
        var ab = mix(a, b, 0.5);
        var bc = mix(b, c, 0.5);
        var ac = mix(c, a, 0.5);
        divisions--;
        generateDividedTriangle(a, ab, ac, divisions);
        generateDividedTriangle(ac, bc, c, divisions);
        generateDividedTriangle(ab, b, bc, divisions);
        generateDividedTriangle(ab, bc, ac, divisions);
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    vRotation += 0.1;
    gl.uniform1f( vRotataionLoc, vRotation );

    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    window.requestAnimFrame(render);
}

