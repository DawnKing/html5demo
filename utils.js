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

function vector3DDotProductMatrix3D(a, b) {
  var result = [];
  result[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + 1 * b[12];
  result[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + 1 * b[13];
  result[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + 1 * b[14];
  result[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + 1 * b[15];

  result[0] = result[0] / result[3];
  result[1] = result[1] / result[3];
  result[2] = result[2] / result[3];
  result[3] = result[3] / result[3];
  return result;
}

function matrix3DDotProductMatrix3D(a, b) {
  var result = [];
  result[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
  result[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
  result[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
  result[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];
  result[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
  result[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
  result[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
  result[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];
  result[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
  result[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
  result[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
  result[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];
  result[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
  result[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
  result[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
  result[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
  return result;
}

function drawVertex(vertexData, color) {
  var drawList = [];
  for (var i = 0; i < indexData.length; i++) {
    drawList.push(vertexData[indexData[i]]);
  }
  drawPolygon(context, drawList, color);
}
