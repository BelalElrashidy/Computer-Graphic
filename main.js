function triangle(){
    const canvas = document.getElementById('square');
    if (!canvas) {
      alert('Could not find HTML canvas element - check for typos, or loading JavaScript file too early');
      return;
    }
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      alert("WebGL is not supported");
      return;
    }

    const vertexData = [
       0.0, 0.5,    1.0, 0.0, 0.0,  
      -0.5, -0.5,   0.0,  0.0,1.0,  
       0.5, -0.5,   0.0, 1.0, 0.0   
    ];

    const triangleGeoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const vertexShaderSourceCode = `#version 300 es
    precision mediump float; 
    
    in vec2 vertexPosition;  
    in vec3 vertexColor;     
    out vec3 fragColor;      
    
    void main() {
      gl_Position = vec4(vertexPosition, 0.0, 1.0);  
      fragColor = vertexColor;                       
    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);
   
    const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;
    
    in vec3 fragColor;        
    out vec4 outputColor;     
    
    void main() {
      outputColor = vec4(fragColor, 1.0);  
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);

    const TriangleProgram = gl.createProgram();
    gl.attachShader(TriangleProgram, vertexShader);
    gl.attachShader(TriangleProgram, fragmentShader);
    gl.linkProgram(TriangleProgram);

    const vertexPositionAttributeLocation = gl.getAttribLocation(TriangleProgram, 'vertexPosition');
    gl.vertexAttribPointer(vertexPositionAttributeLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(vertexPositionAttributeLocation);

    const vertexColorAttributeLocation = gl.getAttribLocation(TriangleProgram, 'vertexColor');
    gl.vertexAttribPointer(vertexColorAttributeLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(vertexColorAttributeLocation);

    gl.useProgram(TriangleProgram);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

try {
    triangle();
} catch (e) {
    alert(`Uncaught JavaScript exception: ${e}`);
}
