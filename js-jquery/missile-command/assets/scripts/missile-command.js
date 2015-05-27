var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext('2d');

var w = 600, 
		h = 500;
canvas.width = w;
canvas.height = h;

MISSILE_STATES = {
	moving: 0,
	exploding: 1,
	imploding: 2,
	exploded: 3
}

var missComm = (function() {

	var bases,
			cities,
			missiles = [],
			mover,
			level;


	function init() {
		newGame();
	}

	function newGame() {
		bases = [];
		cities = [];
		missiles = [];
		level = 1;
		initBases();
		initCities();
		initLevel();
	}

	function initLevel() {
		mover = setInterval(draw, 50)
	}

	function draw() {
		drawCanvas();
		bases.forEach(function(base) {
			base.draw();
		});
		cities.forEach(function(city) {
			city.draw();
		})
		moveMissiles();
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
		this.targetX = options.target[0];
		this.targetY = options.target[1];

		this.state = MISSILE_STATES.moving;
		this.explodeCount = 0;
	};

	Missile.prototype.move = function() {
		if (!this.hitTarget()) {
			this.x += this.dx;
			this.y += this.dy;
		} else {

			console.log("Target reached");
			this.explode();
		}	
	}	

	function notExploded(missile) {
		return(missile.state != MISSILE_STATES.exploded);
	}

	Missile.prototype.explode = function() {
		console.log(this.state);
		if (this.state == MISSILE_STATES.moving) {
			console.log("now exploding");
			this.state = MISSILE_STATES.exploding;
		} else if (this.state == MISSILE_STATES.exploding) {
			if (this.explodeCount < 20) {
				console.log("exploding", this.explodeCount);
				this.explodeCount += 5;
			} else {
				console.log("now imploding");
				this.state = MISSILE_STATES.imploding;
			}
		} else if (this.state == MISSILE_STATES.imploding) {
			if (this.explodeCount > 0) {
				console.log("imploding", this.explodeCount)
				this.explodeCount -= 5;
			} else {
				console.log("now exploded");
				this.state = MISSILE_STATES.exploded;
				missiles = missiles.filter(notExploded);
			}
		}
	}

	Missile.prototype.draw = function() {
		ctx.beginPath();
		if (this.state == MISSILE_STATES.moving) {
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, 5, 0, Math.PI*2);
		} else {
			ctx.fillStyle = "#f00";
			ctx.arc(this.x, this.y, this.explodeCount, 0, Math.PI*2);
		}
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.strokeStyle = this.trailColor;
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
		ctx.closePath();
	}

	function IncomingMissile(x, y, target) {
		Missile.call(this, { x: x,
									 y: y,
									 color: "#f00",
									 trailColor: "#fff",
									 target: target });
	}

	IncomingMissile.prototype = Object.create(Missile.prototype);

	function BaseMissile(x, y, target) {
		Missile.call(this, { x: x,
									 y: y,
									 color: "#fff",
									 trailColor: "#fff",
									 target: target });
		this.dx = (this.targetX - this.x) / 50;
		this.dy = (this.targetY - this.y) / 50;
	}
	BaseMissile.prototype = Object.create(Missile.prototype);

	BaseMissile.prototype.hitTarget = function() {
		return(this.y <= this.targetY);
	}




	function Base(options) {
		this.x = options.x;
		this.y = options.y;
		this.missileCount = 10;
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
		missiles.forEach(function(missile) {
			missile.move();
			missile.draw();
		})
	}

	var missileHandlers = function() {
		$(canvas).click(function(e) {
			coords = canvas.relMouseCoords(e);
			target = [coords.x, coords.y];
			i = new BaseMissile(canvas.width/2, canvas.height, target);
			missiles.push(i);
		})
	}

	return {
		init: init,
		missileHandlers: missileHandlers
	}

})();

$(document).ready(function() {

	missComm.init();
	missComm.missileHandlers();
});