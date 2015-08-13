"use strict";

var canvas;
var gl;

var points = [];

var numTimesToSubdivide = 0;

var bufferId;

var angle = 0;

var scale = 0;

function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW );



    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var vAngle = gl.getAttribLocation( program, "vAngle" );
    gl.vertexAttribPointer( vAngle, 1, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vAngle );
    //gl.vertexAttrib( vAngle, gl.FLOAT );
    //gl.enableVertexAttrib( vAngle );

    var vScale = gl.getAttribLocation( program, "vScale" );
    gl.vertexAttribPointer( vScale, 1, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vScale );
    //gl.vertexAttrib( vScale, gl.FLOAT );
    //gl.enableVertexAttrib( vScale );

        document.getElementById("slider").onchange = function(event) {
        numTimesToSubdivide = parseInt(event.target.value);
        render();
    };
        document.getElementById("angle").onchange = function(event) {
        //gl.vertexAttribPointer( vAngle, 1, gl.FLOAT, false, 0, 0 );
        //gl.enableVertexAttribArray( vAngle );
        vAngle = parseFloat(event.target.value);
        render();
    };
        document.getElementById("scale").onchange = function(event) {
        //gl.vertexAttribPointer( vScale, 1, gl.FLOAT, false, 0, 0 );
        //gl.enableVertexAttribArray( vScale );
        vScale = parseFloat(event.target.value);
        render();
    };

    render();
};

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count == 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        divideTriangle( ab, ac, bc, count );
    }
}

window.onload = init;

function render()
{
    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];
    points = [];
    divideTriangle( vertices[0], vertices[1], vertices[2],
                    numTimesToSubdivide);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    points = [];
    //requestAnimFrame(render);
}
