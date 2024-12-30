let isDay = true;
// isDay = !isDay;
let carPosition = 0.0;
// let gl;
let translation = [1.2, 0.8];
let yChange = -0.0004;

// Vertex shader program

const vertexShaderSource = `#version 300 es
precision mediump float;

// Attributes
in vec3 aPosition;
in vec3 aNormal; // Normal vector for lighting
in vec3 aColor;

// Uniforms
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightDirection; // Directional light direction
uniform float uLightingEnabled; // Flag to enable/disable lighting

// Varyings
out vec3 vColor;

void main() {
    // Transform the vertex position to world space
    vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    // Initialize color with vertex color
    vec3 finalColor = aColor;

    // Apply lighting if enabled
    if (uLightingEnabled > 0.5) {
        // Transform the normal to world space
        vec3 worldNormal = normalize(mat3(uModelMatrix) * aNormal);

        // Calculate diffuse lighting (Lambertian)
        float diffuse = max(dot(worldNormal, normalize(-uLightDirection)), 0.0);

        // Combine vertex color with lighting (ambient + diffuse)
        finalColor = aColor * (0.4 + 0.6 * diffuse); // Adjust coefficients as needed
    }

    // Pass the color to the fragment shader
    vColor = finalColor;
}




`;
const vertex2DShaderSource = `#version 300 es
precision mediump float;

// Attributes
in vec3 aPosition;
in vec3 aColor;

// Uniforms
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

// Varyings
out vec3 vColor;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    vColor = aColor;
}
`;
// Fragment shader program

const fragmentShaderSource = `#version 300 es
precision mediump float;

// Varyings
in vec3 vColor;

// Output
out vec4 fragColor;

void main() {
    fragColor = vec4(vColor, 1.0);
}

`;

// Initialize WebGL context using utility

// Initialize shaders using utility

// Create buffer for shapes

// Render the entire scene
function render(
  gl,
  program2D,
  program3D,
  uModelMatrix,
  uProjectionMatrix,
  uViewMatrix,
  uModelMatrix3D,
  uProjectionMatrix3D,
  uViewMatrix3D,
  treeInfo,
  uLightingEnabled,
  car
) {
  //   gl.clearColor(0.2, 0.2, 0.2, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Use your shader
  gl.useProgram(program2D);

  // --- Draw sky + circles (2D) ---
  {
    gl.disable(gl.DEPTH_TEST);
    // gl.uniform1f(uLightingEnabled, 0.0);
    const identity = mat4.create(); // Identity matrices for 2D
    gl.uniformMatrix4fv(uProjectionMatrix, false, identity);
    gl.uniformMatrix4fv(uViewMatrix, false, identity);
    gl.uniformMatrix4fv(uModelMatrix, false, identity);
    drawSky(gl, program2D);

    drawAdjustCircle(gl, program2D, 0.5, -2.0, 2.1, isDay, [0, 0], "Road");
    drawAdjustCircle(gl, program2D, 0.5, -2.0, 1.9, isDay, [0, 0], "Grass");
    drawPerson(gl, program2D, [0.8, -0.8]);
    car.draw();

    // If you already have a 2D tree function (drawTree), you can call it here:
    // drawTree(gl, program, -0.2, -0.3);
    // But that seems to be a separate 2D function?
  }

  // --- Draw the “moon” circle that moves ---
  {
    drawAdjustCircle(gl, program2D, 0, 0, 0.5, isDay, translation, "Moon");
    translation[0] -= 0.001;
    translation[1] -= yChange;
    if (translation[0] < -2) {
      isDay = !isDay;
      translation = [1.2, 0.8];
      yChange = -yChange;
    }
    if (translation[1] > 1.2) {
      yChange = -yChange;
    }
  }

  // Update translations if needed
  {
    gl.useProgram(program3D);
    gl.enable(gl.DEPTH_TEST);
    gl.uniform1f(uLightingEnabled, 1.0);
    setup3D(gl, program3D);
    // gl.bindBuffer(gl.ARRAY_BUFFER, treeInfo.buffer);

    // gl.vertexAttribPointer(
    //   program3D.aPosition,
    //   3,
    //   gl.FLOAT,
    //   false,
    //   9 * Float32Array.BYTES_PER_ELEMENT,
    //   0
    // );
    // gl.enableVertexAttribArray(program.aPosition);

    // gl.vertexAttribPointer(
    //   program3D.aNormal,
    //   3,
    //   gl.FLOAT,
    //   false,
    //   9 * Float32Array.BYTES_PER_ELEMENT,
    //   3 * Float32Array.BYTES_PER_ELEMENT
    // );
    // gl.enableVertexAttribArray(program.aNormal);

    // gl.vertexAttribPointer(
    //   program3D.aColor,
    //   3,
    //   gl.FLOAT,
    //   false,
    //   9 * Float32Array.BYTES_PER_ELEMENT,
    //   6 * Float32Array.BYTES_PER_ELEMENT
    // );
    // gl.enableVertexAttribArray(program.aColor);

    // --- Draw 3D Rotating Tree ---
    const branchesConfig = [
      {
        // Branch 1
        position: [0.0, 0.3, 0.0], // Relative to trunk base
        rotation: [Math.PI / 4, 0, 0], // Rotation around X, Y, Z axes
        scale: [1, 1, 1], // Uniform scaling
      },
      {
        // Branch 2
        position: [0.05, 0.35, 0.05],
        rotation: [Math.PI / 6, Math.PI / 4, 0],
        scale: [0.8, 1, 0.8],
      },
      {
        // Branch 3
        position: [-0.05, 0.4, -0.05],
        rotation: [Math.PI / 3, -Math.PI / 6, 0],
        scale: [0.7, 1, 0.7],
      },
      // Add more branches as desired
    ];

    const trees = [
      {
        position: [-1, -1.5, 0],
        rotationY: treeAngle,
        lightDir: [-1, 0, 0],
        scale: [1, 1, 1],
      },
      {
        position: [1, -1.0, -1],
        rotationY: treeAngle * 0.2,
        lightDir: [-1, 0, 0],
        scale: [0.8, 0.8, 0.8],
      },
      {
        position: [0, -2, -2],
        rotationY: treeAngle * 1.2,
        lightDir: [-1, 0, 0],
        scale: [1.2, 1.2, 1.2],
      },
      // Add more trees as desired
    ];

    // Draw all trees
    trees.forEach((tree) => {
      // Create model matrix
      draw3DTree(gl, program3D, uModelMatrix3D, treeInfo, tree, branchesConfig);
    });
    // Leaves

    // Update rotation angle
    treeAngle += 0.001;
  }
  // schedule next frame
  requestAnimationFrame(() =>
    render(
      gl,
      program2D,
      program3D,
      uModelMatrix,
      uProjectionMatrix,
      uViewMatrix,
      uModelMatrix3D,
      uProjectionMatrix3D,
      uViewMatrix3D,
      treeInfo,
      uLightingEnabled,
      car
    )
  );
}

