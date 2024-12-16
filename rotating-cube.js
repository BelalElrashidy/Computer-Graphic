function rotatingCube() {
    gl = setupGL("square");
    if (!gl) return;

    // Vertex Shader
    const vertexShaderSource = `#version 300 es
        in vec4 aPosition;
        in vec4 aColor;         // <--- new attribute for per-vertex color

        out vec4 vColor;        // Pass color to the fragment shader

        uniform vec3 theta;

        void main() {
            // Rotation matrices for X, Y, Z
            mat4 rx = mat4(
                1, 0, 0, 0,
                0, cos(theta.x), -sin(theta.x), 0,
                0, sin(theta.x),  cos(theta.x), 0,
                0, 0, 0, 1
            );

            mat4 ry = mat4(
                cos(theta.y), 0, sin(theta.y), 0,
                0, 1, 0, 0,
               -sin(theta.y), 0, cos(theta.y), 0,
                0, 0, 0, 1
            );

            mat4 rz = mat4(
                cos(theta.z), -sin(theta.z), 0, 0,
                sin(theta.z),  cos(theta.z), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );

            gl_Position = rz * ry * rx * aPosition;
            vColor = aColor;   // forward the color
        }
    `;

    // Fragment Shader
    const fragmentShaderSource = `#version 300 es
        precision mediump float;
        in vec4 vColor;         // Interpolated color from vertex shader
        out vec4 fragColor;

        void main() {
            fragColor = vColor; // Use the per-face (per-vertex) color
        }
    `;

    // Compile shaders
    const vertexShader   = createShader(gl, vertexShaderSource,   gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program        = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Define a cube with 6 faces × 4 vertices each = 24 vertices total.
    // Each face gets a unique color. We'll store position and color in separate arrays.
    // Positions: (x, y, z, 1)
    const positions = new Float32Array([
        // ----- Front face (red) -----
        -0.5, -0.5,  0.5, 1.0,
         0.5, -0.5,  0.5, 1.0,
         0.5,  0.5,  0.5, 1.0,
        -0.5,  0.5,  0.5, 1.0,

        // ----- Back face (green) -----
        -0.5, -0.5, -0.5, 1.0,
         0.5, -0.5, -0.5, 1.0,
         0.5,  0.5, -0.5, 1.0,
        -0.5,  0.5, -0.5, 1.0,

        // ----- Left face (blue) -----
        -0.5, -0.5, -0.5, 1.0,
        -0.5, -0.5,  0.5, 1.0,
        -0.5,  0.5,  0.5, 1.0,
        -0.5,  0.5, -0.5, 1.0,

        // ----- Right face (yellow) -----
         0.5, -0.5, -0.5, 1.0,
         0.5, -0.5,  0.5, 1.0,
         0.5,  0.5,  0.5, 1.0,
         0.5,  0.5, -0.5, 1.0,

        // ----- Top face (magenta) -----
        -0.5,  0.5,  0.5, 1.0,
         0.5,  0.5,  0.5, 1.0,
         0.5,  0.5, -0.5, 1.0,
        -0.5,  0.5, -0.5, 1.0,

        // ----- Bottom face (cyan) -----
        -0.5, -0.5,  0.5, 1.0,
         0.5, -0.5,  0.5, 1.0,
         0.5, -0.5, -0.5, 1.0,
        -0.5, -0.5, -0.5, 1.0,
    ]);

    // Corresponding color array: same vertex count (24),
    // each face has 4 vertices with the same color to keep it flat.
    const colors = new Float32Array([
        // Front face: red
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        // Back face: green
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,

        // Left face: blue
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        // Right face: yellow
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,

        // Top face: magenta
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,

        // Bottom face: cyan
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
    ]);

    // Index buffer: each face is 2 triangles, 3 indices each, referencing our 24 vertices
    // The first face’s vertices are [0..3], next [4..7], etc.
    const indices = new Uint16Array([
        // Front face
         0,  1,  2,   0,  2,  3,
        // Back face
         4,  5,  6,   4,  6,  7,
        // Left face
         8,  9, 10,   8, 10, 11,
        // Right face
        12, 13, 14,  12, 14, 15,
        // Top face
        16, 17, 18,  16, 18, 19,
        // Bottom face
        20, 21, 22,  20, 22, 23
    ]);

    // Set up VAO
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Position buffer
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Color buffer
    const cbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbo);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const aColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    // Index buffer
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Get uniform location for theta
    thetaLoc = gl.getUniformLocation(program, "theta");

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // Update rotation
    theta[axis] += x;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
}

function rotateX() { axis = 0; }
function rotateY() { axis = 1; }
function rotateZ() { axis = 2; }
function move(){ x*=2}
function SlowMotion(){ x/=2}
function stop(){x=0}
