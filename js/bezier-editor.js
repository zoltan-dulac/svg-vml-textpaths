/*
 * Bezier Editor - Copyright (C) 2013 Zoltan Hawryluk 
 * http://www.useragentman.com
 * 
 * Released under the MIT License.  
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * Further reading: http://www.svgbasics.com/curves.html
 */

var bezierEditor = new function () {
	var me = this,
		$curvePts = [],
		$curve,
		$pathInput,
		$info,
		$slopes,
		$footer,
		isMouseDown = false,
		movingTarget,
		$svg,
		noInfo,
		showFooter,
		SVGDocument,
		startX = 450,
		startY = 350,
		endX = 750,
		endY = 350,
		$imageURL,
		$myImg,
		clip,
		qs;
	
	me.init = function () {
		

		$svg = $('svg');
		 
		
		
		$curvePts = $('[class="controlPoint"]');
		$endPts = $('[class="endPoint"]');
		$pts = $('[class="controlPoint"], [class="endPoint"]');
		$curve = $('#curve');
		$info = $('#info, #instructions');
		$pathInput = $('#pathInput');
		$imageURL = $('#imageURL');
		$myImg = $('#myImg');
		$slopes = $('[class="slope"]');
		$footer = $('footer');
		
		useHashParams();
		
		$pts.bind('mousedown', mouseDownEvent);
		
		//$myImg.imagesLoaded(imageLoadEvent)
			
		$('body')
			.bind('mouseup', mouseUpEvent)
			.bind('mousemove', mouseMoveEvent);
			
		$('img, .vml').bind('selectstart', selectEvent)
			.bind('dragstart', selectEvent);
		
		/* if ($('html').hasClass('lte8')) {
			$('html').keypress(keyEvent);
		} else { */
			$('html').keydown(keyEvent);
		//}
		
	    $('input').keydown(function(e){
	    	e.stopPropagation();
	    })
		$('#setImage').bind('click', setImageEvent);
		
		if ($svg.length > 0) {
			SVGDocument = $svg[0].ownerDocument;
			SVGRoot = SVGDocument.documentElement;
		} else {
			$pts.each(function (i, el) {
	      		var x = parseInt(el.currentStyle.left),
	      			y = parseInt(el.currentStyle.top);
	      			
	      		el['data-x'] = x;
	      		el['data-y'] = y;
	      	});
	    }
	    
      	
      	$('form').bind('submit', function (e) { 
      		e.preventDefault();
      	}).bind('reset', function (e) {
      			 	setTimeout(function () {
      			 		setImageEvent()
      			 		$('#instructions').css('display', 'block');
      			 		setHash()
      			 	}, 100);
      			 	
      			 });
      	
      	// set up Zero Clipboard
      	clip = new ZeroClipboard( document.getElementById("copy-button"), {
		  moviePath: "js/zeroclipboard/ZeroClipboard.swf"
		} );
		
		
		$(window).bind('hashchange', useHashParams)
		
	}
	
	function useHashParams() {
		
		qs = new Querystring(document.location.hash.substring(1))
		
		
		var path = qs.get('path'),
			imageURL = qs.get('imageURL');
			
			
		showFooter = qs.get('showFooter');
		noInfo = qs.get('noInfo');
		
		if (path) {
			$pathInput.val(path);
		}
		
		if (imageURL) {
			
			$imageURL.val(imageURL)
		}
		
		if (noInfo) {
			$info.addClass('invisible');
		} else {
			$info.removeClass('invisible');
		}
		
		
		if (showFooter) {
			$footer.addClass('visible')
		}
		
		setImageEvent();
	}
	
	function selectEvent (e) {
		e.preventDefault(e);
	}
	
	function mouseDownEvent(e) {
		movingTarget = e.target;
		isMouseDown = true;
		
		if (!noInfo) {
			$info.addClass('invisible');
		}
	}
	
	function mouseUpEvent(e) {
		
		isMouseUp = false;
		movingTarget = null;
		
		
		if (!noInfo) {
			$info.removeClass('invisible');
		}
		setHash()
	}
	
	function mouseMoveEvent(e) {
		e.stopPropagation();
		
		
		
		if (e.target.nodeName.indexOf('V:') == 0) {
			return;
		}
		
		
		if (movingTarget) {
			
			if (movingTarget.nodeName == 'circle') {
				movingTarget.setAttribute('cx', e.pageX);
				movingTarget.setAttribute('cy', e.pageY);	
			} else {
				movingTarget.style.left = e.pageX + 'px';
				movingTarget.style.top  = e.pageY + 'px';
				movingTarget['data-x'] = e.pageX;
				movingTarget['data-y'] = e.pageY;
				
			}
			drawCurve();
			
			/* if (isMouseDown) {
				console.log($pathInput.value);
			} */
		
		} 
		
	}
	
	function drawCurve() {
		if ($endPts[0].nodeName == 'circle') {
		
			var d = 'M ' + $endPts[0].getAttribute('cx') + ', ' + $endPts[0].getAttribute('cy') + 
					' C ' + $curvePts[0].getAttribute('cx') + ', ' + $curvePts[0].getAttribute('cy') +
					', '  + $curvePts[1].getAttribute('cx') + ', ' + $curvePts[1].getAttribute('cy') +
					', ' + $endPts[1].getAttribute('cx') + ', ' + $endPts[1].getAttribute('cy');
				
			$curve[0].setAttribute('d', d);
			$pathInput[0].value=d;
			
			// now let's draw the slopes of the begin and end of the path
			for (var i=0; i<2; i++) {
				var slope = $slopes[i];
				slope.setAttribute('x1', $endPts[i].getAttribute('cx'));
				slope.setAttribute('y1', $endPts[i].getAttribute('cy'));
				slope.setAttribute('x2', $curvePts[i].getAttribute('cx'));
				slope.setAttribute('y2', $curvePts[i].getAttribute('cy'));
				
			}
		} else {
			var d = 'M ' + parseInt($endPts[0]['data-x']) + ', ' + parseInt($endPts[0]['data-y']) + 
					' C ' + parseInt($curvePts[0]['data-x']) + ', ' + parseInt($curvePts[0]['data-y']) +
					', '  + parseInt($curvePts[1]['data-x']) + ', ' + parseInt($curvePts[1]['data-y']) +
					', ' + parseInt($endPts[1]['data-x']) + ', ' + parseInt($endPts[1]['data-y']);
				
			$curve[0].path = d;
			$pathInput[0].value = d;
			
			// now let's draw the slopes of the begin and end of the path
			for (var i=0; i<2; i++) {
				var slope = $slopes[i];
				slope.from =  $endPts[i]['data-x'] + ', ' + $endPts[i]['data-y'] ;
				slope.to =  $curvePts[i]['data-x'] + ', ' + $curvePts[i]['data-y'] ;
				
			}
		}
		
		$footer.html(d);
		
	}
	
	
      
      function keyEvent(e) {
      	
      	var xOff = 0, yOff = 0;
      	
      	switch (e.keyCode) {
      		case CharCode.UP:
      			yOff--;
      			break;
      		case CharCode.DOWN:
      			yOff++;
      			break;
      		case CharCode.LEFT:
      			xOff--;
      			break;
      		case CharCode.RIGHT:
      			xOff++;
      			break;
      		case CharCode.ESCAPE:
      			$info.toggleClass('hidden');
      			
      			break;
      	}
      	
      	
      	
      	if (xOff != 0 || yOff != 0) {
      		if (e.shiftKey) {
      			xOff *= 10;
      			yOff *= 10;
      		}
      		
      		$pts.each(function (i, el) {
      			
      			if (el.nodeName == 'circle') {
		      		var x = parseInt(el.getAttribute('cx')) + xOff,
		      			y = parseInt(el.getAttribute('cy')) + yOff;
		      			
		      		el.setAttribute('cx', x);
		      		el.setAttribute('cy', y);
		      	} else {
		      		var x = parseInt(el['data-x']) + xOff,
		      			y = parseInt(el['data-y']) + yOff;
		      			
		      		el.style.left = x + 'px';
		      		el.style.top = y + 'px';
		      		el['data-x'] = x;
		      		el['data-y'] = y;
		      	}
	      	});
	      	
	      	drawCurve();
      		
			setHash()
      		e.preventDefault();
      	}
      	
      	
      	
      }
      
      function setHash() {
      	location.hash = '#path=' + encodeURIComponent($pathInput.val()) + 
      					'&imageURL=' + $imageURL.val() +
      					(showFooter?'&showFooter=' + showFooter:"") +
      					(noInfo?'&noInfo=' + noInfo:"");
      }
      
      function setImageEvent(e) {
      	
      	/*
      	 * Bail if the form isn't valid.
      	 */
      	if ($('form')[0].checkValidity && !$('form')[0].checkValidity()) {
      		return;
      	}
      	
      	$myImg[0].src = $imageURL.val();
      	//$('#instructions').css('display', 'none');
      	
      	/* Set path in form element */ 
      	var d = $('#pathInput').val(),
      		pathToSet = d.split(/[MC, ]+/);
      	
      	if ($.trim(pathToSet[0]) == '') {
      		pathToSet.shift();
      	}
      	
      	/* SVG */
      	if ($endPts[0].nodeName == 'circle') {
	      	$endPts[0].setAttribute('cx', pathToSet[0])
			$endPts[0].setAttribute('cy', pathToSet[1]); 
			$curvePts[0].setAttribute('cx', pathToSet[2]);
			$curvePts[0].setAttribute('cy', pathToSet[3]);
			$curvePts[1].setAttribute('cx', pathToSet[4]);
			$curvePts[1].setAttribute('cy', pathToSet[5]);
			$endPts[1].setAttribute('cx', pathToSet[6]);
			$endPts[1].setAttribute('cy', pathToSet[7]);
					
			$curve[0].setAttribute('d', d);
			
			// now let's draw the slopes of the begin and end of the path
			for (var i=0; i<2; i++) {
				var slope = $slopes[i];
				slope.setAttribute('x1', $endPts[i].getAttribute('cx'));
				slope.setAttribute('y1', $endPts[i].getAttribute('cy'));
				slope.setAttribute('x2', $curvePts[i].getAttribute('cx'));
				slope.setAttribute('y2', $curvePts[i].getAttribute('cy'));
				
			}
			
		} else {
			$endPts[0].style.left =  pathToSet[0]+ 'px';
			$endPts[0].style.top = pathToSet[1]+ 'px'; 
			$curvePts[0].style.left =  pathToSet[2]+ 'px';
			$curvePts[0].style.top = pathToSet[3]+ 'px';
			$curvePts[1].style.left =  pathToSet[4]+ 'px';
			$curvePts[1].style.top = pathToSet[5]+ 'px';
			$endPts[1].style.left =  pathToSet[6]+ 'px';
			$endPts[1].style.top = pathToSet[7]+ 'px';
			
			
			$endPts[0]['data-x'] =  pathToSet[0];
			$endPts[0]['data-y'] = pathToSet[1]; 
			$curvePts[0]['data-x'] =  pathToSet[2];
			$curvePts[0]['data-y'] = pathToSet[3];
			$curvePts[1]['data-x'] =  pathToSet[4];
			$curvePts[1]['data-y'] = pathToSet[5];
			$endPts[1]['data-x'] =  pathToSet[6];
			$endPts[1]['data-y'] = pathToSet[7];
			
			$curve[0].path = d;
			
			// now let's draw the slopes of the begin and end of the path
			for (var i=0; i<2; i++) {
				var slope = $slopes[i];
				slope.from =  $endPts[i]['data-x'] + ', ' + $endPts[i]['data-y'] ;
				slope.to =  $curvePts[i]['data-x'] + ', ' + $curvePts[i]['data-y'] ;
				
			}
			
		}
		
		$footer.html(d);
		
		
      }
      
      function imageLoadEvent($images) {
      	var img = $images[0];
      	$('[viewBox]').each(function(i, el){
      		el.setAttribute('viewbox', '0,0,1024,1024');
      	});
      	
      	
      	$('#myShape, #curve').each(function(i, el) {
      		
      		el.coordsize = '1024, 1024';
      	})
      }

	/**
	 * Get all properties and methods in any javascript object and place them inside a 
	 * string.  Useful for debugging.
	 * 
	 * @param {Object} obj - a javascript object.
	 * @param {Object} objName - used to display an object name before properties and methods
	 * 		in the string.  Optional.
	 * @return {String} - a string containing the properties of the object
	 */
	me.getProperties = function (obj, objName)
	{
		var result = ""
		
		if (!obj) {
			return result;
		}
		
		for (var i in obj)
		{
			try {
				result += objName + "." + i.toString() + " = " + obj[i] + ", ";
			} catch (ex) {
				// nothing
			}
		}
		return result
	}
}

