function createShader(gl, sourceCode, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile failed with: ", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
  }
  return shader;
}

function setupGL(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
      alert("Could not find HTML canvas element - check for typos, or loading JavaScript file too early");
      return null;
  }
  const gl = canvas.getContext("webgl2");
  if (!gl) {
      alert("WebGL is not supported");
      return null;
  }
  return gl;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link failed:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
  }
  return program;
}
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
function drawSquare() {
  const gl = setupGL("square");
  if (!gl) return;

  const vertices = new Float32Array([
      -0.5, -0.5,  // Bottom left
       0.5, -0.5,  // Bottom right
       0.5,  0.5,  // Top right
      -0.5,  0.5   // Top left
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
          fragColor = vec4(0.0, 0.0, 1.0, 1.0);
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
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
function sierpinskiTriangle(vertices, depth) {
  if (depth === 0) return vertices;

  const [a, b, c] = vertices;
  const ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, a[2], a[3], a[4]];
  const ac = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, b[2], b[3], b[4]];
  const bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2, c[2], c[3], c[4]];

  return [
      ...sierpinskiTriangle([a, ab, ac], depth - 1),
      ...sierpinskiTriangle([ab, b, bc], depth - 1),
      ...sierpinskiTriangle([ac, bc, c], depth - 1),
  ];
}

function drawSierpinskiTriangle() {
  const gl = setupGL("square");
  if (!gl) return;

  const initialVertices = [
      [-1, -1, 1.0, 0.0, 0.0],
      [1, -1, 0.0, 1.0, 0.0],
      [0, 1, 0.0, 0.0, 1.0]
  ];

  const vertices = new Float32Array(sierpinskiTriangle(initialVertices, 3).flat());

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
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 5);
}
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

function drawCircle() {
  const gl = setupGL("square");
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
  gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
}
try {
  // Uncomment the shape you want to draw
  // drawSimpleTriangle();
  // drawGradientTriangle();
  drawSquare();
  // drawSierpinskiTriangle();
  // drawCircle();
} catch (e) {
  alert(`Uncaught JavaScript exception: ${e}`);
}