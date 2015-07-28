
var gl;
var points = [];
var colors = [];

function init(canvas)
{

  triangle(vec2(0, 0), vec2(1, 1), vec2(0, -1), rndColor1);
  triangle(vec2(-1, -1), vec2(0, 1), vec2(1, 0), rndColor2);
  
  //  Configure WebGL
  
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

  
  //  Load shaders and initialize attribute buffers
  
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  
  // Load the data into the GPU

  var cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
  
  // Associate out shader variables with our data buffer

  var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 ); 
    gl.enableVertexAttribArray( vColor );

  // Load the data into the GPU

  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  // Associate out shader variables with our data buffer

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  render();

};

function triangle(a, b, c, color) {
  colors.push(color);
  points.push(a);
  colors.push(color);
  points.push(b);
  colors.push(color);
  points.push(c);
}

function getRandomVec3Color() {
  return vec3(Math.random(), Math.random(), Math.random());
}

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );
  gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
