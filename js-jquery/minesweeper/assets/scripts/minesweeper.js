var Minesweeper = (function() {

	$.fn.findCell = function() {
		return(cells[$(this).data('position')]);
	}

	$.fn.update = function(newState) {
		var cell = $(this).findCell()
		$(this).attr('src', imageSource(cell));
	}

	var toTime = function(num) {
		var hours, minutes, seconds;

		function divHours(num) {
			if (num >= 3600) {
				hours = (num - (num % 3600)) / 3600;
				num -= hours*3600;
			} else {
				hours = 0;
			}
			return(num);
		}

		function divMinutes(num) {
			if (num >= 60) {
				minutes = (num - (num % 60)) / 60;
				num -= minutes*60;
			} else {
				minutes = 0;
			}
			return(num);
		}

		function padded(time) {
			var t;
			time < 10 ? t = "0" + time : t = time;
			return(t);
		}

		function formatTime() {
			var s;
			hours == 0 ? s : s = hours + ":"
			var formMins = padded(minutes) + ":";
			var formSec = padded(seconds);
			return([s, formMins, formSec].join(""));
		}

		num = divHours(num);
		seconds = divMinutes(num);

		return(formatTime());
	};

	var showTime = function() {
		$('#timer').text(toTime(gameTime));
	}

	Array.prototype.shuffle = function() {
		c = this.length - 1;
		while (c > 0) {
			rand = Math.round(Math.random()*(c));
			t = this[c];
			this[c] = this[rand];
			this[rand] = t;
			c -= 1;
		}
		return this;
	}

	CELL_STATES = {
		closed: 0,
		open: 1,
		flagged: 2,
		marked: 3,
	}

	BOARD_OPTS = {
		"beginner": {boardSize: [9, 9], mineCount: 10},
		"intermediate": {boardSize: [16, 16], mineCount: 40},
		"expert": {boardSize: [30, 16], mineCount: 99}
	}

	var boardSize,
			cells = null,
			mineCount,
			minedCells,
			timer,
			gameTime,
			currentType = BOARD_OPTS["beginner"];


	function init() {
		currentType = BOARD_OPTS["beginner"];
		newGame();
		listeners();
	};

	function newGame() {
		gameTime = 0;
		showTime();
		$("#newmenu").hide();
		$('#board tbody').empty();
		boardSize = currentType.boardSize;
		mineCount = currentType.mineCount;
		minesSet = false;
		gameTop();
		initCells();
	};

	function gameTop() {
		$('#minecount').text(mineCount);
		$('#smiley').find('img').attr('src', "assets/images/smiley-default.png");
	};

	function Cell(options) {
		this.state = options.state;
		this.x = options.x;
		this.y = options.y;
		this.position = options.position;
		this.mined = false;
		this.nearMines = 0;
	};

	Cell.prototype.findCell = function() {
		return($('.cell').eq(this.position));
	}

	Cell.prototype.update = function(newState) {
		this.state = newState;
	}

	Cell.prototype.neighborIndexes = function() {
		return([[this.x + 1, this.y + 1],
						[this.x + 1, this.y - 1],
						[this.x - 1, this.y + 1],
						[this.x - 1, this.y - 1],
						[this.x, this.y + 1],
						[this.x, this.y - 1],
						[this.x + 1, this.y],
						[this.x - 1, this.y]].filter(isValidPosition).map(linPos));
	}

	function isValidPosition(position) {
		return(position[0] > -1 &&
					 position[0] < boardSize[0] &&
					 position[1] > -1 &&
					 position[1] < boardSize[1]);
	}

	function cellFromIndex(index) {
		return(cells[index]);
	}

	function imageSource(cell) {
		var root = "assets/images/";
		var src;
		switch(cell.state) {
		case CELL_STATES.closed:
			src = "closed.png";
			break;
		case CELL_STATES.open:
			if (cell.mined == true) {
				src = 'mine-show.png';
			} else {
				src = cell.nearMines + ".png";
			}
			break;
		case CELL_STATES.flagged:
			src = 'flagged.png';
			break;
		case CELL_STATES.marked: 
			src = 'marked.png';
			break;
		}
		return(root + src);
	}

	function setImage($cell, filename) {
		$cell.attr('src', "assets/images/" + filename + ".png");
	}

	function showAllReal() {
		var cell;
		cells.forEach(function(cell) {
			$cell = cell.findCell();
			if (cell.mined == false) {
				if (cell.state == CELL_STATES.flagged) {
					setImage($cell, 'flagged-wrong');
					return;
				} else if (cell.state == CELL_STATES.marked) {
					setImage($cell, 'marked-show');
					return;
				}
			} else if (cell.mined == true) {
				if (cell.state == CELL_STATES.closed) {
					setImage($cell, 'mine-show');
				}
			}
		})
	}

	function linPos(position) {
		var x = position[0];
		var y = position[1];
		return(y*boardSize[0] + x);
	}

	function initCells() {
		cells = [];
		for (i=0; i<boardSize[1]; i++) {
			var r = "<tr class='grid-row'>"
			for (j=0; j<boardSize[0]; j++) {
				r += "<td><img class='cell' data-status=" + CELL_STATES.closed + " data-position=" + linPos([j, i]) + " src='assets/images/closed.png'></td>";
				cells.push(new Cell({state: CELL_STATES.closed, x: j, y: i, position: linPos([j, i])}));
			}
			$("#board tbody").append(r + "</tr>");
		};
		var bw = $("#board").width();
		$(".container").css({
			'width': bw + 2,
			'height': boardSize[1]*16 + 80,
			'margin': '0 auto',
			'margin-top': '2em'
		});
	};	

	function initMines($firstCell) {
		var firstInd = parseInt($firstCell.data('position'));
		var mining = cells.slice(0, firstInd).concat(cells.slice(firstInd + 1)).shuffle();
		minedCells = [];
		for (i=0; i < mineCount; i++) {
			minedCell = mining.shift();
			minedCell.mined = true;
			minedCells.push(minedCell);
		}
		setNearMines(minedCells);
	};

	function setNearMines(minedCells) {
		minedCells.forEach(function(cell) {
			var neighbors = cell.neighborIndexes();
			neighbors.forEach(function(cellInd) {
				neighbor = cells[cellInd];
				if (neighbor.mined == false) {
					neighbor.nearMines += 1;
				}
			});
		});
	}

	function updateCells(cell, $cell, state) {
		cell.update(state);
		$cell.update(state);
	}

	function handleOpen(cell, $cell) {
		if (cell.mined == false && cell.nearMines > 0) {
			updateCells(cell, $cell, CELL_STATES.open);
		} else if (cell.mined == false && cell.nearMines == 0) {
			updateCells(cell, $cell, CELL_STATES.open);
			handleMultipleOpen(cell, $cell);
		} else if (cell.mined) {
			cell.update(CELL_STATES.open);
			setImage($cell, 'mine-hit');
			lose();
		}
	}

	function handleMultipleOpen(cell, $cell) {
		var neighbors = cell.neighborIndexes().map(cellFromIndex);
		neighbors.forEach(function(neighbor) {
			if (neighbor.state == CELL_STATES.closed && neighbor.mined == false) {
				$nCell = neighbor.findCell();
				handleOpen(neighbor, $nCell);
			}
		});
	}

	function isMined(cell) {
		return(cell.mined);
	}

	function isNotOpen(cell) {
		return(cell.state != CELL_STATES.open);
	}

	function isFlagged(cell) {
		return(cell.state == CELL_STATES.flagged)
	}


	function checkForWin() {
		// all mined cells are flagged
		var flaggedCells = cells.filter(isFlagged);
		if (flaggedCells.filter(isMined).length == minedCells.length) {
			win();
			return;
		}
	}

	function handleRight(cell, $cell) {
		if (cell.state == CELL_STATES.closed && mineCount > 0) {
			updateCells(cell, $cell, CELL_STATES.flagged);
			mineCount -= 1;
		} else if (cell.state == CELL_STATES.flagged) {
			updateCells(cell, $cell, CELL_STATES.marked);
			mineCount += 1;
		} else if (cell.state == CELL_STATES.marked) {
			updateCells(cell, $cell, CELL_STATES.closed);
		}
	}

	function handleCellClick(clickType, $cell) {
		var cell = $cell.findCell();
		if (minesSet == false) {
			minesSet = true;
			initMines($cell);
			startTime();
		} 
		if (clickType == 1) {
			if (cell.state == CELL_STATES.closed) {
				handleOpen(cell, $cell);
			}
		} else if (clickType == 3) {
			handleRight(cell, $cell);
			$("#minecount").text(mineCount);
		}
		checkForWin();
	}

	function incTime() {
		gameTime += 1;
		showTime();
	}

	function startTime() {
		timer = setInterval(incTime, 1000);
	}

	function stopTime() {
		clearInterval(timer);
	}

	function lose() {
		$('.cell').on('mouseup', function() {
			$("#smiley").find('img').attr('src', 'assets/images/smiley-lose.png');
		});
		showAllReal();
		gameOver();
	}

	function win() {
		$('.cell').on('mouseup', function() {
			$("#smiley").find('img').attr('src', 'assets/images/smiley-win.png');
		});
		gameOver();
	};

	function gameOver() {
		$('.cell').off('mousedown');
		stopTime();
	}

	function reset() {
		resetListeners();
		gameOver();
		$('#board tbody').empty();
		newGame();
		listeners();
	}



	function listeners() {

		$('.cell').on('mousedown', function(e) {
			handleCellClick(e.which, $(this));
			$("#smiley").find('img').attr('src', 'assets/images/smiley-click.png');
		});

		$('.cell').on('mouseup', function() {
			$("#smiley").find('img').attr('src', 'assets/images/smiley-default.png');
		});

		$('#board').on('contextmenu', function() {
			return false;
		});

		$("#smiley").click(function() {
			reset();
		});

		$('#newgame').click(function() {
			stopTime();
			$('input[type="radio"]').removeAttr('checked');
			$("#newmenu").show();
		});

		$("#newmenu-cancel").click(function(e) {
			e.preventDefault();
			startTime();
			$("#newmenu").hide();
		});

		$("#newmenu-submit").click(function(e) {
			e.preventDefault();
			var type = $('input[name="boardopt"]:checked').val();
			if (BOARD_OPTS.hasOwnProperty(type)) {
				currentType = BOARD_OPTS[type];
				reset();
				$("#newmenu").hide();
			} else if (type == "custom") {
				var bw = parseInt($('input[name="boardWidth"]').val());
				var bh = parseInt($('input[name="boardHeight"]').val());
				var nm = parseInt($('input[name="mines"]').val());
				if (bw <= 30 && bw >= 9 && bh <= 24 && bh >= 9 && nm <= 668 && nm < bh*bw && nm >= 10 ) {
					currentType = {boardSize: [bw, bh], mineCount: nm}
					reset();
					$("#newmenu").hide();
				}
			}
		});

	}

	function resetListeners() {
		$('*').off('click');
		$('#board').off('contextmenu');
		$('.cell').off('mousedown');
		$('.cell').off('mouseup');
	}

	return {
		init: init
	}

})();


$(document).ready(function() {
	Minesweeper.init();
})