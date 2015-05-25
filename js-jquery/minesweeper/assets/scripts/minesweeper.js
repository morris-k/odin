var Minesweeper = (function() {

	$.fn.findCell = function() {
		return(cells[$(this).data('position')]);
	}

	$.fn.update = function(newState) {
		if (newState == CELL_STATES.open) {
			$(this).attr('src', imageSource($(this).findCell()));
		}
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
		suspect: 3
	}

	var boardSize,
			cells,
			mineCount;


	function init() {
		boardSize = [9, 9];
		mineCount = 0;
		initCells();

	};

	function isValidPosition(position) {
		return(position[0] > -1 &&
						position[0] < boardSize[0] &&
						position[1] > -1 &&
						position[1] < boardSize[1]);
	}

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

	function cellFromIndex(index) {
		return(cells[index]);
	}

	function imageSource(cell) {
		console.log(cell.nearMines);
		var root = "assets/images/";
		if (cell.state == CELL_STATES.closed) {
			return (root + "closed.png");
		} else if (cell.state == CELL_STATES.open) {
			console.log("open");
			if (cell.mined == true) {
				return(root + 'mine-show.png');
			} else {
				return (root + cell.nearMines + ".png");
			}
		}
	}

	function linPos(position) {
		var x = position[0];
		var y = position[1];
		return(y*boardSize[1] + x);
	}

	function initCells() {
		cells = [];
		for (i=0; i<boardSize[1]; i++) {
			var r = "<tr class='grid-row'>"
			for (j=0; j<boardSize[0]; j++) {
				r += "<td><img class='cell' data-status=" + CELL_STATES.closed + " data-position=" + linPos([j, i]) + " src='assets/images/closed.png'></td>";
				cells.push(new Cell({state: CELL_STATES.closed, x: j, y: i, position: linPos([j, i])}));
			}
			$("tbody").append(r + "</tr>");
		};
		$("#board").css({
			'width': boardSize[1]*16,
			'height': boardSize[0]*16
		});
	};	

	function initMines($firstCell) {
		var firstInd = parseInt($firstCell.data('position'));
		var mining = cells.slice(0, firstInd).concat(cells.slice(firstInd + 1)).shuffle();
		mineCount = 10;
		var minedCells = [];
		for (i=0; i<mineCount; i++) {
			minedCell = mining.shift();
			minedCell.mined = true;
			minedCells.push(minedCell);
		}
		console.log(minedCells);
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

	function handleOpen(cell, $cell) {
		if (cell.mined == false && cell.nearMines > 0) {
			cell.update(CELL_STATES.open);
			$cell.update(CELL_STATES.open);
		} else if (cell.mined == false && cell.nearMines == 0) {
			cell.update(CELL_STATES.open);
			$cell.update(CELL_STATES.open);
			handleMultipleOpen(cell, $cell);
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

	function handleCellClick($cell) {
		var cell = $cell.findCell();
		if (mineCount == 0) {
			initMines($cell);
			handleOpen(cell, $cell);
		} else if (cell.state == CELL_STATES.closed) {
			handleOpen(cell, $cell);
		}
	}

	function listeners() {
		$('.cell').click(function() {
			handleCellClick($(this));
		});
	}

	return {
		init: init, 
		listeners: listeners
	}

})();


$(document).ready(function() {
	Minesweeper.init();
	Minesweeper.listeners();
})