var carousel = (function() {

	var currentIndex, mover;
	var right = false;
	var left = true;

	var imageFiles = ['diamond.png', 'grid.png', 'swirls.jpg', 'tibet.jpg'].map(function(file) {
			return 'assets/images/' + file;
	});

	function initImages() {
		imageFiles.forEach(function(file, i) {
			$('.carousel').append('<img data-ind=' + i + ' class="main" src="' + file + '">');
			$('.indicators').append('<div class="indicator" data-ind=' + i + '></div>');
		});
		$('img').hide();
	}

	function showCurrent() {
		$('img[data-ind=' + currentIndex + ']').show();
		showIndicator();
	}

	function getNextIndex() {
		if (nextIndex == undefined) {
			return 1;
		}
		if (currentIndex == imageFiles.length - 1) {
				return 0;
		} else {
			return currentIndex + 1;
		}
	}

	function getPrevIndex() {
		if (currentIndex == 0) {
			return imageFiles.length - 1; 
		} else {
			return currentIndex - 1;
		}
	}

	function slideLeft($current, $next) {
		$current.hide('slide', 1000);
		$next.show('slide', {direction: "right"}, 1000);
	}

	function slideRight($current, $prev) {
		$current.hide('slide', {direction: "right"}, 1000);
		$prev.show('slide', 1000);
	}

	function addPreviews() {
		var $prev = $('.main').eq(getPrevIndex()).attr('src');
		var $next = $('.main').eq(getNextIndex()).attr('src');
		$('.prev').attr('src', $prev);
		$('.next').attr('src', $next);
	}

	function forward(index) {
		var nextIndex = index || getNextIndex();
		var $current = $('.main').eq(currentIndex);
		var $next = $('.main').eq(nextIndex);
		slideLeft($current, $next)
		currentIndex = nextIndex;
		setTimeout(addPreviews, 1000);
		showIndicator();
	}

	function back(index) {
		console.log("back index: ", index);
		if (index > -1) {
			prevIndex = index;
		} else {
			prevIndex = getPrevIndex();
		}
		console.log("back prev: ", prevIndex);
		var $current = $('.main').eq(currentIndex);
		var $prev = $('.main').eq(prevIndex);
		slideRight($current, $prev);
		currentIndex = prevIndex;
		setTimeout(addPreviews, 1000);
		showIndicator();
	}

	function showIndicator() {
		$('.active').removeClass("active");
		$('.indicator').eq(currentIndex).addClass('active');
	}

	function pause() {
		clearInterval(mover);
	}

	function slide() {
		mover = setInterval(forward, 5000);
	}

	function init() {
		initImages();
		currentIndex = 0;
		nextIndex = 1;
		showCurrent();
		addPreviews();
		slide();
	}


	function listeners() {
		$('.carousel').hover(pause, slide);

		$('.left').hover(function() {
			$('.prev').fadeIn('slow');
		}, function() {
			$('.prev').fadeOut('slow');
		})

		$('.right').hover(function() {
			$('.next').fadeIn('slow');
		}, function() {
			$('.next').fadeOut('slow');
		})


		$('.left').on('mousedown', function() {
			$(this).addClass('push');
			$('.prev').fadeOut('fast');
			pause();
			back();
			slide();
		}).on('mouseup', function() {
			$(this).removeClass('push');
		});

		$('.right').on('mousedown', function() {
			$(this).addClass('push');
			$('.next').fadeOut('fast');
			pause();
			forward();
			slide();
		}).on('mouseup', function() {
			$(this).removeClass('push');
		});

		$('.indicator').click(function() {
			console.log($(this).data('ind'))
			pause();
			var pos = $(this).data('ind');
			console.log(pos < currentIndex);
			if (pos < currentIndex) {
				back(pos);
			} else {
				forward(pos);
			}
			slide();
		});

	}

	return {
		init: init,
		listeners: listeners
	}
})();

$(document).ready(function() {

	carousel.init();
	carousel.listeners();

});