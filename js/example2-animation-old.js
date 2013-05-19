var IEAnimation = new function () {
	var me = this,
			$shapeContainer,
			$myShape,
			$myText,
			$textpath,
			textInfo,
			originalText,
			spaces = '',
			$hoverControl,
			duration=1000;
	
	me.init = function () {
		
		$shapeContainer = $('#shapeContainer');
		$myShape = $('#myShape');
		$myText = $('#myText');
		$textpath = $('#myText textpath');
		$hoverControl = $('#hoverControl');
		textInfo = getTextInfo();
		originalText = textInfo.node[textInfo.property];
		
		$hoverControl.hover(hoverIn, hoverOut);
	}
	
	function hoverIn(e) {
		
		$myShape.stop().animate({
			dummy: 100
		}, {
			duration: duration,
			step: function (now, tween) {
				
				// For SVG browsers, we modify the startOffset attribute to push the text
				if ($textpath.length > 0) {
					$textpath[0].setAttribute('startOffset', now + '%');
					
				// In IE <= 8, we just add spaces to the text. :-/
				} else {
					textInfo.node[textInfo.property] = getSpaces(now) + originalText;
				}
				
			}
		});
	}
	
	function hoverOut(e) {
		$myShape.stop().animate({
			dummy: 0
		}, {
			duration: duration,
			step: function (now, tween) {
				if ($textpath.length > 0) {
					$textpath[0].setAttribute('startOffset', now + '%');
				} else {
					textInfo.node[textInfo.property] = getSpaces(now) + originalText;
				}
			}
		});
	}
	
	function getTextInfo() {
		switch ($myText[0].nodeName) {
			case 'text':
				return {
					node: $('tspan', $myText)[0],
					property: 'textContent'
				}
			case 'textpath':
				return {
					node: $myText[0],
					property: 'string'
				}
		}
	}
	
	function getText () {
		return textInfo.node[textInfo.property]
		
	}
	
	function getSpaces(n) {
		var r = '';
		for (var i=0; i<n; i++) {
			r += ' ';
		}
		return r;
	}
}

$(document).ready(IEAnimation.init)
