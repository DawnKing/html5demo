Plane = function(normal, d) {
  this.normal = normal;
  this.d = d;
};

Plane.prototype = {
  copy: function() {
    return new Plane(this.normal.copy(), this.d);
  },
  initialize: function() {
    this.position = this.normal.multiply(this.d);
  },
  intersect: function(ray) {
    var a = ray.direction.dot(this.normal);
    if (a >= 0)
      return IntersectResult.noHit;

    var b = this.normal.dot(ray.origin.subtract(this.position));
    var result = new IntersectResult();
    result.geometry = this;
    result.distance = -b / a;
    result.position = ray.getPoint(result.distance);
    result.normal = this.normal;
    return result;
  }
};

Vector3 = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Vector3.prototype = {
  copy: function() {
    return new Vector3(this.x, this.y, this.z);
  },
  length: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  },
  sqrLength: function () {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  },
  normalize: function() {
    var inv = 1 / this.length();
    return new Vector3(this.x * inv, this.y * inv, this.z * inv);
  },
  negate: function() {
    return new Vector3(-this.x, -this.y, -this.z);
  },
  add: function(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  },
  subtract: function(v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  },
  multiply: function(f) {
    return new Vector3(this.x * f, this.y * f, this.z * f);
  },
  divide: function(f) {
    var invf = 1 / f;
    return new Vector3(this.x * invf, this.y * invf, this.z * invf);
  },
  dot: function(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },
  cross: function(v) {
    return new Vector3(-this.z * v.y + this.y * v.z, this.z * v.x - this.x * v.z, -this.y * v.x + this.x * v.y);
  }
};

Vector3.zero = new Vector3(0, 0, 0);

Sphere = function(center, radius) {
  this.center = center;
  this.radius = radius;
};

Sphere.prototype = {
  copy: function() {
    return new Sphere(this.center.copy(), this.radius.copy());
  },
  initialize: function() {
    this.sqrRadius = this.radius * this.radius;
  },
  intersect: function(ray) {
    var v = ray.origin.subtract(this.center);
    var a0 = v.sqrLength() - this.sqrRadius;
    var DdotV = ray.direction.dot(v);

    if (DdotV <= 0) {
      var discr = DdotV * DdotV - a0;
      if (discr >= 0) {
        var result = new IntersectResult();
        result.geometry = this;
        result.distance = -DdotV - Math.sqrt(discr);
        result.position = ray.getPoint(result.distance);
        result.normal = result.position.subtract(this.center).normalize();
        return result;
      }
    }
    return IntersectResult.noHit;
  }
};

Union = function(geometries) {
  this.geometries = geometries;
};

Union.prototype = {
  initialize: function() {
    for (var i in this.geometries)
      this.geometries[i].initialize();
  },
  intersect: function(ray) {
    var minDistance = Infinity;
    var minResult = IntersectResult.noHit;
    for (var i in this.geometries) {
      var result = this.geometries[i].intersect(ray);
      if (result.geometry && result.distance < minDistance) {
        minDistance = result.distance;
        minResult = result;
      }
    }
    return minResult;
  }
};

PerspectiveCamera = function(eye, front, up, fov) {
  this.eye = eye;
  this.front = front;
  this.refUp = up;
  this.fov = fov;
};

PerspectiveCamera.prototype = {
  initialize: function() {
    this.right = this.front.cross(this.refUp);
    this.up = this.right.cross(this.front);
    this.fovScale = Math.tan(this.fov * 0.5 * Math.PI / 180) * 2;
  },
  generateRay: function(x, y) {
    var r = this.right.multiply((x - 0.5) * this.fovScale);
    var u = this.up.multiply((y - 0.5) * this.fovScale);
    return new Ray3(this.eye, this.front.add(r).add(u).normalize());
  }
};

IntersectResult = function() {
  this.geometry = null;
  this.distance = 0;
  this.position = Vector3.zero;
  this.normal = Vector3.zero;
};

IntersectResult.noHit = new IntersectResult();

Ray3 = function (origin, direction) {
  this.origin = origin;
  this.direction = direction;
};

Ray3.prototype = {
  getPoint: function(t) {
    return this.origin.add(this.direction.multiply(t));
  }
};

Color = function(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
};

Color.prototype = {
  copy: function() {
    return new Color(this.r, this.g, this.b);
  },
  add: function(c) {
    return new Color(this.r + c.r, this.g + c.g, this.b + c.b);
  },
  multiply: function(s) {
    return new Color(this.r * s, this.g * s, this.b * s);
  },
  modulate: function(c) {
    return new Color(this.r * c.r, this.g * c.g, this.b * c.b);
  }
};

Color.black = new Color(0, 0, 0);
Color.white = new Color(1, 1, 1);
Color.red = new Color(1, 0, 0);
Color.green = new Color(0, 1, 0);
Color.blue = new Color(0, 0, 1);

/*
* @param diffuse 漫反射颜色
* @param specular 镜面反射颜色
* @param shininess 镜面反射指数
* @pram reflectiveness 反射度
*/
PhongMaterial = function(diffuse, specular, shininess, reflectiveness) {
  this.diffuse = diffuse;
  this.specular = specular;
  this.shininess = shininess;
  this.reflectiveness = reflectiveness;
};

PhongMaterial.prototype = {
  sample: function(ray, position, normal) {
    // https://cg2010studio.wordpress.com/2011/03/27/specular/
    // I = IaKa + IpKd(L·N) + IpKs * (R·V)^n
    // L·N、H·N、R·V等点积为果为正时才有意义
    // 由于Phong的R计算量庞大，Blinn引进H = (L + V) / 2，https://en.wikipedia.org/wiki/Blinn%E2%80%93Phong_shading_model
    // R跟V的夹角非常接近H跟N的夹角，H·N于是可以取代R·V
    // 由于R·V为单位向量，于是R·V等同于cosa
    // R = L – 2.0f * DOT(L, N) * N;
    // H = L + V;
    var NdotL = normal.dot(lightDir);
    // H = 将入射光反射到观察者方向的理想镜面的法向量
    var H = (lightDir.subtract(ray.direction)).normalize();
    var NdotH = normal.dot(H);
    // 漫反射光：Idiffuse = IpKd(L·N)   Ip点光源光强 Kd物体表面漫反射率
    var diffuseTerm = this.diffuse.multiply(Math.max(NdotL, 0));
    // 镜面反射光：Ispec = IpKs(R·V)^n   Ip点光源光强  Ks物体表面某点的高光亮系数  n镜面反射率
    var specularTerm = this.specular.multiply(Math.pow(Math.max(NdotH, 0), this.shininess));
    return lightColor.modulate(diffuseTerm.add(specularTerm));
  }
};

CheckerMaterial = function(scale, reflectiveness) {
  this.scale = scale;
  this.reflectiveness = reflectiveness;
};

CheckerMaterial.prototype = {
  sample: function(ray, position, normal) {
    return Math.abs((Math.floor(position.x * 0.1) + Math.floor(position.z * this.scale)) % 2) < 1 ? Color.black : Color.white;
  }
};
