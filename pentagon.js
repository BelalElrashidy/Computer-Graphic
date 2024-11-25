function drawPentagon() {
    const gl = setupGL("square");
    if (!gl) return;
  
    const vertices = new Float32Array([
        0.0, 1.0,  // Bottom left
        1.0, 0.25,  // Bottom right
        0.5, -0.75,   // Top left
        -0.5, -0.75,   // Top left
        -1.0, 0.25,  // Top right
    ]);
  
    const vertexShaderSource = `#version 300 es
        in vec2 aPosition;
        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }`;
  
    const fragmentShaderSource = `#version 300 es
        precision mediump float;
        out vec4 fragColor;
        void main() {
            fragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`;
  
    // Create and compile shaders
    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;
  
    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
  
    // Create buffer and upload data
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
    // Setup attributes
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  
    gl.clearColor(0,0,0,1);
    // Draw
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
  }
  