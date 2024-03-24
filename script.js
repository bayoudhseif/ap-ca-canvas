const canvas = document.getElementById('canvas');
const resizeCanvas = () => {
  canvas.width = document.getElementById('canvasContainer').clientWidth;
  canvas.height = document.getElementById('canvasContainer').clientHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const ctx = canvas.getContext('2d');

let shapes = [];

function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
}

class Shape {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = randomColor();
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.size, this.size);
    ctx.fill();
  }
}

function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => shape.draw(ctx));
}

function addRandomShape() {
  const size = Math.random() * 80 + 20;
  const x = Math.random() * (canvas.width - size);
  const y = Math.random() * (canvas.height - size);
  const shape = new Shape(x, y, size);
  shapes.push(shape);
  drawShapes();
}

function clearCanvas() {
  shapes = [];
  drawShapes();
}

// Draw some initial shapes
for (let i = 0; i < 10; i++) {
  addRandomShape();
}
