//Planet Class
var Planet = (function () {
  function Planet(x, y, z, radius, resolution) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.resolution = resolution;
    this.vertices = this.calculateVertices();
  }

  Planet.prototype.calculateVertices = function () {
    var result = [];
    var rad = this.radius;
    function triangle(a, b, c) {
      result = result.concat([a, b, c]);
    }

    function divideTriangle(a, b, c, count) {
      if(count > 0) {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = scale(rad, normalize(ab, true));
        ac = scale(rad, normalize(ac, true));
        bc = scale(rad, normalize(bc, true));

        divideTriangle(a, ab, ac, count - 1);
        divideTriangle(ab, b, bc, count - 1);
        divideTriangle(bc, c, ac, count - 1);
        divideTriangle(ab, bc, ac, count - 1);
      } else {
        triangle(a, b, c);
      }
    }

    function tetrahedron(a, b, c, d, n) {
      divideTriangle(a, b, c, n);
      divideTriangle(d, c, b, n);
      divideTriangle(a, d, b, n);
      divideTriangle(a, c, d, n);
    }

    tetrahedron(
        vec4(0,0,-1,1),
        vec4(0.0, 0.942809, 0.333333, 1),
        vec4(-0.816497, -0.471405, 0.333333, 1),
        vec4(0.816497, -0.471405, 0.333333,1),
        this.resolution);

    return result;
  };

  return Planet;
})();