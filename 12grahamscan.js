// https://en.wikipedia.org/wiki/Graham_scan
// https://github.com/brian3kb/graham_scan_js/blob/master/src/graham_scan.js
function getConvexHull(pointList) {
  var points = [], anchorPoint = [10000, 10000];
  for (var i = 0; i < pointList.length; i++) {
    var x = pointList[i][0];
    var y = pointList[i][1];
    if (anchorPoint[1] > y || (anchorPoint[1] == y && anchorPoint[0] > x)){
      anchorPoint[0] = x;
      anchorPoint[1] = y;
      points.unshift([x, y]);
    } else {
      points.push([x, y]);
    }
  }

  var reverse = false;
  reverse = points.every(function (point){
    return (point[0] < 0 && point[1] < 0);
  });

  points = points.sort(sortPoint);
  var pointsLength = points.length;

  //If there are less than 4 points, joining these points creates a correct hull.
  if (pointsLength < 4) {
    return points;
  }

  //move first two points to output array
  var result = [points.shift(), points.shift()];

  //scan is repeated until no concave points are present.
  while (true) {
    var p0,
      p1,
      p2;

    result.push(points.shift());

    p0 = result[result.length - 3];
    p1 = result[result.length - 2];
    p2 = result[result.length - 1];

    if (checkPoints(p0, p1, p2)) {
      result.splice(result.length - 2, 1);
    }

    if (points.length == 0) {
      if (pointsLength == result.length) {
        return result;
      }
      points = result;
      pointsLength = points.length;
      result = [];
      result.push(points.shift(), points.shift());
    }
  }

  function sortPoint(a, b) {
    var polarA = findPolarAngle(anchorPoint, a);
    var polarB = findPolarAngle(anchorPoint, b);

    if (polarA < polarB) {
      return -1;
    }
    if (polarA > polarB) {
      return 1;
    }

    return 0;
  }

  function findPolarAngle(a, b) {
    var ONE_RADIAN = 57.295779513082;
    var deltaX = (b[0] - a[0]);
    var deltaY = (b[1] - a[1]);

    if (deltaX == 0 && deltaY == 0) {
      return 0;
    }

    var angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

    if (reverse){
      if (angle <= 0) {
        angle += 360;
      }
    }else{
      if (angle >= 0) {
        angle += 360;
      }
    }

    return angle;
  }

  function checkPoints(p0, p1, p2) {
    var difAngle;
    var cwAngle = findPolarAngle(p0, p1);
    var ccwAngle = findPolarAngle(p0, p2);

    if (cwAngle > ccwAngle) {
      difAngle = cwAngle - ccwAngle;
      return !(difAngle > 180);
    } else if (cwAngle < ccwAngle) {
      difAngle = ccwAngle - cwAngle;
      return (difAngle > 180);
    }
    return false;
  }
}