/* 
 * This lookup table coded with information from 
 * http://www.quirksmode.org/js/keys.html
 */
var CharCode = new function () {
	
	var me = this;

	var isOpera = window.opera != null;

	me.ALT 			= 18;
	me.BACKSPACE	= 8;
	me.CAPSLOCK		= 20;
	me.CTRL			= 17;
	me.DELETE		= 46;
	me.END			= 35;
	me.ENTER		= 13;
	me.ESCAPE		= 27;
	me.HOME 		= 36;
	me.INSERT		= 45;
	me.NUMLOCK		= 144;
	me.PAGEUP		= 33;
	me.PAGEDOWN		= 34;
	me.SHIFT		= 16;
	me.TAB			= 9;
	me.WINSTART		= 91;
	
	
	
	
	/* Function Keys */
	me.F = new Array();
	
	for (var i=1; i<=12; i++) {
		if (isOldSafari) {
			me.F[i] = 63235 + i;
		} else {
			me.F[i] = 111 + i;
		}
	}	
	
	/* Arrow keys are silly in Safari.  We only test for old safari if BrowserDetect loaded. */
	if (window.BrowserDetect) {
		var isOldSafari = BrowserDetect.browser == 'Safari' &&
	    	BrowserDetect.version < 3.1;
		if (isOldSafari) {
			me.LEFT 		= 63234;
			me.UP 			= 63232;
			me.RIGHT		= 63235;
			me.DOWN			= 63233;
			me.MACHELPDOWN  = 45;
			me.MACHELPPRESS = 45;
		} 
	} 
	
	if (!me.LEFT) {	// if is not an old version of safari or BrowserDetect not loaded 
		me.LEFT 		= 37;
		me.UP 			= 38;
		me.RIGHT		= 39;
		me.DOWN			= 40;
		
		if (isOpera) {
			me.MACHELPDOWN = 5;
			me.MACHELPPRESS = 63;
		} else {
			me.MACHELPDOWN = 6;
			me.MACHELPPRESS = 6;
		}
	}
	
	 
}	

