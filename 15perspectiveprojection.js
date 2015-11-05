var projectionStrategy = {
  onePointPerspective : {
    get : function () {
      var l = 100, m = 150, n = 200, d = 100;
      // Moving the object to the appropriate location, l, m, n.
      var Tm = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        l, m, n, 1
      ];
      // Perspective transformation.
      var Tp = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 1/d,
        0, 0, 0, 1
      ];
      var t = matrix3DDotProductMatrix3D(Tm, Tp);
      // Orthogonal projection transformation to the plane xoy.
      var Tx = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 1
      ];
      return matrix3DDotProductMatrix3D(t, Tx);
    }
  },
  twoPointPerspective : {
    get : function () {
      var l = 150, m = 30, n = 50, p = 1/100, r = 1/100, theta = Math.PI / 180 * 45;
      // Moving the object to the appropriate location, l, m, n.
      var Tm = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        l, m, n, 1
      ];
      // Around y axis rotation
      var Try = [
        Math.cos(theta), 0, -Math.sin(theta), 0,
        0, 1, 0, 0,
        Math.sin(theta), 0, Math.cos(theta), 0,
        0, 0, 0, 1
      ];
      var t = matrix3DDotProductMatrix3D(Tm, Try);
      // Perspective transformation.
      var Tp = [
        1, 0, 0, p,
        0, 1, 0, 0,
        0, 0, 1, r,
        0, 0, 0, 1
      ];
      t = matrix3DDotProductMatrix3D(t, Tp);
      // Orthogonal projection transformation to the plane xoy.
      var Tx = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 1
      ];
      return matrix3DDotProductMatrix3D(t, Tx);
    }
  },
  threePointPerspective : {
    get : function () {
      var l = -100, m = 100, n = 50, p = 1/200, q = 1/200, r = 1/200, theta = Math.PI / 180 * 45, alpha = Math.PI / 180 * 45;
      // Moving the object to the appropriate location, l, m, n.
      var Tm = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        l, m, n, 1
      ];
      // Around y axis rotation
      var Try = [
        Math.cos(theta), 0, -Math.sin(theta), 0,
        0, 1, 0, 0,
        Math.sin(theta), 0, Math.cos(theta), 0,
        0, 0, 0, 1
      ];
      var t = matrix3DDotProductMatrix3D(Tm, Try);
      var Trx = [
        1, 0, 0, 0,
        0, Math.cos(alpha), Math.sin(alpha), 0,
        0, -Math.sin(alpha), Math.cos(alpha), 0,
        0, 0, 0, 1
      ];
      t = matrix3DDotProductMatrix3D(t, Trx);
      // Perspective transformation.
      var Tp = [
        1, 0, 0, p,
        0, 1, 0, q,
        0, 0, 1, r,
        0, 0, 0, 1
      ];
      t = matrix3DDotProductMatrix3D(t, Tp);
      // Orthogonal projection transformation to the plane xoy.
      var Tx = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 1
      ];
      return matrix3DDotProductMatrix3D(t, Tx);
    }
  },
  isometric : {
    get : function (a, b) {
      // https://en.wikipedia.org/wiki/Isometric_projection
      a = a == undefined ? Math.PI / 180 * -35.264 : a;
      b = b == undefined ? Math.PI / 180 * 45 : b;
      var Trx = [
        1, 0, 0, 0,
        0, Math.cos(a), Math.sin(a), 0,
        0, -Math.sin(a), Math.cos(a), 0,
        0, 0, 0, 1
      ];
      var Try = [
        Math.cos(b), 0, -Math.sin(b), 0,
        0, 1, 0, 0,
        Math.sin(b), 0, Math.cos(b), 0,
        0, 0, 0, 1
      ];
      var t = matrix3DDotProductMatrix3D(Trx, Try);
      var th = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 1
      ];
      return matrix3DDotProductMatrix3D(t, th);
    }
  }
};