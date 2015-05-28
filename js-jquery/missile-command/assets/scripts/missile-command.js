var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext('2d');

var w = 600, 
		h = 550;
canvas.width = w;
canvas.height = h;

GAMESTATE = {
	start: 0,
	playing: 1,
	paused: 2,
	over: 3
}

MISSILE_STATES = {
	moving: 0,
	expanding: 1,
	contracting: 2,
	exploded: 3
}



var missComm = (function() {

	var bases,
			cities,
			incomingMissiles,
			baseMissiles,
			mover,
			level,
			gameState;


	function init() {
		newGame();
	}

	function newGame() {
		gameState = GAMESTATE.start;
		bases = [];
		cities = [];
		level = 1;
		initBases();
		initCities();
		drawStatic();
		initLevel();
	}

	function initLevel() {
		gameState = GAMESTATE.playing;
		baseMissiles = [];
		incomingMissiles = [];
		initIncoming();
		mover = setInterval(nextFrame, 50)
	}

	function nextFrame() {
		drawStatic();
		moveMissiles();
		drawMissiles();
	}

	function drawStatic() {
		drawCanvas();
		bases.forEach(function(base) {
			base.draw();
		});
		cities.forEach(function(city) {
			city.draw();
		})
	}

	function drawCanvas() {
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#ff0";
		ctx.fillRect(0, h-40, canvas.width, 40);
	};

	City.prototype.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = "#ff0";
		ctx.moveTo(this.x - 25, this.y);
		ctx.lineTo(this.x, this.y - 10);
		ctx.lineTo(this.x + 25, this.y);
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.fillStyle = "#0ff";
		ctx.strokeStyle = "#00f"
		ctx.moveTo(this.x - 20, this.y - 2);
		ctx.lineTo(this.x - 18, this.y - 6);
		ctx.lineTo(this.x - 15, this.y - 6);
		ctx.lineTo(this.x - 10, this.y - 6);
		ctx.lineTo(this.x - 8, this.y - 10);
		ctx.lineTo(this.x + 2, this.y - 10);
		ctx.lineTo(this.x + 2, this.y - 12);
		ctx.lineTo(this.x + 7, this.y - 12);
		ctx.lineTo(this.x + 7, this.y - 10);
		ctx.lineTo(this.x + 10, this.y);
		ctx.fill();
		ctx.closePath();
	};

	Base.prototype.draw = function() {
		ctx.beginPath();
		ctx.moveTo(this.x - 50, this.y);
		ctx.strokeStyle = "#ff0";
		ctx.fillStyle = "#ff0";
		ctx.lineTo(this.x - 25, this.y - 30);
		ctx.lineTo(this.x - 20, this.y - 25);
		ctx.lineTo(this.x + 20, this.y - 25);
		ctx.lineTo(this.x + 25, this.y - 30);
		ctx.lineTo(this.x + 50, this.y);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		var delta = [ [21, 21], [7, 21], [-7, 20], [-21, 20],
                	[14, 14], [0, 14], [-14, 14], 
                  [-7, 7], [7, 7], [0, 0] ];
    for( var i = 0, len = this.missileCount - 1; len > i-1; len-- ) {
      x = this.x + delta[len][0];
      y = this.y + delta[len][1] - 20;
      ctx.fillStyle = 'blue';
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo( x, y );
      ctx.lineTo( x + 3, y + 7 );
      ctx.lineTo( x-3, y + 7  );
      ctx.lineTo( x, y );
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(x-2, y+7);
      ctx.lineTo(x-2, y+9);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x+2, y+7);
      ctx.lineTo(x+2, y+9);
      ctx.stroke();
    }

	}

	function Missile(options) {
		this.x = options.x;
		this.y = options.y;
		this.startX = this.x;
		this.startY = this.y;
		this.color = options.color;
		this.trailColor = options.trailColor;
		this.targetX = options.targetX;
		this.targetY = options.targetY;

		this.state = MISSILE_STATES.moving;
		this.explodeCount = 0;
	};


	function notExploded(missile) {
		return(missile.state !== MISSILE_STATES.exploded);
	}

	Missile.prototype.explode = function() {
		if (this.state == MISSILE_STATES.expanding) {
			this.explodeCount += 1;
		}
		if (this.explodeCount >= 20) {
			this.state = MISSILE_STATES.contracting;
		}
		if (this.state == MISSILE_STATES.contracting) {
			this.explodeCount -= 1;
			if (this.explodeCount <= 0) {
				this.state = MISSILE_STATES.exploded;
			}
		}
	}



	Missile.prototype.draw = function() {
		if (this.state == MISSILE_STATES.moving) {
			ctx.beginPath();
			ctx.strokeStyle = this.trailColor;
			ctx.moveTo(this.startX, this.startY);
			ctx.lineTo(this.x, this.y);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, 5, 0, Math.PI*2);
			ctx.fill();
			ctx.closePath();
		} else if (this.state == MISSILE_STATES.expanding || this.state == MISSILE_STATES.contracting ) {
			ctx.beginPath();
			ctx.fillStyle = "#f00";
			ctx.arc(this.x, this.y, this.explodeCount, 0, Math.PI*2);
			ctx.fill();
			ctx.closePath();
			explodeNearMissiles(this);
		}
	}

	function IncomingMissile(x, y, targetX, targetY) {
		Missile.call(this, { x: x,
									 y: y,
									 color: "#f00",
									 trailColor: "#fff",
									 targetX: targetX,
									 targetY: targetY });

		this.dx = (this.targetX - this.x) / 1000;
		this.dy = (this.targetY - this.y) / 1000;
	}

	IncomingMissile.prototype = Object.create(Missile.prototype);
	IncomingMissile.prototype.constructor = IncomingMissile;

	IncomingMissile.prototype.move = function() {
		if (this.state == MISSILE_STATES.moving && this.y >= this.targetY) {
				this.state = MISSILE_STATES.expanding;
		} 
		if (this.state == MISSILE_STATES.moving) {
			this.x += this.dx;
			this.y += this.dy;
		} else {
			this.explode();
		}
	}	

	function initIncoming() {
		for (i=0; i < 2; i++) {
			var sX = Math.round(Math.random() * canvas.width);
			var sY = (Math.round(Math.random())) * -1;
			var target = randIncomingTarget();
			incomingMissiles.push(new IncomingMissile(sX, sY, target.x, target.y));
		}
	}


	function notHit(bc) {
		return(bc.hit == false);
	}

	function randIncomingTarget() {
		var possTargets = remainingStations();
		var target = Math.round(Math.random() * (possTargets.length - 1));
		return possTargets[target];
	}

	function remainingStations() {
		return bases.concat(cities).filter(notHit);
	}


	function BaseMissile(x, y, targetX, targetY) {
		Missile.call(this, { x: x,
									 y: y,
									 color: "#fff",
									 trailColor: "#fff",
									 targetX: targetX,
									 targetY: targetY });
		this.dx = (this.targetX - this.x) / 50;
		this.dy = (this.targetY - this.y) / 50;
	}
	BaseMissile.prototype = Object.create(Missile.prototype);
	BaseMissile.prototype.constructor = BaseMissile;

	BaseMissile.prototype.move = function() {
		if (this.state == MISSILE_STATES.moving && this.y <= this.targetY) {
				this.state = MISSILE_STATES.expanding;
		}
		if (this.state == MISSILE_STATES.moving ) {
			this.x += this.dx;
			this.y += this.dy;
		} else {
			this.explode();
		}
	}

	function explodeNearMissiles(expMiss) {
		console.log(incomingMissiles);
		$.each(incomingMissiles, function(i, missile) {
			// console.log(Math.abs(missile.x - expMiss.x));
			// console.log(expMiss.explodeCount);
			// console.log(Math.abs(missile.y - expMiss.y))
			if (missile.state == MISSILE_STATES.moving &&
					Math.abs(missile.x - expMiss.x) <= expMiss.explodeCount &&
					Math.abs(missile.y - expMiss.y) <= expMiss.explodeCount) {
				missile.state = MISSILE_STATES.expanding;
				missile.explode();
			}
		})
	}

	function closestBases(targetX) {
		if (targetX < canvas.width / 3) {
			return([0, 1, 2]);
		} else if (targetX > (canvas.width*2) / 3) {
			return([2, 1, 0]);
		} else {
			return([1, 0, 2]);
		}
	}

	function chooseBase(targetX)  {
		var order = closestBases(targetX);
		var first = bases[order[0]];
		var second = bases[order[1]];
		var third = bases[order[2]];
		if ( first.missileCount > 0) {
			return first;
		} else if ( second.missileCount > 0 ) {
			return second;
		} else {
			return third;
		}
	}


	function Base(options) {
		this.x = options.x;
		this.y = options.y;
		this.missileCount = 10;
		this.hit = false;
	}

	function initBases() {
		bases = [];
		var pos = { 0: { x: 50, y: h-30},
								1: { x: 300, y: h-30},
								2: { x: 550, y: h-30},
							}
		for (j=0;j<3;j++) {
			bases.push(new Base(pos[j]));
		}
	}

	function City(options) {
		this.x = options.x;
		this.y = options.y;
		this.hit = false;
	}

	function initCities() {
		cities = [];
		var pos = { 0: { x: 125, y: h-33 },
								1: { x: 175, y: h-37 },
								2: { x: 225, y: h-34 },
								3: { x: 375, y: h-33 },
								4: { x: 425, y: h-40 },
								5: { x: 475, y: h-35 }
							}
		for (i=0; i<6; i++) {
			cities.push(new City(pos[i]));
		}
	}
	
	function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
	        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
	        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
	    }
	  while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
	}
	
	HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

	function moveMissiles() {
		moveIncoming();
		moveBase();
	}

	function moveIncoming() {
		$.each(incomingMissiles, function(i, missile) {
			missile.move();
		})
		incomingMissiles = incomingMissiles.filter(notExploded);
	}

	function moveBase() {
		$.each(baseMissiles, function(i, missile) {
			missile.move();
		})
		baseMissiles = baseMissiles.filter(notExploded);
	}

	function drawMissiles() {
		drawIncoming();
		drawBase();
	}

	function drawIncoming() {
		$.each(incomingMissiles, function(i, missile) {
			missile.draw();
		});
	}

	function drawBase() {
		$.each(baseMissiles, function(i, missile) {
			missile.draw();
		});
	}

	function handleSpacePress() {
	 if (gameState == GAMESTATE.playing) {
			clearInterval(mover);
			gameState = GAMESTATE.paused;
		} else if (gameState == GAMESTATE.paused) {
			mover = setInterval(nextFrame, 50);
			gameState = GAMESTATE.playing;
		}
	} 

	var listeners = function() {
		$(document).on('keydown', function(e) {
			if (e.keyCode == 32) {
				e.preventDefault();
				handleSpacePress();
			}
		})

		$(canvas).click(function(e) {
			var coords = canvas.relMouseCoords(e);
			var targetX = coords.x;
			var targetY = coords.y;
			base = chooseBase(targetX);
			if (base.missileCount > 0) {
				baseMissiles.push(new BaseMissile(base.x, base.y - 25, targetX, targetY))
				base.missileCount -= 1;
			}
		})
	}
 
	function levelEnd() {
		clearInterval(mover);
	}


	return {
		init: init,
		listeners: listeners
	}

})();

$(document).ready(function() {

	missComm.init();
	missComm.listeners();
});