if (!window.console) {
	window.console = {
		log:  function () {}
	}
}


/*
 * From https://gist.github.com/MathiasPaumgarten/2375726
 * Writeup: http://blog.safaribooksonline.com/2012/04/18/mapping-mouse-events-and-touch-events-onto-a-single-event/
 */
(function() {
    
    /* == GLOBAL DECLERATIONS == */
    TouchMouseEvent = {
        DOWN: "touchmousedown",
        UP: "touchmouseup",
        MOVE: "touchmousemove"
    }
   
    /* == EVENT LISTENERS == */
    var onMouseEvent = function(event) {
        var type;
        
        switch (event.type) {
            case "mousedown": type = TouchMouseEvent.DOWN; break;
            case "mouseup":   type = TouchMouseEvent.UP;   break;
            case "mousemove": type = TouchMouseEvent.MOVE; break;
            default: 
                return;
        }
        
        var touchMouseEvent = normalizeEvent(type, event, event.pageX, event.pageY);      
        $(event.target).trigger(touchMouseEvent); 
    }
    
    var onTouchEvent = function(event) {
        var type;
        
        switch (event.type) {
            case "touchstart": type = TouchMouseEvent.DOWN; break;
            case "touchend":   type = TouchMouseEvent.UP;   break;
            case "touchmove":  type = TouchMouseEvent.MOVE; break;
            default: 
                return;
        }
        
        var touch = event.originalEvent.touches[0];
        var touchMouseEvent;
        
        if (type == TouchMouseEvent.UP) 
            touchMouseEvent = normalizeEvent(type, event, null, null);
        else 
            touchMouseEvent = normalizeEvent(type, event, touch.pageX, touch.pageY);
        
        $(event.target).trigger(touchMouseEvent); 
    }
    
    /* == NORMALIZE == */
    var normalizeEvent = function(type, original, x, y) {
        return $.Event(type, {
            pageX: x,
            pageY: y,
            originalEvent: original
        });
    }
    
    /* == LISTEN TO ORIGINAL EVENT == */
    var jQueryDocument = $(document);
   
    if ("ontouchstart" in window) {
        jQueryDocument.on("touchstart", onTouchEvent);
        jQueryDocument.on("touchmove", onTouchEvent);
        jQueryDocument.on("touchend", onTouchEvent); 
    } else {
        jQueryDocument.on("mousedown", onMouseEvent);
        jQueryDocument.on("mouseup", onMouseEvent);
        jQueryDocument.on("mousemove", onMouseEvent);
    }
    
})();


/* Client-side access to querystring name=value pairs
	Version 1.2.3
	22 Jun 2005
	Adam Vandenberg
*/
function Querystring(qs, sep, eq) { // optionally pass a querystring to parse
	this.params = new Object()
	this.get=Querystring_get;
	
	if (!sep) {
		sep="&";
	}
	
	if (!eq) {
		eq="=";
	}
	
	if (qs == null)
		qs=location.search.substring(1,location.search.length)

	if (qs.length == 0) return

// Turn <plus> back to <space>
// See: http://www.w3.org/TR/REC-html40/interact/forms.html#h-17.13.4.1
	qs = qs.replace(/\+/g, ' ')
	var args = qs.split(sep) // parse out name/value pairs separated via &
	
// split out each name=value pair
	for (var i=0;i<args.length;i++) {
		var value;
		var pair = args[i].split(eq)
		var name = unescape(pair[0])

		if (pair.length == 2)
			value = unescape(pair[1])
		else
			value = name
		
		this.params[name] = value
	}
}

function Querystring_get(key, default_) {
	// This silly looking line changes UNDEFINED to NULL
	if (default_ == null) default_ = null;
	
	var value=this.params[key]
	if (value==null) value=default_;
	
	return value
}



$(document).ready(bezierEditor.init)
