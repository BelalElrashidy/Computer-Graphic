function sierpinskiTriangle(vertices, depth) {
  if (depth === 0) return vertices;

  const [a, b, c] = vertices;
  const ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, a[2], b[3], c[4]];
  const ac = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, c[2], a[3], b[4]];
  const bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2, b[2], c[3], a[4]];

  return [
    ...sierpinskiTriangle([a, ab, ac], depth - 1),
    ...sierpinskiTriangle([ab, b, bc], depth - 1),
    ...sierpinskiTriangle([ac, bc, c], depth - 1),
  ];
}
function circle(vertices, segments, radius) {
  const points = [];
  for (let i = 0; i < segments + 1; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const x = vertices[0] + radius * Math.cos(angle);
    const y = vertices[1] + radius * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
}

function triangle() {
  const canvas = document.getElementById("square");
  if (!canvas) {
    alert(
      "Could not find HTML canvas element - check for typos, or loading JavaScript file too early"
    );
    return;
  }
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("WebGL is not supported");
    return;
  }

  // const vertices = sierpinskiTriangle(
  //   [
  //     [-1, -1, 1.0, 0.0, 0.0],
  //     [1, -1, 0.0, 1.0, 0.0],
  //     [0, 1, 0.0, 0.0, 1.0],
  //   ],
  //   3
  // );
  const vertices = circle([0.0, 0.0], 100, 0.5);

  const triangleGeoBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices.flat()),
    gl.STATIC_DRAW
  );

  const vertexShaderSourceCode = `
    attribute vec2 aPosition;
    // attribute vec3 aColor;
    // varying vec3 frag_color;
    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        // frag_color = aColor;
    }`;

  const fragmentShaderSourceCode = `
    precision mediump float;
    // varying vec3 frag_color;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }`;

  function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "Shader compile failed with: ",
        gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = createShader(
    gl,
    vertexShaderSourceCode,
    gl.VERTEX_SHADER
  );
  const fragmentShader = createShader(
    gl,
    fragmentShaderSourceCode,
    gl.FRAGMENT_SHADER
  );

  if (!vertexShader || !fragmentShader) return;

  const TriangleProgram = gl.createProgram();
  gl.attachShader(TriangleProgram, vertexShader);
  gl.attachShader(TriangleProgram, fragmentShader);
  gl.linkProgram(TriangleProgram);

  if (!gl.getProgramParameter(TriangleProgram, gl.LINK_STATUS)) {
    console.error(
      "Program link failed with: ",
      gl.getProgramInfoLog(TriangleProgram)
    );
    return;
  }

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(TriangleProgram);

  const vertexPositionAttributeLocation = gl.getAttribLocation(
    TriangleProgram,
    "aPosition"
  );
  gl.enableVertexAttribArray(vertexPositionAttributeLocation);
  gl.vertexAttribPointer(
    vertexPositionAttributeLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
  );

  // const vertexColorAttributeLocation = gl.getAttribLocation(
  //   TriangleProgram,
  //   "aColor"
  // );
  // gl.enableVertexAttribArray(vertexColorAttributeLocation);
  // gl.vertexAttribPointer(
  //   vertexColorAttributeLocation,
  //   3,
  //   gl.FLOAT,
  //   false,
  //   5 * Float32Array.BYTES_PER_ELEMENT,
  //   2 * Float32Array.BYTES_PER_ELEMENT
  // );

  gl.drawArrays(gl.LINE_LOOP, 0, vertices.length);
}

try {
  triangle();
} catch (e) {
  alert(`Uncaught JavaScript exception: ${e}`);
}
