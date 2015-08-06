
var gl;

var numTimesToSubdivide = 8;
 
var index = 0;

var pointsArray = [];
var normalArray = [];


var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var lightPosition;
var lightPositionLoc;

function triangle(a, b, c) {
     pointsArray.push(a); 
     pointsArray.push(b); 
     pointsArray.push(c);
     var normal = vec4(normalize(cross(subtract(c,a), subtract(b,a))),0);
     normalArray.push(normal);
     normalArray.push(normal);
     normalArray.push(normal);  
     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = normalize(mix( a, b, 0.5), true);
        var ac = normalize(mix( a, c, 0.5), true);
        var bc = normalize(mix( b, c, 0.5), true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { // draw tetrahedron at end of recursion
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

function init() {
    gl.enable(gl.DEPTH_TEST);
    var va = vec4(0.0, 0.0, -1.0, 1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333, 1);
    
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalArray), gl.STATIC_DRAW);
    
    var vNormalLoc = gl.getAttribLocation( program, "vNormal");
    gl.vertexAttribPointer( vNormalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vNormalLoc);

    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    document.getElementById("Button0").onclick = function(){theta += dr;};
    document.getElementById("Button1").onclick = function(){theta -= dr;};
    document.getElementById("Button2").onclick = function(){phi += dr;};
    document.getElementById("Button3").onclick = function(){phi -= dr;};
    
    document.getElementById("Button4").onclick = function(){
        numTimesToSubdivide++; 
        index = 0;
        pointsArray = []; 
        init();
    };
    document.getElementById("Button5").onclick = function(){
        if(numTimesToSubdivide) numTimesToSubdivide--;
        index = 0;
        pointsArray = []; 
        init();
    };
    modelViewMatrix = mult(mat4(), translate(0,0,-3));
    projectionMatrix = perspective(60, 1.0, 0.01, 5);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //Handle view Matrix
    //eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
    //    radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    //eye = vec3(0,0,-2);
    //modelViewMatrix = lookAt(eye, at , up);
            
    lightPosition = vec4(2,2,3,1);
    gl.uniform4fv(lightPositionLoc, lightPosition);
        

    gl.drawArrays( gl.TRIANGLES, 0, index );

    //window.requestAnimFrame(render);


}
