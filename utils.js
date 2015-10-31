function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
  return n === Number(n) && n % 1 !== 0;
}

function isPositiveInt(n) {
  return isInt(n) && n >= 0;
}

function drawPixel(x, y, width, pixels, rgba) {
  if (!isPositiveInt(x) || !isPositiveInt(y))
    throw new Error("argument must be a nonnegative integer");
  rgba = typeof rgba !== "undefined" ? rgba : [0, 0, 0, 255];
  var index = (x + y * width) * 4;
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
    if (a[i] !== b[i])
      return false;
  }
  return true;
}

function stripNumber(number, precision) {
  precision = typeof precision !== "undefined" ? precision : 3;
  return (parseFloat(number.toPrecision(precision)));
}

function isZero(n) {
  return (n < 0.000001 && n > -0.000001);
}

function drawPolygon(context, polygon, strokeStyle, fillStyle) {
  context.strokeStyle = strokeStyle;
  context.beginPath();

  context.moveTo(polygon[0][0],polygon[0][1]);
  for (i = 1; i < polygon.length; i++)
    context.lineTo(polygon[i][0],polygon[i][1]);

  context.closePath();
  context.stroke();

  if (fillStyle == undefined)
    return;
  context.fillStyle = fillStyle;
  context.fill();
}

// Algorithm is explained in this website.
// http://stackoverflow.com/questions/11716268/point-in-polygon-algorithm
// polygon format: [[x0, y0], [x1, y1], [x2, y2], [x3, y3]]
function pointInPolygon(x, y, polygon) {
  var result = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    var xi = polygon[i][0], yi = polygon[i][1];
    var xj = polygon[j][0], yj = polygon[j][1];

    var intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect)
      result = !result;
  }
  return result;
}

function getBoundingBox(pointList) {
  var minX, minY, maxX, maxY;
  minX = minY = Number.MAX_VALUE;
  maxX = maxY = Number.MIN_VALUE;
  for (var v = 0; v < pointList.length; v++) {
    minX = Math.min(minX, pointList[v][0]);
    minY = Math.min(minY, pointList[v][1]);
    maxX = Math.max(maxX, pointList[v][0]);
    maxY = Math.max(maxY, pointList[v][1]);
  }
  return [minX, minY, maxX, maxY];
}
