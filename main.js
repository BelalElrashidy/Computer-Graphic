let thetaLoc;
let theta = [0, 0, 0];
let axis = 0; // 0: X, 1: Y, 2: Z
let x =0.01;
let thetaLocs;
let thetaS = 0.0;
let gl;
let program;
try {
  // Uncomment the shape you want to draw
  // drawSimpleTriangle();
  // drawGradientTriangle();
  // drawSquare();
  // drawSierpinskiTriangle();
  // drawCircle('square',true);
  // drawCircle('circle',false);
  // rotatingCube();
  // rotatingSquare();
  Scene();
} catch (e) {
  alert(`Uncaught JavaScript exception: ${e}`);
}