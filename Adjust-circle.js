// Adjust-circle.js

/**
 * Draws a circle with radial gradient.
 * @param {WebGLRenderingContext} gl - The WebGL context.
 * @param {WebGLProgram} program - The shader program.
 * @param {number} cx - Center X-coordinate.
 * @param {number} cy - Center Y-coordinate.
 * @param {number} radius - Radius of the circle.
 * @param {boolean} isDay - Theme flag.
 * @param {Array} translation - Translation vector.
 * @param {string} type - Type of the circle ("Road", "Grass", "Moon", "Sun").
 */
function drawAdjustCircle(
  gl,
  program,
  cx,
  cy,
  radius,
  isDay,
  translation,
  type
) {
  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aColor = gl.getAttribLocation(program, "aColor");
  const uModelMatrix = gl.getUniformLocation(program, "uModelMatrix");

  // Create vertices for TRIANGLE_FAN
  const vertices = [];
  // Center vertex
  const [rCenter, gCenter, bCenter] = getGradientColor(type, isDay, 0);
  vertices.push(cx, cy, 0.0, rCenter, gCenter, bCenter);

  const numSegments = 100;
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * 2.0 * Math.PI;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    const t = i / numSegments;

    const [r, g, b] = getGradientColor(type, isDay, t);
    vertices.push(x, y, 0.0, r, g, b);
  }

  // Create and bind buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Set up vertex attributes
  const stride = 6 * Float32Array.BYTES_PER_ELEMENT; // 3 pos, 3 color
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.vertexAttribPointer(
    aColor,
    3,
    gl.FLOAT,
    false,
    stride,
    3 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(aColor);

  // Create and apply model matrix
  const modelMatrix = mat4.create();
  mat4.translate(modelMatrix, modelMatrix, [
    translation[0],
    translation[1],
    0.0,
  ]);
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

  // Draw the circle
  gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 6);
}

/**
 * Computes gradient colors based on object type and position.
 * @param {string} objectType - Type of the object ("Road", "Grass", "Moon", "Sun").
 * @param {boolean} isDay - Theme flag.
 * @param {number} t - Gradient factor [0,1].
 * @returns {Array} - RGB color array.
 */
function getGradientColor(objectType, isDay, t) {
  let r, g, b;

  if (objectType === "Moon") {
    if (isDay) {
      r = 1.0 - t * 0.2;
      g = 1.0 - t * 0.5;
      b = 0.0;
    } else {
      r = 0.8 - t * 0.3;
      g = 0.8 - t * 0.3;
      b = 0.8;
    }
  } else if (objectType === "Grass") {
    if (isDay) {
      r = 0.2 - t * 0.2;
      g = 0.8 - t * 0.3;
      b = 0.2 - t * 0.2;
    } else {
      r = 0.1 - t * 0.1;
      g = 0.3 - t * 0.1;
      b = 0.1 - t * 0.1;
    }
  } else if (objectType === "Road") {
    if (isDay) {
      r = 0.0;
      g = 0.0;
      b = 0.0;
    } else {
      r = 0.3 - t * 0.2;
      g = 0.3 - t * 0.2;
      b = 0.3 - t * 0.2;
    }
  } else if (objectType === "Sun") {
    if (isDay) {
      r = 1.0;
      g = 0.8 - t * 0.3;
      b = 0.0;
    } else {
      r = 0.5;
      g = 0.5;
      b = 0.0;
    }
  } else {
    // Fallback color
    r = 0.5;
    g = 0.5;
    b = 0.5;
  }

  // Clamp values between 0.0 and 1.0
  r = Math.max(0.0, Math.min(1.0, r));
  g = Math.max(0.0, Math.min(1.0, g));
  b = Math.max(0.0, Math.min(1.0, b));

  return [r, g, b];
}
