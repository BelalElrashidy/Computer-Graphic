"use strict";

function rotatingSquare() {
    gl = setupGL("square");
    if (!gl) {
        console.error("WebGL context could not be initialized.");
    }
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
    const bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    const vPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.useProgram(program);

    // Get uniform location
    thetaLoc = gl.getUniformLocation(program, "theta");
    if (thetaLoc === null) {
        console.error("Uniform 'theta' not found.");
        return;
    }

    // Initialize thetaS and x
    thetaS = 0.0;
    x = 0.01;
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        thetaS += x; // Increment the rotation angle
        gl.uniform1f(thetaLoc, thetaS); // Correctly set the theta uniform
    
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
        window.requestAnimationFrame(render);
    }
    render()
}   