class Canvas {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.context = this.setupCanvas(this.canvas);
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.velocity = 0.005;
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

  drawSquares() {
    const self = this;
    const { clientWidth, clientHeight } = self.canvas;
    const context = self.context;
    context.save();
    context.translate(clientWidth * 0.1, clientHeight * 0.1);
    const hBlocks = 10;
    const vBlocks = 50;
    const lineWidth = 2;

    const width = (clientWidth * 0.9) / hBlocks;
    const height = (clientHeight * 0.9) / vBlocks;

    context.strokeStyle = "white";

    for (let i = 0; i < hBlocks; i++) {
      const time = new Date();
      for (let j = 0; j < vBlocks; j++) {
        context.save();
        context.lineWidth = lineWidth;
        context.translate(i * width, j * height);
        context.rotate(
          ((2 * Math.PI) / 10) * time.getSeconds() +
            ((2 * Math.PI) / 10000) * time.getMilliseconds()
        );
        context.beginPath();
        context.rect(-width * 0.5, -height * 0.5, width * 0.5, height * 0.5);
        context.stroke();
        context.lineWidth = lineWidth;
        context.fill();
        context.restore();
      }
    }
    context.restore();
  }

  init() {
    const self = this;
    const { clientWidth, clientHeight } = self.canvas;
    const context = self.context;
    const fill = context.createLinearGradient(0, 0, clientWidth, clientHeight);
    fill.addColorStop(0, getRandomColor());
    fill.addColorStop(1, getRandomColor());
    context.fillStyle = fill;
    context.fillRect(0, 0, clientWidth, clientHeight);
    self.loop();
  }

  clearCanvas() {
    const context = this.context;
    context.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
  }

  rand(rMi, rMa) {
    return ~~(Math.random() * (rMa - rMi + 1) + rMi);
  }

  loop() {
    const self = this;
    var loopIt = function () {
      requestAnimationFrame(loopIt, self.canvas);
      self.clearCanvas();
      self.drawSquares();
    };
    loopIt();
  }
}
