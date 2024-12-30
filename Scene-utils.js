// Draw sky with gradient
function createBuffer(gl, vertices) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return buffer;
}
function drawSky(gl, program) {
  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aColor = gl.getAttribLocation(program, "aColor");

  const vertices = new Float32Array(
    isDay
      ? [
          -1.0, 1.0, 0.0, 0.0, 0.7, 1.0, -1.0, -1.0, 0.0, 0.0, 0.2, 1.0, 1.0,
          1.0, 0.0, 0.0, 0.7, 1.0, 1.0, -1.0, 0.0, 0.0, 0.2, 1.0,
        ]
      : [
          -1.0, 1.0, 0.0, 0.0, 0.1, 0.3, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
          1.0, 0.0, 0.0, 0.1, 0.3, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0,
        ]
  );

  // console.log(vertices)
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const stride = 6 * Float32Array.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, stride, 0);
  gl.vertexAttribPointer(
    aColor,
    3,
    gl.FLOAT,
    false,
    stride,
    3 * Float32Array.BYTES_PER_ELEMENT
  );

  // console.log(program)
  gl.enableVertexAttribArray(aPosition);
  gl.enableVertexAttribArray(aColor);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 6);
}

// Draw tree with gradient
function drawTree(gl, program, x, y) {
  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aColor = gl.getAttribLocation(program, "aColor");

  // Tree trunk
  const trunkVertices = [
    x - 0.05,
    y - 0.2,
    0.5,
    0.3,
    0.1,
    x + 0.05,
    y - 0.2,
    0.5,
    0.3,
    0.1,
    x - 0.05,
    y,
    0.5,
    0.3,
    0.1,
    x + 0.05,
    y,
    0.5,
    0.3,
    0.1,
  ];

  const trunkBuffer = createBuffer(gl, trunkVertices);
  gl.bindBuffer(gl.ARRAY_BUFFER, trunkBuffer);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 20, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 20, 8);
  gl.enableVertexAttribArray(aColor);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, trunkVertices.length / 5);

  // Tree foliage
  const foliageVertices = [
    x - 0.15,
    y,
    0.2,
    1.0,
    0.2, // Bottom-left
    x + 0.15,
    y,
    0.2,
    1.0,
    0.2, // Bottom-right
    x,
    y + 0.2,
    0.0,
    0.8,
    0.0, // Top
  ];

  const foliageBuffer = createBuffer(gl, foliageVertices);
  gl.bindBuffer(gl.ARRAY_BUFFER, foliageBuffer);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 20, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 20, 8);
  gl.enableVertexAttribArray(aColor);

  gl.drawArrays(gl.TRIANGLES, 0, foliageVertices.length / 5);
}

// Draw curvy road
function drawRoad(gl, program) {
  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aColor = gl.getAttribLocation(program, "aColor");

  const roadVertices = [
    -1.0,
    -0.4,
    0.3,
    0.3,
    0.3, // Left-bottom gray
    -1.0,
    -0.5,
    0.3,
    0.3,
    0.3, // Left-top gray
    1.0,
    -0.4,
    0.3,
    0.3,
    0.3, // Right-bottom gray
    1.0,
    -0.5,
    0.3,
    0.3,
    0.3, // Right-top gray
  ];

  const buffer = createBuffer(gl, roadVertices);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 20, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 20, 8);
  gl.enableVertexAttribArray(aColor);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, roadVertices.length / 5);
}

