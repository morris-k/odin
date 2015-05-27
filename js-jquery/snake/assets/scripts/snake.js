var Snake = (function() {

	Array.prototype.add = function(arr) {
		this[0] += arr[0];
		this[1] += arr[1];
		return(this)
	}

	DIRS = {
			"r": [1, 0],
			"l": [-1, 0],
			"u": [0, -1],
			"d": [0, 1]
	}

	KEYCODES = {
		39: "r",
		37: "l",
		38: "u",
		40: "d"
	}

	OPP = {
		"r": "l",
		"l": "r",
		"u": "d",
		"d": "u"
	}

	GAMESTATE = {
		playing: 0,
		paused: 1,
		over: 2,
		start: 3
	}

	$.fn.gridInd = function() {
		return(linPos([this.data('row'), this.data('col')]));
	}

	var squareFromInd = function(ind) {
		return(grid[ind]);
	}

	var grid,
			snake,
			mover,
			gameState,
			food,
			score;

	function init() {
		$("#startmenu").show();
		newGame();
	}

	function linPos(pos) {
		return(pos[1]*40 + pos[0]);
	}


	function initGrid() {
		grid = [];
		for (i=0; i<40; i++) {
			$("#board").append("<div class='row' id=" + i + "></div>");
			for (j=0; j<40; j++) {
				grid.push(" ");
				$('.row').last().append("<div class='square' id=" + linPos([j, i]) + "> </div>");
				$('.square').last().css({
					'left': j*10,
					'top': i*10
				})
			}
		}
	}

	function findSquare(pos) {
		return($('.square[id=' + linPos(pos) + ']'));
	}


	function newGame() {
		$("#board").empty();
		gameState = GAMESTATE.start;
		score = 0;
		initGrid();
		snake = new Snake();
		food = new Food();
		draw();
		drawFood();
		$("#gameinfo").show();
		drawScore();
	}

	function draw() {
			drawFood();
			moveSnake();
	}

	function drawScore(){
		$("#score").text("Score: " + score);
	}

	function drawFood() {
		findSquare([food.x, food.y]).css({
			"background": "#f00"
		});
	}

	function Snake() {
		this.segments = [[20, 20]];
		this.direction = "r";
		this.speed = 10;
	}

	Snake.prototype.draw = function() {
		this.segments.forEach(function(segment) {
			findSquare(segment).css({
				"background": "#000"
			});
		})
	}

	Snake.prototype.eat = function() {
		score += this.segments.length*10;
		this.segments.unshift([food.x, food.y]);
		drawScore();
		this.speed += 1;
		clearInterval(mover);
		mover = setInterval(draw, 1000/snake.speed);
		food = new Food();
	}


	function moveSnake() {
		var go = false;
		var head = snake.segments[0];
		var head_x = head[0];
		var head_y = head[1];
		head_x += DIRS[snake.direction][0];
		head_y += DIRS[snake.direction][1];
		if (head_x < 0 || 
				head_x == 40 ||
				head_y < 0 ||
				head_y == 40) {
			go = true;
			hitWall();
		} else if (head_x == food.x && head_y == food.y) {
			snake.eat();
			return;
		} else {
			snake.segments.slice(1).forEach(function(seg) {
				if (head_x == seg[0] && head_y == seg[1]) {
					go = true;
					gameOver("ran into yourself, huh?");
				}
			})
			if (go == false) {
				var tail = snake.segments.pop();
				findSquare(tail).css({
					"background": "#fff"
				});
				tail = [head_x, head_y];
				snake.segments.unshift(tail);
				snake.draw();
			}
		}
	}

	function hitWall() {
		gameOver("oops...you hit the wall");
	}

	function Food() {
		this.x = Math.round(Math.random() * 40);
		this.y = Math.round(Math.random() * 40);
	}

	function gameOver(message) {
		$(".message").text(message);
		$(".score").text("Score: " + score);
		$("#gameinfo").hide();
		$("#gameovermenu").show();
		gameState = GAMESTATE.over;
	}

	function handleSpacePress() {
		if (gameState == GAMESTATE.playing) {
			clearInterval(mover);
			gameState = GAMESTATE.paused;
		} else if (gameState == GAMESTATE.start) {
			$('#startmenu').hide()
			gameState = GAMESTATE.playing;
			mover = setInterval(draw, 1000/snake.speed);
		} else if (gameState == GAMESTATE.over) {
			$('#gameovermenu').hide()
			gameState = GAMESTATE.start;
			newGame();
		}
	}
		$(document).on("keydown", function(evt) {
			key = evt.keyCode;
			if (KEYCODES.hasOwnProperty(key)) {
				if (snake.direction != OPP[KEYCODES[key]]) {
					setTimeout(function() { snake.direction = KEYCODES[key]}, snake.speed);
				};
			} else if (key == 32) {
				handleSpacePress();
			};
		});


	return {
		init: init,
	}

})();


$(document).ready(function() {
	$("#gameovermenu").hide();
	Snake.init();
})
