const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const window_width = canvas.width;
const window_height = canvas.height;

let objetos = [];
let eliminadas = 0;

// 🔹 Clase Figura (puede ser círculo, triángulo o estrella)
class Figura {
  constructor(x, y, size, color, speed, tipo) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speed = speed;
    this.tipo = tipo; // "circulo", "triangulo" o "estrella"
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = this.color;

    switch (this.tipo) {
      case "circulo":
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        break;

      case "triangulo":
        context.moveTo(this.x, this.y - this.size);
        context.lineTo(this.x - this.size, this.y + this.size);
        context.lineTo(this.x + this.size, this.y + this.size);
        context.closePath();
        break;

      case "estrella":
        this.drawStar(context, this.x, this.y, 5, this.size, this.size / 2);
        break;
    }

    context.fill();
  }

  // 🌟 Dibuja una estrella centrada y simétrica
  drawStar(context, x, y, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;

    context.moveTo(x, y - outerRadius);
    for (let i = 0; i < spikes; i++) {
      context.lineTo(
        x + Math.cos(rot) * outerRadius,
        y + Math.sin(rot) * outerRadius
      );
      rot += step;
      context.lineTo(
        x + Math.cos(rot) * innerRadius,
        y + Math.sin(rot) * innerRadius
      );
      rot += step;
    }
    context.lineTo(x, y - outerRadius);
    context.closePath();
  }

  update() {
    this.y += this.speed;

    // Si sale del canvas, reaparece arriba
    if (this.y - this.size > window_height) {
      this.reset();
    }

    this.draw(ctx);
  }

  reset() {
    this.x = Math.random() * (window_width - this.size * 2) + this.size;
    this.y = -this.size;
    this.speed = Math.random() * 3 + 1;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    const tipos = ["circulo", "triangulo", "estrella"];
    this.tipo = tipos[Math.floor(Math.random() * tipos.length)];
  }

  isClicked(mx, my) {
    const dx = mx - this.x;
    const dy = my - this.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    return distancia < this.size;
  }
}

function generarFiguras(n) {
  const tipos = ["circulo", "triangulo", "estrella"];

  for (let i = 0; i < n; i++) {
    let size = Math.random() * 20 + 15;
    let x = Math.random() * (window_width - size * 2) + size;
    let y = Math.random() * -window_height;
    let color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    let speed = Math.random() * 3 + 1;
    let tipo = tipos[Math.floor(Math.random() * tipos.length)];

    objetos.push(new Figura(x, y, size, color, speed, tipo));
  }
}

function animate() {
  ctx.clearRect(0, 0, window_width, window_height);
  objetos.forEach(obj => obj.update());
  requestAnimationFrame(animate);
}

canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (let i = 0; i < objetos.length; i++) {
    if (objetos[i].isClicked(mouseX, mouseY)) {
      eliminadas++;
      document.getElementById("contador").textContent = `Eliminadas: ${eliminadas}`;
      objetos[i].reset();
      break;
    }
  }
});

// Inicializar
generarFiguras(15);
animate();
