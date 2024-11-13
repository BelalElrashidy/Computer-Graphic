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
  