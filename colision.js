const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const window_width = canvas.width;
const window_height = canvas.height;

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color;
    this.text = text;
    this.speed = speed;
    const angle = Math.random() * Math.PI * 2;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
    this.inCollision = false;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.posX += this.dx;
    this.posY += this.dy;

    // Rebote en bordes
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }

    // Color según estado de colisión
    this.color = this.inCollision ? "#0000FF" : this.originalColor;

    this.draw(context);
  }

  checkCollision(other) {
    const dx = this.posX - other.posX;
    const dy = this.posY - other.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + other.radius;
  }

  resolveCollision(other) {
    // Simple intercambio de velocidades
    let tempDx = this.dx;
    let tempDy = this.dy;
    this.dx = other.dx;
    this.dy = other.dy;
    other.dx = tempDx;
    other.dy = tempDy;

    this.inCollision = true;
    other.inCollision = true;
  }

  clearCollision() {
    this.inCollision = false;
  }
}

let circles = [];

function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `hsl(${Math.random() * 360}, 100%, 40%)`;
    let speed = Math.random() * 4 + 1; // Entre 1 y 5
    let text = `C${i + 1}`;
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

function animate() {
  ctx.clearRect(0, 0, window_width, window_height);

  // Limpiar colisiones anteriores
  circles.forEach(c => c.clearCollision());

  // Detectar y resolver colisiones entre pares
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const c1 = circles[i];
      const c2 = circles[j];

      if (c1.checkCollision(c2)) {
        c1.resolveCollision(c2);
      }
    }
  }

  // Actualizar y dibujar
  circles.forEach(circle => {
    circle.update(ctx);
  });

  requestAnimationFrame(animate);
}

// Inicializar
generateCircles(15);
animate();
