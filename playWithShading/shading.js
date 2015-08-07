
var gl;

var numTimesToSubdivide = 6;
 
var index = 0;

var pointsArray = [];
var normalArray = [];

var ambientProduct, diffuseProduct, specularProduct;
var ambientProductLoc, diffuseProductLoc, specularProductLoc;
var shininess;
var shininessLoc;


var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var normalMatrix, normalMatrixLoc;

var lightPosition;
var lightPositionLoc;

function triangle(a, b, c) {
    //a = add(a, vec4(0.5,0.5,0,1));
    //b = add(b, vec4(0.5,0.5,0,1));
    //c = add(c, vec4(0.5,0.5,0,1));
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

    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    ambientProductLoc = gl.getUniformLocation(program, "ambientProduct"); 
    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    specularProductLoc = gl.getUniformLocation(program, "specularProduct");
    shininessLoc = gl.getUniformLocation(program, "shininess");

    modelViewMatrix = mult(mat4(), translate(0,0,-4));
    modelViewMatrix = mult(modelViewMatrix, scalem(1,2,1));
    projectionMatrix = perspective(60, 1.0, 0.01, 5);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    render();
}

function setParameters(choice) {
    if(choice == 0) { //Nice
        ambientProduct = vec4(0,0.1,0,1);
        diffuseProduct = vec4(0,0.5,0,1);
        specularProduct = vec4(0.8,0.8,0.8,1);
        shininess = 100;
    }
    if(choice == 1) { //Ugly
        ambientProduct = vec4(0.3,0.0,0.0,1);
        diffuseProduct = vec4(0,0.5,0,1);
        specularProduct = vec4(0.0,0.0,1,1);
        shininess = 10;
    }

    if(choice == 2) { //Carbon
        ambientProduct = vec4(0,0,0,1);
        diffuseProduct = vec4(0.3,0.3,0.3,1);
        specularProduct = vec4(0.6,0.6,0.6,1);
        shininess = 300;
    }

    gl.uniform4fv(ambientProductLoc, ambientProduct);
    gl.uniform4fv(diffuseProductLoc, diffuseProduct);
    gl.uniform4fv(specularProductLoc, specularProduct);
    gl.uniform1f(shininessLoc, shininess);
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    setParameters(2);

    modelViewMatrix = mult(modelViewMatrix, rotate(1, vec3(0,1,0)));        
    lightPosition = vec4(5,3,3,1);
    gl.uniform4fv(lightPositionLoc, lightPosition);

    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    //normalMatrix = transpose(inverse3(normalMatrix));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
        

    gl.drawArrays( gl.TRIANGLES, 0, index );

    window.requestAnimFrame(render);


}
