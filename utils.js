function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
  return n === Number(n) && n % 1 !== 0;
}

function isPositiveInt(n) {
  return isInt(n) && n > 0;
}

function drawPixel(x, y, width, pixels, rgba) {
  if (!isPositiveInt(x) || !isPositiveInt(y))
    throw new Error("argument must be a nonnegative integer");
  var index = (x + y * width) * 4;
  drawPixel2(index, pixels, rgba);
}

function drawPixel2(index, pixels, rgba) {
  if (!isPositiveInt(index))
    throw new Error("argument must be a nonnegative integer");
  rgba = typeof rbga !== "undefined" ? rgba : [0, 0, 0, 255];
  pixels[index] = rgba[0]; // R
  pixels[index + 1] = rgba[1]; // G
  pixels[index + 2] = rgba[2]; // B
  pixels[index + 3] = rgba[3]; // A
}

function getPixel(x, y, width, pixels) {
  if (!isPositiveInt(x) || !isPositiveInt(y))
    throw new Error("argument must be a nonnegative integer");
  var index = (x + y * width) * 4;
  return [
  pixels[index],
  pixels[index + 1],
  pixels[index + 2],
  pixels[index + 3]
  ];
}

function pixelEqual(x, y, width, pixels, rgba) {
  var a = getPixel(x, y, width, pixels);
  return arraysEqual(a, rgba);
}

function arraysEqual(a, b) {
  if (a === b) 
    return true;
  if (a == null || b == null) 
    return false;
  if (a.length != b.length) 
    return false;
  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
