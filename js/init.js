const _d = document;

const setDimensions = (_el, width, height, percentage = 1) => {
  _el.style.width = `${width * percentage}px`;
  _el.style.height = `${height * percentage}px`;
};

const placeInCenter = (_el, windowWidth, windowHeight) => {
  _el.style.marginLeft = `${windowWidth / 2 - _el.clientWidth / 2}px`;
  _el.style.marginTop = `${windowHeight / 2 - _el.clientHeight / 2}px`;
};

window.onload = window.onresize = (_) => {
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
  const _can = _d.querySelector("canvas");
  // const percentage = 0.95;
  const percentage = 1;
  setDimensions(_can, windowWidth, windowHeight, percentage);
  placeInCenter(_can, windowWidth, windowHeight);
  const canvas = new Canvas();
  canvas.init();
};
