var myAnimation = new function () {
	var me = this,
			$myShape,
			$paths,
			pathAttr,
			$text;
	
	me.init = function () {
		
		// caching jQuery objects.
		$myShape = $('#myShape');
		$paths = $('#myShape .path');
		$text = $('#myShape text, #myShape .path')
		
		
		/* 
		 * For each of the textpaths in the page, set 
		 * the path to be the value of the data-begin
		 * attribute.
		 */
		
		$paths.each(function(i, el) {
			$(el).attr('data-begin', el.d);
		});
		
		
		
		/*
		 * Make sure we get the right attribute to change in the paths depending
		 * on if the browser is an SVG or VML one.
		 */
		if ($paths[0].getAttribute('d')) {
			pathAttr = 'd';
		} else {
			pathAttr = 'path';
		}
		
		/* 
		 * Use jQuery animate using values 0 to 1 on the 'text-indent' 
		 * attribute (which neither VML or SVG use).
		 */
		$myShape.css({
			textIndent: 0
		}).animate({
			textIndent: 1
		}, {
			duration: 1000,
			step: function (now) {
				
				$paths.each(function(i, el) {
				  
					// VML's document object model for paths is different than SVG's.
					var tween = tweenPath(now, $(el));
					if (pathAttr == 'd') {
						el.setAttribute(pathAttr, tween);
					} else {
						el.path.v = tween;
					}
					
				});
				
				/*
				 * For older IE, we have to do some extra magic to
				 * deal with IE's crappy bug with Visual Filters 
				 * and CLearType.  We only fade in for half the animation
				 * to avoid blocky looking text.   For other browsers, we just
				 * set the opacity to 'now'.
				 */
				if ($text[0].nodeName == 'shape') {
					
					// IE <= 8
					
					if (now < 0.5) {
						$text.css({
							filter: 'progid:DXImageTransform.Microsoft.Chroma(color="#666666") ' +
	          				  'progid:DXImageTransform.Microsoft.Alpha(opacity=' + (now * 100) + ');'
						});
						
					} else {
						$text.css({
							filter: 'none',
							background: 'none'
						});
						
					}
				} else {
				  
				  // Modern Browsers.
					$text.css({
						opacity: now
					});
				}
			}
		});
		
	}
	
	/*
	 * tweenPath(): returns the tweened path
	 * of an SVG/VML path at time 't'.
	 * 
	 * t is assumed to be a number between 0 and 1.
	 * 
	 * $node is a jQuery node of a SVG <path> or VML
	 * <v:shape> which alredy has a path assigned to
	 * it.  It also must have a 'data-end-d' attribute 
	 * that is set to the path we want to tween to.  
	 * This path must have the same amount of curve 
	 * and lines (and in the same order) as the original
	 * path.  For example, you can tween between:
	 * 
	 * M 5, 182 C 9, 489, 9, 479, 10, 537 L 5, 732
	 * 
	 * and
	 * 
	 * M 5  182 C 201, 479, 233, 478, 232, 529 L 232, 732
	 * 
	 * but not:
	 * 
	 * M 5  182 C 201, 479, 233, 478, 232, 529 L 232, 732
	 * 
	 * and
	 * 
	 * M 27, 32 C 190, 69, 378, 73, 508, 21
	 * 
	 */
  function tweenPath(t, $node) {
    var startPath ,
        endPath,
        startPathArr,
        endPathArr,
        tweenPathArr = [],    // return value
        startVal, endVal, val;
        
    // cache the array values if needed
    if (!(startPathArr = $node.data('startPathAttr'))) {
      
      // VML's document object model for paths is different than SVG's.
      if (pathAttr == 'd') {
        startPath = $node[0].getAttribute(pathAttr);
      } else {
        startPath = $node[0].path.v;
      }
      
      endPath = $node[0].getAttribute('data-end-d');
      startPathArr = getSplitPath(startPath);
      endPathArr = getSplitPath(endPath);
    } else {
      endPathArr = $node.data('endPathAttr');
    }
    
    for (var i=0; i<startPathArr.length; i++) {
      var isStartNum = isNumber(startPathArr[i]),
          isEndNum = isNumber(endPathArr[i]);
      if (isStartNum && isEndNum) {
        x = tweenLinear(t, startPathArr[i], endPathArr[i]);
        tweenPathArr[i] = x;
      } else if (isStartNum || isEndNum){
        
        throw('Error: startPath "' + startPath + '" and endPath "' + 
          endPath + '" do not match up for tweening.')
      } else {
        tweenPathArr[i] = startPathArr[i];
      }
    }
    
    return tweenPathArr.join(' ');
  }
	
	/*
	 * getSplitPath(): splits an VML/SVG path into an
	 * array split by the white space and commas 
	 * between in the path string.
	 */
	function getSplitPath(path) {
		
		path = path.replace(/([mMcClL])([0-9])/g, '$1 $2').replace(/[ \n\t]+/g, ' ');
		
  	r = path.split(/[,\s]+/);
  	
  	if ($.trim(r[0]) == '') {
  		r.shift();
  	}
  	
  	// let's change the values to integers if possible
  	for (var i=0; i<r[i].length; i++) {
  		var num = parseInt(r[i]);
  		if (!isNaN(num)) {
  			r[i] = num;
  		}
  	}
  	return r;
	}
	
	/*
	 * isNumber(): retuns true if the string represents
	 * a number.
	 */
	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	/*
	 * tweenLinear(): Classic tweening function.  
	 * Needed by the tweenPath() function.
	 */
	function tweenLinear(t, start, end){
    return Math.round(t * end + (1 - t) * start);
	}
}

$(window).load(myAnimation.init)
