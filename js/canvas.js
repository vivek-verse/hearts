class Canvas {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.context = this.setupCanvas(this.canvas);
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.particles = [];
    this.angle = 0;
    this.numParticles = 5;
  }

  createParticle(i, posX, posY){
      
      let size = Math.random() * 30 + 20;

      // let size = 0;

      let x = posX || Math.random() * (this.canvas.clientWidth - size * 2);
      let y = posY || Math.random() * (this.canvas.clientHeight - size * 2);

      let directionX = Math.random() * 1 - 0.2;
      let directionY = Math.random() * 1 - 0.2;
      let color = getRandomColor();
      this.particles.push(
        new Particle(i, x, y, directionX, directionY, size, color)
      );
  }

  setupCanvas(canvas) {
    let dpr = window.devicePixelRatio || 1;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const context = canvas.getContext("2d");
    context.scale(dpr, dpr);
    return context;
  }

  init() {

    const self = this;

    document.addEventListener("click", (event) => {
      self.createParticle(this.particles.length, event.clientX, event.clientY);
    });

    const fill = this.context.createLinearGradient(
      0,
      0,
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );

    fill.addColorStop(0, "#33FFFF");
    fill.addColorStop(1, "#3300FF");
    this.context.fillStyle = fill;

    this.context.save();

    for (let i = 0; i < this.numParticles; i++) {
      this.createParticle(i);
    }

    this.animate();
  }

  animate() {
    this.context.restore();
    const self = this;
    requestAnimationFrame(self.animate.bind(self));
    this.context.fillRect(
      0,
      0,
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );

    this.context.save();

    for(let i = 0; i < this.particles.length; i++){
      const particleOne = this.particles[i];
      for(let j = i + 1; j < this.particles.length; j++){
        const particleOther = this.particles[j];
        const dist = particleOne.getDistance(particleOther);
        
        if(dist > 150){
         particleOne.glow = false;
         particleOther.glow = false;
         continue;
        }          

        particleOne.glow = true;
        particleOther.glow = true;

        this.context.beginPath();
        this.context.lineWidth = 3.0;
        this.context.moveTo(particleOne.x, particleOne.y);
        this.context.lineTo(particleOther.x, particleOther.y);
        this.context.stroke();
        this.context.closePath();
      }
    }

    for(let i = 0; i < this.particles.length; i++){
      const particleOne = this.particles[i];
      let toRemove = false;
      for(let j = i + 1; j < this.particles.length; j++){
        const particleOther = this.particles[j];
        const dist = particleOne.getDistance(particleOther); 
        if(dist < 40){
          toRemove = true;
          particleOther.size += particleOne.size;
        }
      }

      if(toRemove){
        this.particles = this.particles.filter(function(p){
          return p.id !== particleOne.id;
        })
      }

    }


    for (const particle of this.particles) {
      particle.update(
        this.context,
        this.canvas.clientWidth,
        this.canvas.clientHeight
      );
    }
  }

}

class Particle {
  constructor(id, x, y, directionX, directionY, size, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    this.angle = 0;
    this.glow = false;
  }

  getDistance(other){
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  draw(context) {
    const w = this.size;
    const h = this.size;
    context.strokeStyle = "#000000";
    context.strokeWeight = 3;
    context.shadowOffsetX = 4.0;
    context.shadowOffsetY = 4.0;
    context.lineWidth = 8.0;
    context.fillStyle = this.color;
    var d = Math.min(w, h);
    this.angle += 0.02;

    context.save();

    context.translate(this.x,this.y);
    context.rotate(
      this.angle
    );
    // context.translate(100,100);
    context.beginPath();
    const k = 0;
    if(this.glow){
      context.shadowBlur = 3;
      context.shadowColor = "#B94A46";
    }
    context.moveTo(k, k + d / 4);
    context.quadraticCurveTo(k, k, k + d / 4, k);
    context.quadraticCurveTo(k + d / 2, k, k + d / 2, k + d / 4);
    context.quadraticCurveTo(k + d / 2, k, k + d * 3/4, k);
    context.quadraticCurveTo(k + d, k, k + d, k + d / 4);
    context.quadraticCurveTo(k + d, k + d / 2, k + d * 3/4, k + d * 3/4);
    context.lineTo(k + d / 2, k + d);
    context.lineTo(k + d / 4, k + d * 3/4);
    context.quadraticCurveTo(k, k + d / 2, k, k + d / 4);
    context.stroke();
    context.fill();
    context.closePath();
    context.restore();
  }

  update(context, canvasWidth, canvasHeight) {
    if (this.x + this.size > canvasWidth || this.x - this.size < 0) {
      this.directionX = -this.directionX;
    }

    if (this.y + this.size > canvasHeight || this.y - this.size < 0) {
      this.directionY = -this.directionY;
    }

    this.x += this.directionX;
    this.y += this.directionY;

    this.draw(context);
  }
}
