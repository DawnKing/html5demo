function draw() {
  var canvas = document.getElementById("canvasCircle");
  var ctx = canvas.getContext("2d");
  var w = canvas.attributes.width.value;
  var h = canvas.attributes.height.value;
  var d = Math.min(w, h);
  var r = d / 2;
  var a = r, b = r;
  ctx.fillStyle = "#FF0000";
  ctx.beginPath();
  ctx.arc(a, b, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}