// Draw car
function drawCar(gl, program, x) {
  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aColor = gl.getAttribLocation(program, "aColor");

  // Car body
  const carBodyVertices = [
    x - 0.1,
    -0.45,
    1.0,
    0.0,
    0.0, // Bottom-left (red)
    x + 0.1,
    -0.45,
    1.0,
    0.0,
    0.0, // Bottom-right (red)
    x - 0.1,
    -0.4,
    1.0,
    0.0,
    0.0, // Top-left (red)
    x + 0.1,
    -0.4,
    1.0,
    0.0,
    0.0, // Top-right (red)
  ];

  const carBodyBuffer = createBuffer(gl, carBodyVertices);
  gl.bindBuffer(gl.ARRAY_BUFFER, carBodyBuffer);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 20, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 20, 8);
  gl.enableVertexAttribArray(aColor);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, carBodyVertices.length / 5);

  // Car wheels
  const wheelVertices = [
    x - 0.07,
    -0.46,
    0.0,
    0.0,
    0.0, // Left wheel bottom
    x - 0.03,
    -0.46,
    0.0,
    0.0,
    0.0, // Left wheel top
    x - 0.07,
    -0.48,
    0.0,
    0.0,
    0.0, // Left wheel bottom
    x - 0.03,
    -0.48,
    0.0,
    0.0,
    0.0, // Left wheel top

    x + 0.07,
    -0.46,
    0.0,
    0.0,
    0.0, // Right wheel bottom
    x + 0.03,
    -0.46,
    0.0,
    0.0,
    0.0, // Right wheel top
    x + 0.07,
    -0.48,
    0.0,
    0.0,
    0.0, // Right wheel bottom
    x + 0.03,
    -0.48,
    0.0,
    0.0,
    0.0, // Right wheel top
  ];

  const wheelBuffer = createBuffer(gl, wheelVertices);
  gl.bindBuffer(gl.ARRAY_BUFFER, wheelBuffer);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 20, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.vertexAttribPointer(
    aColor,
    3,
    gl.FLOAT,
    false,
    20,
    2 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(aColor);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, wheelVertices.length / 5);
}

// Add movement for the car
function moveCar(direction) {
  carPosition += direction * 5;
}

// Utility function to create rectangle vertices
function createRectangle(x, y, width, height, color) {
  return [
    x,
    y,
    0.0,
    color[0],
    color[1],
    color[2],
    x + width,
    y,
    0.0,
    color[0],
    color[1],
    color[2],
    x,
    y + height,
    0.0,
    color[0],
    color[1],
    color[2],
    x + width,
    y + height,
    0.0,
    color[0],
    color[1],
    color[2],
  ];
}

// Utility function to create circle vertices
function createCircle(cx, cy, radius, color, segments = 20) {
  const vertices = [];
  // Center vertex
  vertices.push(cx, cy, 0.0, color[0], color[1], color[2]);
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    vertices.push(x, y, 0.0, color[0], color[1], color[2]);
  }
  return vertices;
}
let armAngle = 0.0;
let armDirection = 1;

// Update arm angle
function updateArms() {
  armAngle += 0.05 * armDirection;
  if (armAngle > 0.5 || armAngle < -0.5) {
    armDirection *= -1;
  }
}

// Draw person
function drawPerson(gl, program, position) {
  // Body
  const skinColor = [1.0, 0.8, 0.6];
  const bodyColor = [0.0, 0.0, 1.0]; // Blue body
  const limbColor = [0.8, 0.5, 0.2]; // Brown limbs

  // Create vertex data for each part
  const headVertices = createCircle(0.0, 0.0, 0.05, skinColor);
  const bodyVertices = createRectangle(-0.05, -0.1, 0.1, 0.2, bodyColor);
  const leftArmVertices = createRectangle(-0.07, -0.005, 0.1, 0.02, limbColor);
  const rightArmVertices = createRectangle(-0.03, -0.005, 0.1, 0.02, limbColor);
  const leftLegVertices = createRectangle(-0.03, -0.005, 0.02, 0.1, limbColor);
  const rightLegVertices = createRectangle(0.01, -0.005, 0.02, 0.1, limbColor);

  // Create buffers
  const headBuffer = createBuffer(gl, headVertices);
  const bodyBuffer = createBuffer(gl, bodyVertices);
  const leftArmBuffer = createBuffer(gl, leftArmVertices);
  const rightArmBuffer = createBuffer(gl, rightArmVertices);
  const leftLegBuffer = createBuffer(gl, leftLegVertices);
  const rightLegBuffer = createBuffer(gl, rightLegVertices);
  const baseModel = mat4.create();
  mat4.translate(baseModel, baseModel, [position[0], position[1], 0.0]);
  updateArms();
  // Draw Head
  {
    const headModel = mat4.clone(baseModel);
    mat4.translate(headModel, headModel, [0.0, 0.15, 0.0]); // Position head above body
    drawHead(gl, program, headBuffer, headModel, headVertices);
  }

  // Draw Body

  // Draw Left Arm
  {
    const leftArmModel = mat4.clone(baseModel);
    mat4.translate(leftArmModel, leftArmModel, [-0.075, 0.05, 0.0]); // Position to the left of body
    mat4.rotateZ(leftArmModel, leftArmModel, armAngle); // Rotate around Z-axis
    drawRectangle(gl, program, leftArmBuffer, leftArmModel);
  }

  // Draw Right Arm
  {
    const rightArmModel = mat4.clone(baseModel);
    mat4.translate(rightArmModel, rightArmModel, [0.075, 0.05, 0.0]); // Position to the right of body
    mat4.rotateZ(rightArmModel, rightArmModel, -armAngle); // Rotate opposite direction
    drawRectangle(gl, program, rightArmBuffer, rightArmModel);
  }

  // Draw Left Leg
  {
    const leftLegModel = mat4.clone(baseModel);
    mat4.translate(leftLegModel, leftLegModel, [-0.02, -0.15, 0.0]); // Position below body
    drawRectangle(gl, program, leftLegBuffer, leftLegModel);
  }

  // Draw Right Leg
  {
    const rightLegModel = mat4.clone(baseModel);
    mat4.translate(rightLegModel, rightLegModel, [0.02, -0.15, 0.0]); // Position below body
    drawRectangle(gl, program, rightLegBuffer, rightLegModel);
  }
  {
    const bodyModel = mat4.clone(baseModel);
    mat4.translate(bodyModel, bodyModel, [0.0, 0.0, 0.0]); // Body at base position
    drawRectangle(gl, program, bodyBuffer, bodyModel);
  }
}
// Function to draw a circle (head)

