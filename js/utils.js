function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomColor() {
  const index = getRandomInt(CSS_COLOR_NAMES.length);
  return CSS_COLOR_NAMES[index];
}
