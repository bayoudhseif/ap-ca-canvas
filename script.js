const canvas = document.getElementById('canvas');
const shapeSelector = document.getElementById('shapeSelector'); // Shape selector
const colorSelector = document.getElementById('colorSelector'); // Color selector
const resizeCanvas = () => {
  canvas.width = document.getElementById('canvasContainer').clientWidth;
  canvas.height = document.getElementById('canvasContainer').clientHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const ctx = canvas.getContext('2d');
let shapes = [];

function getRandomColor() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomShape() {
  const shapes = ['rectangle', 'circle', 'triangle', 'ellipse'];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

class Shape {
  constructor(x, y, size, type, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    this.color = color === 'randomColor' ? getRandomColor() : color;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    switch (this.type) {
      case 'rectangle':
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.size / 2, this.y + this.size);
        ctx.lineTo(this.x - this.size / 2, this.y + this.size);
        ctx.closePath();
        ctx.fill();
        break;
    }
  }
}

function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => shape.draw(ctx));
}

function addRandomShape() {
  const size = Math.random() * 80 + 20; // Size between 20 and 100
  const x = Math.random() * (canvas.width - size);
  const y = Math.random() * (canvas.height - size);
  const type = shapeSelector.value === 'randomShape' ? getRandomShape() : shapeSelector.value;
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
