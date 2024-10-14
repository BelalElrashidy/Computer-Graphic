function triangle(){
    const canvas = document.getElementById("square")
    if (!canvas){
        alert('could not find HTML canvas element')
        return
    }
    const gl= canvas.getContext('webgl2');
    if(!gl){
        alert("gl isn't found")
        return
    }
    const vertexData=[
        0.0,0.5,-0.5,-0.5,0.5,-0.5
    ]
    const triangleGeoBuffer=gl.createBuffer()
    
    gl.bindBuffer(gl.ARRAY_BUFFER,triangleGeoBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexData),gl.STATIC_DRAW)
    const vertexShaderSourceCode = `#version 300 es
    precision mediump float;
    
    in vec2 vertexPostion;
    
    void main(){
        gl_Position = vec4(vertexPosition,0.0,1.0);
    }`;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader,vertexShaderSourceCode)
    gl.compileShader(vertexShader);
    console.log(vertexShader)
    const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;
    
    out vec4 outputColor;
    
    void mian(){
        outputColor = vec4(0.294,0.0,0.51,1.0);
    }`;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentShaderSourceCode)
    gl.compileShader(fragmentShader)
    console.log(fragmentShader)
    
    const triangleProgram = gl.createProgram();
    gl.attachShader(triangleProgram,vertexShader)
    gl.attachShader(triangleProgram,fragmentShader)
    gl.linkProgram(triangleProgram)
    const vertexPostionAttributeLocation = gl.getAttribLocation(triangleProgram,'vertexPosition')
    gl.useProgram(triangleProgram)
    gl.enableVertexAttribArray(vertexPostionAttributeLocation)
    gl.vertexAttribPointer(vertexPostionAttributeLocation,2,gl.FLOAT,false,0,0)
    gl.drawArrays(gl.TRIANGLES,0,3)
    
}
triangle()