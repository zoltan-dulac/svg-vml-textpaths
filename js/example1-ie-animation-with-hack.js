var IEAnimation = new function () {
	var me = this,
			$textPathContainer,
			$myShape,
			isIE9lower = false;
	
	me.init = function () {
	  /*@cc_on
 
    @if (@_jscript_version == 9)
      isIE9lower=true;
	  @end
 
    @*/
	  
		$textPathContainer = $('#textPathContainer, #myShape');
		$myShape = $('#myShape');
		
		$textPathContainer.hover(hoverIn, hoverOut);
		
		me.fixBaselines();
		
		
	}
	
	function hoverIn(e) {
		$myShape.stop().animate({
			rotation: 360
		}, {
			duration: 1000,
			step: function (now, tween) {
				$myShape.css('msTransform', 'rotate(' + now + 'deg)');
			}
		});
	}
	
	function hoverOut(e) {
		$myShape.stop().animate({
			rotation: 0
		}, {
			duration: 1000,
			step: function (now, tween) {
				$myShape.css('msTransform', 'rotate(' + now + 'deg)');
			}
		});
	}
	
	me.fixBaselines = function () {
	  if (!isIE9lower) {
	    return;
	  }
	  
	  var tspans = $('tspan');
	  
	 if ( window.getComputedStyle(tspans[0], null).dominantBaseline == 'middle') {
	   tspans.each(function(i, el) {
	     el.setAttribute('dy', '0.3em');
	   });
	 }
	}
}

$(document).ready(IEAnimation.init)
