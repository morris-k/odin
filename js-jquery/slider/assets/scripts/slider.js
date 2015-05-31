$(document).ready(function() {

	var imageFiles = ['diamond.png', 'grid.png', 'swirls.jpg', 'tibet.jpg'];

	function slider() {

		var currentIndex, pictures, move;
		var right = true;
		var left = false;

		var initImages = function() {
			pictures = imageFiles.map(function(file) { return('assets/images/' + file); });
		};

		var stepImageForward = function() {
			currentIndex = nxt();
		};

		var stepImageBack = function() {
			currentIndex = prev();
		}

		var prev = function() {
			if (currentIndex == 0) {
				return(pictures.length - 1);
			} else {
				return(currentIndex + 1);
			}
		}

		var nxt = function() {
			if (currentIndex == pictures.length - 1) {
				return(0);
			} else {
				return(currentIndex + 1);
			}
		}

		var current = function() {
			return(currentIndex);
		}

		var setImages = function() {
			console.log(currentIndex)
			$('.current-image').attr('src', pictures[current()]);
			$('.next-image').attr('src', pictures[nxt()]);
			$('.prev-image').attr('src', pictures[prev()]);
		}

		function slide() {
			if (right = true) {
				$('.next-image').css({
					'z-index': '2'
				})
				$('.current-image').hide('slide', 1000);
				$('.next-image').show('slide', 1000);
			} else {
				stepImageBack();
				setImages();
			}
		}


		initImages();
		currentIndex = 0;
		setImages();
		move = setInterval(slide, 5000)

		$('.carousel').hover(function () {
			clearInterval(move);
		}, function() {
			move = setInterval(slide, 5000)
		});


		$('.left').click(function() {
			clearInterval(move);
			left = true;

		})
		

	};

	slider();

});