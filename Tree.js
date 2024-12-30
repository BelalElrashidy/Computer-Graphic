function createTreeGeometry() {
  const trunkSegments = 20; // Number of segments around the trunk
  const sapwoodRadius = 0.1; // Radius of the sapwood (outer cylinder)
  const trunkHeight = 0.5; // Height of the trunk

  // Color
  const sapwoodColor = [0.55, 0.27, 0.07]; // Brownish color for sapwood

  const vertices = [];

  // ----- BUILD SAPWOOD (Outer Cylinder) -----
  for (let i = 0; i <= trunkSegments; i++) {
    let theta = (i / trunkSegments) * 2.0 * Math.PI;
    let x = sapwoodRadius * Math.cos(theta);
    let z = sapwoodRadius * Math.sin(theta);

    // Normal for the sapwood side
    let nx = Math.cos(theta);
    let ny = 0.0;
    let nz = Math.sin(theta);

    // Lower vertex
    vertices.push(
      x,
      0.0,
      z, // Position
      nx,
      ny,
      nz, // Normal
      sapwoodColor[0],
      sapwoodColor[1],
      sapwoodColor[2] // Color
    );

    // Upper vertex
    vertices.push(
      x,
      trunkHeight,
      z, // Position
      nx,
      ny,
      nz, // Normal
      sapwoodColor[0],
      sapwoodColor[1],
      sapwoodColor[2] // Color
    );
  }

  // ----- BUILD LEAVES (Sphere) -----
  const sphereSegments = 20;
  const sphereVertices = createLeafSphere(
    trunkHeight,
    0.3, // leafRadius
    sphereSegments
  );
  vertices.push(...sphereVertices);

  return new Float32Array(vertices);
}

function createLeafSphere(centerY, radius, segments) {
  const sphereVertices = [];
  const latSegments = segments;
  const lonSegments = segments;

  // Define gradient colors
  const baseColor = vec3.fromValues(0.0, 0.2, 0.0); // Dark Green at the center axis
  const topColor = vec3.fromValues(0.0, 0.8, 0.0); // Light Green at the equator

  for (let lat = 0; lat <= latSegments; lat++) {
    let phi = (lat / latSegments) * Math.PI; // 0 to PI
    let sinPhi = Math.sin(phi);
    let cosPhi = Math.cos(phi);

    for (let lon = 0; lon <= lonSegments; lon++) {
      let theta = (lon / lonSegments) * 2.0 * Math.PI; // 0 to 2PI
      let sinTheta = Math.sin(theta);
      let cosTheta = Math.cos(theta);

      let x = radius * sinPhi * cosTheta;
      let y = radius * cosPhi + centerY; // Shift vertically
      let z = radius * sinPhi * sinTheta;

      // Normal for sphere
      let nx = sinPhi * cosTheta;
      let ny = cosPhi;
      let nz = sinPhi * sinTheta;

      // Calculate radial distance from Y-axis in XZ-plane
      let radialDistance = Math.sqrt(x * x + z * z);
      let gradientFactor = radialDistance / radius; // Normalize to [0,1]
      gradientFactor = Math.max(0.0, Math.min(1.0, gradientFactor)); // Clamp between 0 and 1

      // Interpolate between baseColor and topColor based on radial distance
      let color = vec3.create();
      vec3.lerp(color, baseColor, topColor, gradientFactor);

      sphereVertices.push(
        x,
        y,
        z, // Position
        nx,
        ny,
        nz, // Normal
        color[0],
        color[1],
        color[2] // Color
      );
    }
  }

  // Create triangles for the sphere
  const verticesTriangles = [];

  for (let lat = 0; lat < latSegments; lat++) {
    for (let lon = 0; lon < lonSegments; lon++) {
      let first = lat * (lonSegments + 1) + lon;
      let second = first + lonSegments + 1;

      // First triangle
      verticesTriangles.push(
        ...sphereVertices.slice(first * 9, first * 9 + 9),
        ...sphereVertices.slice(second * 9, second * 9 + 9),
        ...sphereVertices.slice((first + 1) * 9, (first + 1) * 9 + 9)
      );

      // Second triangle
      verticesTriangles.push(
        ...sphereVertices.slice(second * 9, second * 9 + 9),
        ...sphereVertices.slice((second + 1) * 9, (second + 1) * 9 + 9),
        ...sphereVertices.slice((first + 1) * 9, (first + 1) * 9 + 9)
      );
    }
  }

  return new Float32Array(verticesTriangles);
}
/**
 * Creates the geometry for a branch as a cylinder.
 * @param {number} radius - The radius of the branch.
 * @param {number} length - The length of the branch.
 * @param {number} segments - Number of segments around the circumference.
 * @param {vec3} color - RGB color of the branch.
 * @returns {Float32Array} - The vertex data for the branch.
 */
function createBranchGeometry(radius, length, segments, color) {
  const vertices = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2.0 * Math.PI;
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);
    const nx = Math.cos(theta);
    const ny = 0.0;
    const nz = Math.sin(theta);

    // Bottom vertex
    vertices.push(
      x, // Position X
      0.0, // Position Y (base)
      z, // Position Z
      nx, // Normal X
      ny, // Normal Y
      nz, // Normal Z
      color[0], // Color R
      color[1], // Color G
      color[2] // Color B
    );

    // Top vertex
    vertices.push(
      x, // Position X
      length, // Position Y (tip)
      z, // Position Z
      nx, // Normal X
      ny, // Normal Y
      nz, // Normal Z
      color[0], // Color R
      color[1], // Color G
      color[2] // Color B
    );
  }

  return new Float32Array(vertices);
}

