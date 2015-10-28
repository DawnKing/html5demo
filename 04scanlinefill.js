function scanLineFill(width, pixels, polygonPoint, rgba) {
  // Find minimum enclosed rectangle
  var maxY = 0, minY = 10000;
  var i, j;
  for (i = 0; i < polygonPoint.length; i++) {
    if (polygonPoint[i][1] > maxY)
      maxY = polygonPoint[i][1];
    if (polygonPoint[i][1] < minY)
      minY = polygonPoint[i][1];
  }
  // Initializing the New Edge Table
  var netList = [];
  for (i = minY; i <= maxY; i++) {
    netList[i] = [];
  }
  for (i = minY; i <= maxY; i++) {
    for (j = 0; j < polygonPoint.length; j++) {
      if (polygonPoint[j][1] != i)
        continue;
      addNetList(polygonPoint, i, j, netList, +1);
      addNetList(polygonPoint, i, j, netList, -1);
    }
  }
  // Initializing the Active Edge Table
  var aetList = [];
  for (var y = minY; y <= maxY; y++) {
    // Update the x value for for each edge in the active edge table
    for (j = 0; j < aetList.length; j++) {
      aetList[j].x += aetList[j].dx;
    }
    // Remove any edges from the active edge table for which the maximum y value is equal to the scan line
    for (j = aetList.length - 1; j >= 0; j--) {
      if (aetList[j].yMax != y)
        continue;
      aetList.splice(j, 1);
    }
    // Push any edges from the new edge table for which the minimum y value is equal to the scan line
    for (j = 0; j < netList[y].length; j++) {
      aetList.push(netList[y][j]);
    }
    // Reorder the edges in the active edge table
    aetList.sort(sortNum);
    // Draw all pixels from the x value
    for (i = 0; i < aetList.length; i += 2) {
      for (var x = aetList[i].x; x <= aetList[i + 1].x; x++) {
        drawPixel(parseInt(x), y, width, pixels, rgba);
      }
    }
  }
  return pixels;
}

function sortNum(a, b) {
  return a.x - b.x;
}

function addNetList(polygonPoint, i, j, netList, offset) {
  var index = (j + offset + polygonPoint.length) % polygonPoint.length;
  if (polygonPoint[index][1] > polygonPoint[j][1]) {
    if (polygonPoint[index][1] - polygonPoint[j][1] == 0)
      var tdx = 0;
    else
      tdx = (polygonPoint[index][0] - polygonPoint[j][0]) / (polygonPoint[index][1] - polygonPoint[j][1]);
    netList[i].push({
      x: polygonPoint[j][0],
      yMax: polygonPoint[index][1],
      dx: tdx
    });
  }
}