// Function to draw rectangle parts (body, arms, legs)
// Function to draw a circle (head)
function drawHead(gl, program, buffer, modelMatrix, headVertices) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aColor = gl.getAttribLocation(program, "aColor");

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

  // Set model matrix
  const uModelMatrix = gl.getUniformLocation(program, "uModelMatrix");
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

  // Draw
  gl.drawArrays(gl.TRIANGLE_FAN, 0, headVertices.length / 6);
}

// Function to draw rectangle parts (body, arms, legs)
function drawRectangle(gl, program, buffer, modelMatrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aColor = gl.getAttribLocation(program, "aColor");

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

  // Set model matrix
  const uModelMatrix = gl.getUniformLocation(program, "uModelMatrix");
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

  // Draw
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Each rectangle has 4 vertices
}

// Draw animals
function drawAnimals(gl, program) {
  // Add implementation for animals
}

// Draw flowers
function drawFlowers(gl, program, x, y) {
  // Add implementation for flowers at the specified position
}
function setLightDirection(gl, program3D, newLightDir) {
  // Normalize the light direction to ensure it's a unit vector
  const normalizedLightDir = vec3.create();
  vec3.normalize(normalizedLightDir, newLightDir);

  // Activate the 3D shader program
  gl.useProgram(program3D);

  // Update the uniform with the normalized light direction
  gl.uniform3fv(
    gl.getUniformLocation(program3D, "uLightDirection"),
    normalizedLightDir
  );
}
// Scene-utils.js

// Import or define mat3 if using glMatrix
// Assuming you're using glMatrix library for matrix operations
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js"></script>

/**
 * Function to create the car's geometry and buffers
 */
