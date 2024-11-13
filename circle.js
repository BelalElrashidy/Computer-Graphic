function circle(center, segments, radius) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        const x = center[0] + radius * Math.cos(angle);
        const y = center[1] + radius * Math.sin(angle);
        points.push(x, y);
    }
    return points;
  }
  
  function drawCircle(canvasId,fill) {
    const gl = setupGL(canvasId);
    if (!gl) return;
  
    const vertices = new Float32Array(circle([0.0, 0.0], 100, 0.5));
  
    const vertexShaderSource = `#version 300 es
        in vec2 aPosition;
        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }`;
  
    const fragmentShaderSource = `#version 300 es
        precision mediump float;
        out vec4 fragColor;
        void main() {
            fragColor = vec4(1.0,0.0,  0.0, 1.0);
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
    if(fill){
        gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
    }else{
        gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 2);
    }
  }