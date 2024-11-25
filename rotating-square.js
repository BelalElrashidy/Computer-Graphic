"use strict";
let thetaLoc ;
let x =0.01;
let theta = 0;

function rotatingSquare() {
    const gl = setupGL("square");
    if (!gl) return;
    const vertexShaderSource = `#version 300 es
        in vec2 aPosition;
        uniform float theta;
        void main() {
            gl_Position.x = -sin(theta) * aPosition.x + cos(theta) * aPosition.y;
            gl_Position.y = cos(theta) * aPosition.x + sin(theta) * aPosition.y;
            gl_Position.z = 0.0;
            gl_Position.w = 1.0;
        }`;
    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    if (!vertexShader) return;
    const fragmentShaderSource = `#version 300 es
        precision mediump float;
        out vec4 fragColor;
        void main() {
            fragColor = vec4(0.0, 0.0, 1.0, 1.0);
        }`;
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!fragmentShader) return;
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
    var vertices = [
         0,  1 ,
        -1,  0 ,
         1,  0 ,
         0, -1 
    ];


    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices.flat()), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.useProgram(program);
    

    thetaLoc = gl.getUniformLocation( program, "theta" );
    // setInterval( () => {
        render(gl);
    // }, 100);
}   function render(gl) {
    setInterval( function() {
        gl.clear( gl.COLOR_BUFFER_BIT );
        
        theta += x;
        gl.uniform1f( thetaLoc, theta );
    
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    
        // window.requestAnimationFrame(render);
    },100)
}