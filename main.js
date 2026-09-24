const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
  throw new Error('WebGL2 deu erro ao abrir');
}

const vertexShaderCode = await fetch('vertex.glsl').then(r => r.text());
const fragmentShaderCode = await fetch('fragment.glsl').then(r => r.text());

const createShader = (type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
  return shader;
};

const program = gl.createProgram();
gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexShaderCode));
gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentShaderCode));
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([
  -0.5, -0.5, 
   0.5, -0.5, 
   0.5,  0.5, 
  -0.5,  0.5  
]);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLoc = gl.getAttribLocation(program, 'position');
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLoc);

gl.clearColor(0.1, 0.1, 0.15, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);