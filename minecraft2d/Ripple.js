// Ripple class for animation of explosion
var Ripple = (function () {
  //Ripple Animation
  var rippleLocation = vec2(-1.0,-1.0);
  var rippleLocationLoc;
  var rippleTime = 10.0;
  var rippleTimeLoc;
  
  function Ripple() {
    rippleTimeLoc = gl.getUniformLocation( program, "rippleTime" );
    rippleLocationLoc = gl.getUniformLocation( program, "rippleLocation" );
  }

  //Return the corners of this block, in render list order
  Ripple.prototype.createRipple = function(x, y) {
  rippleLocation = gridCoordToBlock(x+0.04, y+0.04);
  rippleTime = 0.0
  }

  Ripple.prototype.animateRipple = function() {
    if(rippleTime < 10) {
      rippleTime += 0.1;
    } else {
      rippleTime = 10;
    }
    rippleTimeLoc = gl.getUniformLocation( program, "rippleTime" );
    gl.uniform1f( rippleTimeLoc, rippleTime );
    rippleLocationLoc = gl.getUniformLocation( program, "rippleLocation" );
    gl.uniform2f( rippleLocationLoc, rippleLocation[0], rippleLocation[1] );
  }

  return Ripple;
})();

