
var canvas;
var gl;

var maxNumTriangles = 200;  
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;
var first = true;

var t1, t2, t3, t4;

var currColor = vec4(1.0, 1.0, 1.0, 1.0);

var exSquare;

var square = [-1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0];


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    colorExCanvas = document.getElementById( "color-canvas" );


    document.getElementById("slider").onchange = 
      function(event) {
        var newVal = event.srcElement.value;
        document.getElementById("currSliderValue").innerHTML = newVal;

        var newValCorrected = newVal / 255;
        var t = vec4(1.0-newValCorrected, 1.0, 1.0, 1.0);

        cgl.bindBuffer(cgl.ARRAY_BUFFER, cEx_cBuffer);
        cgl.bufferSubData(cgl.ARRAY_BUFFER, 0, flatten(t));
        cgl.bufferSubData(cgl.ARRAY_BUFFER, 16, flatten(t));
        cgl.bufferSubData(cgl.ARRAY_BUFFER, 32, flatten(t));
        cgl.bufferSubData(cgl.ARRAY_BUFFER, 48, flatten(t));

        currColor = t;
        render();
      };
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    cgl = WebGLUtils.setupWebGL( colorExCanvas );
    if ( !cgl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    cgl.viewport( 0, 0, colorExCanvas.width, colorExCanvas.height );
    cgl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    cgl.clear( cgl.COLOR_BUFFER_BIT );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);



    var program = initShaders( cgl, "vertex-shader", "fragment-shader" );
    cgl.useProgram( program );

    var cEx_vBuffer = cgl.createBuffer();
    cgl.bindBuffer(cgl.ARRAY_BUFFER, cEx_vBuffer);
    cgl.bufferData(cgl.ARRAY_BUFFER, flatten(square), cgl.STATIC_DRAW);
    
    var cEx_vPosition = cgl.getAttribLocation( program, "vPosition");
    cgl.vertexAttribPointer(cEx_vPosition, 2, cgl.FLOAT, false, 0, 0);
    cgl.enableVertexAttribArray(cEx_vPosition);
    
    var cEx_cBuffer = cgl.createBuffer();
    cgl.bindBuffer(cgl.ARRAY_BUFFER, cEx_cBuffer);
    cgl.bufferData(cgl.ARRAY_BUFFER, sizeof.vec4 * 4, cgl.STATIC_DRAW );
    
    var vColor = cgl.getAttribLocation( program, "vColor");
    cgl.vertexAttribPointer(vColor, 4, cgl.FLOAT, false, 0, 0);
    cgl.enableVertexAttribArray(vColor);

    
    canvas.addEventListener("mousedown", function(event){
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        if(first) {
          first = false;
          gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer)
          t1 = vec2(2*event.clientX/canvas.width-1, 
            2*(canvas.height-event.clientY)/canvas.height-1);
        }
        else {
          first = true;
          t2 = vec2(2*event.clientX/canvas.width-1, 
            2*(canvas.height-event.clientY)/canvas.height-1);
          t3 = vec2(t1[0], t2[1]);
          t4 = vec2(t2[0], t1[1]);

          gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
          gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t3));
          gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(t2));
          gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(t4));
          gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
          index += 4;
          
          t = currColor;

          gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-4), flatten(t));
          gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-3), flatten(t));
          gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-2), flatten(t));
          gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-1), flatten(t));
        }
    } );

    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );

    for(var i = 0; i<index; i+=4)
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );

    cgl.clear( cgl.COLOR_BUFFER_BIT );
    cgl.drawArrays( cgl.TRIANGLE_FAN, 0, 4);

    window.requestAnimFrame(render);

}