function createTreeBuffers(gl, program) {
  const vertices = createTreeGeometry();

  const treeVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, treeVBO);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aNormal = gl.getAttribLocation(program, "aNormal");
  const aColor = gl.getAttribLocation(program, "aColor");

  const stride = 9 * Float32Array.BYTES_PER_ELEMENT; // 3 pos, 3 normal, 3 color

  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.vertexAttribPointer(
    aNormal,
    3,
    gl.FLOAT,
    false,
    stride,
    3 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(aNormal);

  gl.vertexAttribPointer(
    aColor,
    3,
    gl.FLOAT,
    false,
    stride,
    6 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(aColor);

  // Number of vertices in the array
  const numVertices = vertices.length / 9; // each vertex has 9 floats
  return { buffer: treeVBO, numVertices };
}
// In your setup function or initialization code
function setupBranchBuffer(gl, program) {
  const branchVertices = createBranchGeometry(
    0.02,
    0.3,
    10,
    [0.55, 0.27, 0.07]
  );
  const branchBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, branchBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, branchVertices, gl.STATIC_DRAW);
  program.branchBuffer = branchBuffer;
}
// Call this function after compiling and linking your 3D shader program

function setup3D(gl, program) {
  // Perspective projection
  const projMatrix = mat4.create();
  // console.log(program);
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  mat4.perspective(projMatrix, Math.PI / 4, aspect, 0.1, 100.0);
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uProjectionMatrix"),
    false,
    projMatrix
  );

  // View matrix
  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, [0, 1, 3], [0, 0, 0], [0, 1, 0]);
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uViewMatrix"),
    false,
    viewMatrix
  );

  // Light direction
}
let treeAngle = 0.0; // Rotation angle in radians
function drawBranch(gl, program, parentModelMatrix, branch, treeInfo) {
  // Create a new model matrix for the branch
  const branchModel = mat4.clone(parentModelMatrix);

  // Apply branch transformations
  if (branch.position) {
    mat4.translate(branchModel, branchModel, branch.position);
  }
  if (branch.rotation) {
    mat4.rotateX(branchModel, branchModel, branch.rotation[0]);
    mat4.rotateY(branchModel, branchModel, branch.rotation[1]);
    mat4.rotateZ(branchModel, branchModel, branch.rotation[2]);
  }
  if (branch.scale) {
    mat4.scale(branchModel, branchModel, branch.scale);
  }

  // Upload branch model matrix
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uModelMatrix"),
    false,
    branchModel
  );

  // Bind branch buffer
  // gl.bindBuffer(gl.ARRAY_BUFFER, program.branchBuffer);

  // Set attribute pointers
  // const aPosition = gl.getAttribLocation(program, "aPosition");
  // const aNormal = gl.getAttribLocation(program, "aNormal");
  // const aColor = gl.getAttribLocation(program, "aColor");

  const stride = 9 * Float32Array.BYTES_PER_ELEMENT; // 3 pos, 3 normal, 3 color
  gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(program.aPosition);

  gl.vertexAttribPointer(
    program.aNormal,
    3,
    gl.FLOAT,
    false,
    stride,
    3 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(program.aNormal);

  gl.vertexAttribPointer(
    program.aColor,
    3,
    gl.FLOAT,
    false,
    stride,
    6 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(program.aColor);

  // Draw the branch cylinder
  const branchSegments = 10;
  const branchVertexCount = (branchSegments + 1) * 2;
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, branchVertexCount);
}

function draw3DTree(
  gl,
  program,
  uModelMatrix,
  treeInfo,
  transform,
  branchesConfig
) {
  // 1) Create model matrix
  const modelMatrix = mat4.create();

  // Apply translation
  if (transform.position) {
    mat4.translate(modelMatrix, modelMatrix, transform.position);
  }

  // Apply rotation
  if (transform.rotationY) {
    mat4.rotateY(modelMatrix, modelMatrix, transform.rotationY);
  }

  // Apply scale
  if (transform.scale) {
    mat4.scale(modelMatrix, modelMatrix, transform.scale);
  }

  // Set light direction
  const lightDir = vec3.fromValues(
    transform.lightDir[0],
    transform.lightDir[1],
    transform.lightDir[2]
  );
  vec3.normalize(lightDir, lightDir);
  gl.uniform3fv(gl.getUniformLocation(program, "uLightDirection"), lightDir);

  // 2) Upload model matrix
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

  // 3) Bind the tree’s VBO
  gl.bindBuffer(gl.ARRAY_BUFFER, treeInfo.buffer);

  // 4) Set attribute pointers
  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aNormal = gl.getAttribLocation(program, "aNormal");
  const aColor = gl.getAttribLocation(program, "aColor");

  const stride = 9 * Float32Array.BYTES_PER_ELEMENT; // 3 pos, 3 normal, 3 color
  gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(program.aPosition);

  gl.vertexAttribPointer(
    program.aNormal,
    3,
    gl.FLOAT,
    false,
    stride,
    3 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(program.aNormal);

  gl.vertexAttribPointer(
    program.aColor,
    3,
    gl.FLOAT,
    false,
    stride,
    6 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(program.aColor);

  // 5) Draw the sapwood cylinder
  const sapwoodVertexCount = (20 + 1) * 2; // trunkSegments=20, two vertices per segment
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, sapwoodVertexCount);

  // 6) Draw the leaves
  const leavesVertexCount = treeInfo.numVertices - sapwoodVertexCount;
  gl.drawArrays(gl.TRIANGLES, sapwoodVertexCount, leavesVertexCount);
  setupBranchBuffer(gl, program);

  // 7) Draw branches
  branchesConfig.forEach((branch) => {
    drawBranch(gl, program, modelMatrix, branch, treeInfo);
  });
}
