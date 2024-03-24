const canvas = document.getElementById('canvas');
const shapeSelector = document.getElementById('shapeSelector');
const colorSelector = document.getElementById('colorSelector');
const resizeCanvas = () => {
  canvas.width = document.getElementById('canvasContainer').clientWidth;
  canvas.height = document.getElementById('canvasContainer').clientHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const ctx = canvas.getContext('2d');
let shapes = [];

function getRandomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
}

class Shape {
  constructor(x, y, size, type, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    this.color = color === 'random' ? getRandomColor() : color;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    if (this.type === 'rectangle') {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.size, this.size);
      ctx.fill();
    } else if (this.type === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
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
  const type = shapeSelector.value;
  const color = colorSelector.value;
  const shape = new Shape(x, y, size, type, color);
  shapes.push(shape);
  drawShapes();
}

function clearCanvas() {
  shapes = [];
  drawShapes();
}

// Initial shapes
for (let i = 0; i < 10; i++) {
  addRandomShape();
}
