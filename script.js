const canvas = document.getElementById('canvas');
const shapeSelector = document.getElementById('shapeSelector'); // Shape selector
const colorSelector = document.getElementById('colorSelector'); // Color selector
const resizeCanvas = () => {
    const headerHeight = document.querySelector('header').clientHeight;
    const topBarHeight = document.getElementById('topBar').clientHeight;
    const availableHeight = window.innerHeight - headerHeight - topBarHeight - 40; // 40px for some padding
    const availableWidth = document.getElementById('canvasContainer').clientWidth;
    
    canvas.width = availableWidth;
    canvas.height = availableHeight > 0 ? availableHeight : canvas.height; // Prevent negative height
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
    const shapes = ['rectangle', 'circle', 'triangle'];
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
    
    draw(ctx, mouseX, mouseY) {
        // Calculate shadow direction based on mouse position
        const offsetX = this.x - mouseX;
        const offsetY = this.y - mouseY;
        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        const shadowLength = Math.min(distance / 5, 50); // Limit shadow length
        const shadowDirectionX = offsetX / distance;
        const shadowDirectionY = offsetY / distance;
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        switch (this.type) {
            case 'rectangle':
                ctx.rect(this.x + shadowDirectionX * shadowLength, this.y + shadowDirectionY * shadowLength, this.size, this.size);
                break;
            case 'circle':
                ctx.arc(this.x + shadowDirectionX * shadowLength, this.y + shadowDirectionY * shadowLength, this.size / 2, 0, 2 * Math.PI);
                break;
            case 'triangle':
                ctx.moveTo(this.x + shadowDirectionX * shadowLength, this.y + shadowDirectionY * shadowLength);
                ctx.lineTo(this.x + this.size / 2 + shadowDirectionX * shadowLength, this.y + this.size + shadowDirectionY * shadowLength);
                ctx.lineTo(this.x - this.size / 2 + shadowDirectionX * shadowLength, this.y + this.size + shadowDirectionY * shadowLength);
                ctx.closePath();
                break;
        }
        ctx.fill();

        // Draw shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        switch (this.type) {
            case 'rectangle':
                ctx.rect(this.x, this.y, this.size, this.size);
                break;
            case 'circle':
                ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
                break;
            case 'triangle':
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.size / 2, this.y + this.size);
                ctx.lineTo(this.x - this.size / 2, this.y + this.size);
                ctx.closePath();
                break;
        }
        ctx.fill();
    }

    // Method to check if a point is inside the shape
    contains(point) {
        switch (this.type) {
            case 'rectangle':
                return point.x >= this.x && point.x <= this.x + this.size &&
                        point.y >= this.y && point.y <= this.y + this.size;
            case 'circle':
                const distance = Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
                return distance <= this.size / 2;
            case 'triangle':
                // Simple approach for triangle hit detection; more complex math required for accuracy
                return point.x >= this.x - this.size / 2 && point.x <= this.x + this.size / 2 &&
                        point.y >= this.y && point.y <= this.y + this.size;
        }
    }
}


function drawShapes(mouseX, mouseY) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => shape.draw(ctx, mouseX, mouseY));
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

canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    drawShapes(mouseX, mouseY);
});

canvas.addEventListener('mousedown', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (event.button === 0) { // Left mouse button
        addShapeAtPosition(x, y);
    } else if (event.button === 2) { // Right mouse button
        deleteShapeAtPosition(x, y);
        event.preventDefault(); // Prevent the context menu from appearing
    }
});

function addShapeAtPosition(x, y) {
    const size = Math.random() * 80 + 20; // Size between 20 and 100
    const type = shapeSelector.value === 'randomShape' ? getRandomShape() : shapeSelector.value;
    const color = colorSelector.value;
    const shape = new Shape(x - size / 2, y - size / 2, size, type, color);
    shapes.push(shape);
    drawShapes();
}

function deleteShapeAtPosition(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
        if (shapes[i].contains({ x: x, y: y })) {
            shapes.splice(i, 1);
            break; // Remove the first shape that matches and exit loop
        }
    }
    drawShapes();
}

// Prevent the context menu on right-click over the canvas
canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
