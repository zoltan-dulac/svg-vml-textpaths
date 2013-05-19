/*
 * This implements the rotation animation in 
 * IE <= 9, using jQuery.animate() on VML's 
 * rotation CSS property (for IE <= 8) and
 * IE9's -ms-transform CSS property.
 */

var IEAnimation = new function () {
	var me = this,
			$myShape;
	
	me.init = function () {
	  
		$myShape = $('#myShape');
		$myShape.hover(hoverIn, hoverOut);
	
	}
	
	function hoverIn(e) {
	  
	  // rotate from 0 to 360 in 1000 millseconds.
	  
		$myShape.stop().animate({
		  
		  // This animated VML's rotation CSS property
		  // for IE <= 8
		  
			rotation: 360
		}, {
			duration: 1000,
			step: function (now, tween) {
			  
			  // We need to animation IE9's -ms-transform property
			  // in the step method, since it is non-numeric.  now
			  // will be a number of degrees given in the rotation
			  // property.  Even though that property doesn't exist
			  // in IE9 and above, animate() still uses it to 
			  // populate the step method's now parameter.
			  
				$myShape.css('msTransform', 'rotate(' + now + 'deg)');
			}
		});
	}
	
	function hoverOut(e) {
	  
	  // rotate from 360 to 0 in 1000 millseconds.  Same
	  // idea as the hoverIn() method.
	  
		$myShape.stop().animate({
			rotation: 0
		}, {
			duration: 1000,
			step: function (now, tween) {
				$myShape.css('msTransform', 'rotate(' + now + 'deg)');
			}
		});
	}
	
	
  /*
   * getSpaces(): returns a string with n space in it.
   */
  function getSpaces(n) {
    var r = '';
    for (var i=0; i<n; i++) {
      r += ' ';
    }
    return r;
  }
	
}

$(document).ready(IEAnimation.init)