function createCar(gl, program) {
  // Car Body (Rectangle)
  const carBodyVertices = new Float32Array([
    // Positions      // Colors
    // Triangle 1
    -0.5,
    0,
    0.0,
    1.0,
    0.0,
    0.0, // Bottom Left (Red)
    0.5,
    0,
    0.0,
    1.0,
    0.0,
    0.0, // Bottom Right (Red)
    0.5,
    0.3,
    0.0,
    1.0,
    0.0,
    0.0, // Top Right (Red)

    // Triangle 2
    -0.5,
    0,
    0.0,
    1.0,
    0.0,
    0.0, // Bottom Left (Red)
    0.5,
    0.3,
    0.0,
    1.0,
    0.0,
    0.0, // Top Right (Red)
    -0.5,
    0.3,
    0.0,
    1.0,
    0.0,
    0.0, // Top Left (Red)
  ]);

  // Function to create a circle (wheel)
  function createCircleVertices(centerX, centerY, radius, color, segments) {
    const vertices = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      vertices.push(x, y, 0.0, color[0], color[1], color[2]);
    }

    // Create triangle fan
    const circleVertices = [];
    // Center of the circle
    circleVertices.push(centerX, centerY, 0.0, color[0], color[1], color[2]);

    for (let i = 0; i <= segments; i++) {
      circleVertices.push(
        vertices[i * 6],
        vertices[i * 6 + 1],
        vertices[i * 6 + 2],
        vertices[i * 6 + 3],
        vertices[i * 6 + 4],
        vertices[i * 6 + 5]
      );
    }

    return new Float32Array(circleVertices);
  }

  // Wheels
  const wheel1 = createCircleVertices(-0.5, -0.1, 0.1, [0.0, 0.0, 0.0], 20); // Rear Wheel (Black)
  const wheel2 = createCircleVertices(0.3, -0.1, 0.1, [0.0, 0.0, 0.0], 20); // Front Wheel (Black)

  // Combine all vertices
  const carVertices = new Float32Array([
    // Car Body
    ...carBodyVertices,

    // Wheel 1
    ...wheel1,

    // Wheel 2
    ...wheel2,
  ]);

  // Create VBO
  const carVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, carVBO);
  console.log(carVertices);
  gl.bufferData(gl.ARRAY_BUFFER, carVertices, gl.STATIC_DRAW);

  // Get attribute locations
  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aColor = gl.getAttribLocation(program, "aColor");

  // Enable and set attribute pointers
  gl.vertexAttribPointer(
    aPosition,
    3,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(aPosition);

  gl.vertexAttribPointer(
    aColor,
    3,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(aColor);
  console.log(carVertices.length / 6);
  return {
    buffer: carVBO,
    vertexCount: carVertices.length / 6,
    transform: mat4.create(), // 2D transformation matrix
  };
}

/**
 * Function to initialize the car and its controls
 */
function initializeCar(gl, program) {
  const car = createCar(gl, program);

  // Initial position (centered)
  mat4.identity(car.transform);
  mat4.translate(car.transform, car.transform, [0, 0, 0.0]); // No initial translation

  // Get uniform location for transformation
  const uModelMatrix = gl.getUniformLocation(program, "uModelMatrix");

  // Function to draw the car
  function drawCar() {
    gl.uniformMatrix4fv(uModelMatrix, false, car.transform);
    gl.bindBuffer(gl.ARRAY_BUFFER, car.buffer);
    gl.drawArrays(gl.TRIANGLES, 0, car.vertexCount);
  }

  // Setup Controls
  setupCarControls(car, gl, program);

  return {
    draw: drawCar,
    transform: car.transform,
  };
}

/**
 * Function to handle car movement controls
 */
function setupCarControls(carObject, gl, program) {
  // Movement speed (in world coordinates)
  const speed = 0.05;
  const moveButton = document.createElement("button");
  moveButton.id = "move";
  moveButton.innerText = "Move Car";
  document.body.appendChild(moveButton);
  moveButton.addEventListener("click", () => {
    moveCar(carObject, speed, gl, program);
  });

  const backButton = document.createElement("button");
  backButton.id = "move-back";
  backButton.innerText = "Move Backward";
  document.body.appendChild(backButton);

  backButton.addEventListener("click", () => {
    moveCar(carObject, -speed, gl, program);
  });
  // Optional: Keyboard controls
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      moveCar(carObject, -speed, gl, program);
    } else if (event.key === "ArrowRight") {
      moveCar(carObject, speed, gl, program);
    }
  });
}

/**
 * Function to move the car horizontally
 */
function moveCar(carObject, deltaX, gl, program) {
  // Update the transformation matrix (translate along X-axis)
  mat4.translate(carObject.transform, carObject.transform, [deltaX, 0, 0.0]);

  // Optional: Boundary checks
  // Assuming your world coordinates range from -400 to 400 on the X-axis
  const currentTranslation = carObject.transform[12]; // mat3 is column-major
  if (currentTranslation + 0.05 > 0.4) {
    // 50 is half of car width
    carObject.transform[12] = 0.4 - 0.05;
  }
  if (currentTranslation - 0.05 < -0.4) {
    carObject.transform[12] = -0.4 + 0.05;
  }

  // Trigger a redraw by re-rendering the scene
  // Assuming you have a function or a flag to handle re-rendering
  // For example, if you have a render loop, it will automatically render the updated car
}
