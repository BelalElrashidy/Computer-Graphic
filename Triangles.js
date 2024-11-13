function drawSimpleTriangle() {
    const gl = setupGL("square");
    if (!gl) return;
  
    const vertices = new Float32Array([
        -0.5, -0.5,  // Vertex 1
         0.5, -0.5,  // Vertex 2
         0.0,  0.5   // Vertex 3
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
  
    // Draw
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function drawGradientTriangle() {
    const gl = setupGL("square");
    if (!gl) return;
  
    const vertices = new Float32Array([
        -0.5, -0.5, 1.0, 0.0, 0.0,  // Vertex 1 (position + color)
         0.5, -0.5, 0.0, 1.0, 0.0,  // Vertex 2
         0.0,  0.5, 0.0, 0.0, 1.0   // Vertex 3
    ]);
  
    const vertexShaderSource = `#version 300 es
        in vec2 aPosition;
        in vec3 aColor;
        out vec3 vColor;
        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
            vColor = aColor;
        }`;
  
    const fragmentShaderSource = `#version 300 es
        precision mediump float;
        in vec3 vColor;
        out vec4 fragColor;
        void main() {
            fragColor = vec4(vColor, 1.0);
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
    const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, stride, 0);
  
    const aColor = gl.getAttribLocation(program, 'aColor');
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
  
    // Draw
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  