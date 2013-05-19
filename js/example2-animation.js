var textpathAnimation = new function () {
	var me = this,
			$myShape,
			$myText,
			$textpath,
			$hoverControl,
			originalText,
			spaces = '',
			duration=1000;
	
	me.init = function () {
		
		/*
		 * cache jQuery objects (note: unlike HTML, 
		 * SVG node names, like 'textPath' are case 
		 * sensitive).
		 */
		$myShape = $('#myShape');
		$myText = $('#myText');
		$textpath = $('svg textPath');
		$hoverControl = $('#hoverControl');
		
		/*
		 * To do the animation in IE <= 8, we need to grab
		 * the original text that is on the textpath.
		 * Note that the name of the tag in VML is "textpath",
		 * unlike SVG's "textPath".
		 */
		
		if ($myText[0].nodeName == 'textpath') {
		  originalText = $myText[0].string;
		}
		
		/*
		 * hover in and out events to trigger the animation
		 * in and out.
		 */
		$hoverControl.hover(hoverIn, hoverOut);
	}
	
	/*
	 * hoverIn(): animates text along the textpath.
	 */
	function hoverIn(e) {
		
		/*
		 * We are animting using a dummy CSS property,
		 * appropriately called 'dummy'. :-)
		 */
		$myShape.stop().animate({
			dummy: 100
		}, {
			duration: duration,
			
			/*
			 * now is going to be between 0 and 100.  
			 */
			step: function (now, tween) {
			  
				// For SVG browsers, we modify the startOffset attribute to push the text
				if ($textpath.length > 0) {
				  $textpath[0].setAttribute('startOffset', now + '%');
					
				// In IE <= 8, we have to add spaces to the beginning of the original
				// test on the path. :-/
				} else {
				  $myText[0].string = getSpaces(now) + originalText;
				}
				
			}
		});
	}
	
	/*
	 * Similar to hoverIn(), except backwards.
	 */
	function hoverOut(e) {
		$myShape.stop().animate({
			dummy: 0
		}, {
			duration: duration,
			step: function (now, tween) {
				if ($textpath.length > 0) {
					$textpath[0].setAttribute('startOffset', now + '%');
				} else {
					$myText[0].string = getSpaces(now) + originalText;
				}
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

$(document).ready(textpathAnimation.init)
