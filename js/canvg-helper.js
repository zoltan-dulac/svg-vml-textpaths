var canvgHelpers = new function () {
	var me = this,
	$svg, debugNode,
	noIDcounter = 1;
	
	me.init = function() {
		$svg = $('svg');
		debugNode = $('#debug')[0]
		
		$svg.each(function(i, el) {
			var id = el.id;
			
			if (!id) {
				id = 'canvgHelper' + noIDcounter;
				noIDcounter++;
				el.id = id;
			}
			var $canvas = $('<canvas />').attr('data-for', id).css(
				'width', el.width,
				'height', el.height
			);
			
			$('body').append($canvas);
			
			$('#debug').html(el.outerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
			
			canvg($canvas[0], el.outerHTML)

		})
	}
}

$(document).ready(canvgHelpers.init);