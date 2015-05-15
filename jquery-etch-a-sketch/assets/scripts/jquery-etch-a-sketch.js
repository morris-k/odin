var etcher = (function() {
	var NORMAL = 1, RANDOM = 2;
	var mode = NORMAL;
	var gridSize, cellSize, screenSize = 400, color, opacity = false;

	$.fn.extend({

		colorIn: function() {
			var op, sCol = $(this).data('color');
			if (mode == RANDOM) {
				color = randomColor();
			} else if (mode == NORMAL) {
				color = setColor();
			}
			if (typeof $(this).data('color') == 'undefined') {
				$(this).data('color', color);
			} else if (color == '256,256,256') {
				$(this).data('passes', '10')
			}
			if (opacity == true) {
				op = setOpacity($(this));
			} else {
				op = 1;
			};
			$(this).css({
				background: colorString([color, op])
			});
		}
	});

	var randomColor = function(op) {
		var opc = (typeof op == 'undefined') ? 1 : op;
		var red, green, blue;
		red = Math.round(Math.random() * 256);
		green = Math.round(Math.random() * 256);
		blue = Math.round(Math.random() * 256);
		return [red, blue, green].join(",");
	};

	var colorString = function(arr) {
		return "rgba(" + arr.join(",") + ")";
	}

	var init = function() {
		$('.popup').hide();
		gridSize = 16;
		makeColorBar();
		newGame();
	}

	var newGame = function(){
		$('#screen').empty();
		$('.popup').hide();
		setCellSize();
		buildScreen();
		setColor();
		setupListeners();
	}

	var setCellSize = function() {
		cellSize = Math.sqrt(screenSize*screenSize / gridSize);
	};

	var makeColorBar = function() {
		var cols = [
								"256,0,0",
								"256,84,0",
								"256,128,0",
								"256,256,0",
								"0,256,0",
								"0,256,256",

								"0,0,256",
								"256,0,256",
								"128,0,128",
								"0,0,128",
								"128,0,0",
								"128,128,0",
								"0,128,0",

								"0,128,128",
								"192,192,192",
								"128,128,128",
								"256,256,256",
								"0,0,0"];
		for (var i=0; i<cols.length; i++) {
			$('.colorbar').append('<li class="colorbox" data-color=' + cols[i] + '></li>')
		};
		$.each($('.colorbox'), function(i, b) {
			$(b).addClass('inactive');
			$(b).css('background', colorString([$(b).data('color'), 1]));
		});
		$('.colorbox[data-color="0,0,0"]').removeClass('inactive').addClass('active');
	};

	var buildScreen = function() {
		var rowSize = Math.sqrt(gridSize);
		for (var i=0; i<rowSize; i++) {
			var row = "<tr>"
			for (var j=0; j<rowSize; j++) {
				row += '<td class="square" data-passes="10"></td>';
			};
			row += '</tr>';
			$('#screen').append(row);
		};
		$('.square').css({
			height: cellSize,
			width: cellSize
		})
	}

	var setColor = function() {
		return $('.colorbox.active').data('color');
	};

	var setOpacity = function(square) {
		var passesRem = $(square).data('passes');
		if ($(square).data('color') == '256,256,256') {
			$(square).data('passes', "10");
		}
		if (passesRem == "0") {
			return 1;
		} else {
			var newPasses = parseInt(passesRem) - 1;
			$(square).data('passes', newPasses);
			return (10 - (newPasses))*.1;
		}
	};

	var reset = function(newSize) {
		gridSize = newSize;
		mode = NORMAL;
		newGame();
	};



	var setupListeners = function() {
		var dragging = false;

		$('.square').on('mousedown', function() {
			dragging = true;
			$(this).colorIn();
		});
	
		$('.square').on('mouseenter', function() {
			if (dragging == true) {
				$(this).colorIn();
			}
		});

		$(document).on('mouseup', function() {
			dragging = false;
		});

		$('.colorbox').click(function() {
			$('.colorbox.active').removeClass('active').addClass('inactive');
			$('input[name*="random"]').prop('checked', false);
			mode = NORMAL,
			$(this).removeClass('inactive').addClass('active');
			setColor();
		})

		$('#reset').click(function() {
			$('.popup').show();
			$('.square').off('mouseenter');
		});

		$('#newScreen').click(function() {
			reset($('input[name*=gridSize]').val());
			$('.popup').hide();
			setupListeners();
		})

		$('#clear').click(newGame);

		$('input[name*="random"]').click(function() {
			if ($(this).prop('checked')) {
				mode = RANDOM;
			} else {
				mode = NORMAL;
			};
		});

		$('input[name*="opacity"]').click(function() {
			opacity = $(this).prop('checked');
		});
	};

	return {
		init: init,
		setupListeners: setupListeners,
		setOpacity: setOpacity
	}

})();

$(document).ready(function() {
	$(':checkbox').prop('checked', false);
	etcher.init();
	etcher.setupListeners();
});