function Scene() {
  gl = setupGL("square");
  if (!gl) console.log(gl);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE); // test if culling is the cause

  // Compile 2D shaders
  const vertexShader2D = createShader(
    gl,
    vertex2DShaderSource,
    gl.VERTEX_SHADER
  );
  const fragmentShader2D = createShader(
    gl,
    fragmentShaderSource,
    gl.FRAGMENT_SHADER
  );
  const program2D = createProgram(gl, vertexShader2D, fragmentShader2D);

  // Compile 3D shaders
  const vertexShader3D = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader3D = createShader(
    gl,
    fragmentShaderSource,
    gl.FRAGMENT_SHADER
  );
  const program3D = createProgram(gl, vertexShader3D, fragmentShader3D);

  const treeInfo = createTreeBuffers(gl, program3D);

  // Create the model matrix
  gl.useProgram(program2D);
  const uModelMatrix2D = gl.getUniformLocation(program2D, "uModelMatrix");
  const uProjectionMatrix2D = gl.getUniformLocation(
    program2D,
    "uProjectionMatrix"
  );
  const uViewMatrix2D = gl.getUniformLocation(program2D, "uViewMatrix");
  const aPosition2D = gl.getAttribLocation(program2D, "aPosition");
  const aColor2D = gl.getAttribLocation(program2D, "aColor");

  // Retrieve uniforms and attributes for 3D program
  gl.useProgram(program3D);
  setup3D(gl, program3D);
  const uModelMatrix3D = gl.getUniformLocation(program3D, "uModelMatrix");
  const uProjectionMatrix3D = gl.getUniformLocation(
    program3D,
    "uProjectionMatrix"
  );
  const uViewMatrix3D = gl.getUniformLocation(program3D, "uViewMatrix");
  const uLightingEnabled = gl.getUniformLocation(program3D, "uLightingEnabled");
  const uLightDirection3D = gl.getUniformLocation(program3D, "uLightDirection");
  const aPosition3D = gl.getAttribLocation(program3D, "aPosition");
  const aNormal3D = gl.getAttribLocation(program3D, "aNormal");
  const aColor3D = gl.getAttribLocation(program3D, "aColor");

  // Store attribute locations for reuse
  program3D.aPosition = aPosition3D;
  program3D.aNormal = aNormal3D;
  program3D.aColor = aColor3D;

  const car = initializeCar(gl, program2D);
  // Start the render loop once everything is set up
  render(
    gl,
    program2D,
    program3D,
    uModelMatrix2D,
    uProjectionMatrix2D,
    uViewMatrix2D,
    uModelMatrix3D,
    uProjectionMatrix3D,
    uViewMatrix3D,
    treeInfo,
    uLightingEnabled,
    car
  );
  // Create buttons, attach listeners...

  const themeButton = document.createElement("button");
  themeButton.id = "theme";
  themeButton.innerText = "Switch theme";
  document.body.appendChild(themeButton);
  themeButton.addEventListener("click", () => {
    isDay = !isDay;
    translation = [1.2, 0.8];
    yChange = -0.0004;
    // console.log(translation,yChange)
  });
}

// HTML Setup

// Scene()
