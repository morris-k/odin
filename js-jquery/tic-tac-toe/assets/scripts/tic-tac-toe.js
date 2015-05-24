$.fn.extend({
	blank: function() {
		if ($(this).text() == " " || $(this).text() == "")
			return true;
		else
			return false;
		end
	}
});

transpose = function(a) {

  // Calculate the width and height of the Array
  var w = a.length ? a.length : 0,
    h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
};

var TicTacToe = (function() {

	$.fn.showValue = function() {
		this.find('p').append(this.data('value'));
	}

	TOKENS = {
		x: "X",
		y: "O",
		blank: " "
	}

	var squares,
			players,
			currentPlayer;

	function init() {
		newGame();
	}

	function Player(token) {
		this.token = token;
	}
	function newGame() {
		$('#board').empty();
		players = [new Player('X'), new Player('O')];
		currentPlayer = players.shift();
		initSquares();
	}

	function switchPlayers() {
		players.push(currentPlayer);
		currentPlayer = players.shift();
	}

	function getValues(callback) {
		var vals = [];
		for (i=0; i<9; i++) {
			vals.push($(".cell").eq(i).data('value'));
		};
		return callback(vals);
	};

	function makeRows(vals) {
		var rows = [], cols, diags;
		rows.push(vals.slice(0, 3));
		rows.push(vals.slice(3, 6));
		rows.push(vals.slice(6));
		cols = transpose(rows);
		diags = [[rows[0][0], rows[1][1], rows[2][2]],
							[rows[0][3], rows[1][1], rows[2][0]]];
		return (rows.concat(cols.concat(diags)));
	}

	function checkForWin() {
		var vals = getValues(makeRows);
		var win = false;
		$.each(vals, function(i, set) {
			var toks = 0;
			for (i=0;i<3;i++) {
				set[i] == currentPlayer.token ? toks += 1 : toks += 0
			}
			if (toks == 3){
				win = true;
			}
		})
		if (win == true) {
			return true;
		}
	};

	function checkFull() {
		var toks = 0;
		$.each($('.cell'), function(i, c) {
			if (!$(c).blank()) {
				toks += 1
			}
		})
		return(toks == 9)
	}

	function initSquares() {
		squares = [];
		var grid = "";
		for (i=0; i<3; i++) {
			for (j=0; j<3; j++) {
				grid += "<div class='cell' data-row=" + i + " data-col=" + j + "data-value=' '><p></p></div>";
			}
		}
		$('#board').append(grid);
		$('.cell').css({
			"height": $('#board').width() / 3,
			"width": $('#board').width() / 3,
		})
		$('.cell p').css({
			  'position': 'relative',
			  'top': '50%',
			  'transform': 'translateY(-50%)'
		})
		$('.cell').showValue();
	}

	function handleCellClick($cell) {
		$('.errors').empty();
		if ($cell.blank()) {
			$($cell).data('value', currentPlayer.token);
			$($cell).showValue();
			if (checkForWin()) {
				playerWins();
				return;
			} else if (checkFull()) {
				draw();
				return;
			}
			switchPlayers();
		} else {
			$('.errors').append("<p>That square is occupied!</p>")
		};
	};

	function playerWins() {
		alert("Player " + currentPlayer.token + " wins!");
		gameOver();
	}

	function draw() {
		alert("No one wins!")
		gameOver();
	}

	function gameOver() {
		newGame();
		listeners();
	}

	function listeners() {
		$('.cell').click(function() {
			handleCellClick($(this));
		})
	}

	return {
		init: init,
		listeners: listeners
	}

})();

$(document).ready(function() {
	TicTacToe.init();
	TicTacToe.listeners();
});