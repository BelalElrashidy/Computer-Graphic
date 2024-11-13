
try {
  // Uncomment the shape you want to draw
  // drawSimpleTriangle();
  // drawGradientTriangle();
//   drawSquare();
  // drawSierpinskiTriangle();
  drawCircle('square',true);
  drawCircle('circle',false);
} catch (e) {
  alert(`Uncaught JavaScript exception: ${e}`);
}