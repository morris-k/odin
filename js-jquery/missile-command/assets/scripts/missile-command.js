var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext('2d');

var w = 600, 
		h = 450;
canvas.width = w;
canvas.height = h;

var missComm = (function() {

	Array.prototype.shuffle = function() {
		current = this.length - 1;
		while (current > 0) {
			temp = this[current];
			n = Math.round(Math.random()*current);
			this[current] = this[n];
			this[n] = temp;
			current--;
		}
		return this;
	}

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

	GAMESPEED = {
		normal: 5,
		faster: 3,
		fastest: 1
	}


	var bases,
			cities,
			incomingMissiles,
			baseMissiles,
			mover,
			level,
			score,
			rebuildScore,
			bonusCities,
			gameState,
			gameSpeed;


	function init(options = {}) {
		gameSpeed = GAMESPEED.normal;
		initDefault();
		incomingMissiles = [];
		endLevel();
		// if ($.type(options) != undefined) {
		// 	initDefault();
		// 	score = options.score || score;
		// 	level = options.level || level;
		// 	cities = options.cities || cities;
		// 	bases = options.bases || bases;
		// 	rebuildScore = options.rebuildScore || rebuildScore;
		// 	initLevel();
		// } else {
		// 	newGame();
		// }
	}

	function setScore(s) {
		score = s;
	}


	function drawStatic() {
		drawCanvas();
		ctx.fillStyle = "#ff0";
		ctx.fillRect(0, h-40, canvas.width, 40);
		bases.forEach(function(base) {
			base.draw();
		});
		cities.forEach(function(city) {
			city.draw();
		});
	}

	function drawScore() {
		ctx.beginPath();
		ctx.font="20px Impact";
		ctx.fillStyle = "#fff";
		ctx.fillText("Score: " + score,10,20);
		ctx.closePath();
	}

	function centerTextX(text) {
		var tw = ctx.measureText(text).width;
		return((canvas.width / 2) - (tw / 2))
	}

	function endLevelScreen() {
		blackRect(0,0,canvas.width, canvas.height - 50);
		ctx.font="30px Impact";
		ctx.fillStyle = "#fff";
		centerText("Score Multiplier: " + scoreMultiplier(), 50);
		endLevelAnimator();
	}

	function endLevelAnimator() {
		var unusedMiss = unusedMissiles();
		var unusedBonus =  unusedMiss * 5 * scoreMultiplier();
		rebuildScore += unusedBonus;
		var unMissText = "Unused Missiles: " + unusedMiss;

		var savedCities = cities.filter(notHit).length;
		var cityBonus = savedCities * 100 * scoreMultiplier();

		rebuildScore += cityBonus;
		var sCityText = "Saved Cities: " + savedCities;

		showEndScore();
		var addScore = function(n, inc) {
			if (n > 0) {
				score += inc;
				showEndScore();
				n -= inc;
			}
			return n;
		}

		var unusedTime = function() {
			centerText(unMissText, 180);
			var i = unusedBonus;
			setTimeout(function() {
				var x = setInterval(function() {
					if (i > 0) {
						i = addScore(i, 3);
					}
					if (i == 0) {
						clearInterval(x);
						setTimeout(scTime, 2000);
					}
				}, 1);
			}, 500);
		};

		var scTime = function() {
			centerText(sCityText, 210);
			var s = cityBonus;
			setTimeout(function() {
				var y = setInterval(function() {
					if (s > 0) {
						s = addScore(s, 5);
					}
					if (s<= 0) {
						clearInterval(y);
						if (checkRebuild() == true) {
							addRebuild();
							setTimeout(showRebuild, 1000);
						} else {
							setTimeout(startNextLevel, 1000);
						}
					}
				}, 1);
			}, 500);
		};

		var showRebuild = function() {
			console.log("rebuild");
		}


		var timer = function() {
			setTimeout(unusedTime, 1000);
		}
		timer();
	}

	function centerText(text, height) {
		ctx.fillStyle = "#fff";
		ctx.fillText(text, centerTextX(text), height);
	}

	function addRebuild() {
		var hitCities = cities.filter(function(city) {return(city.hit == true)})
		var numRebuild = Math.abs(bonusCities - hitCities.length);
		while (rebuildScore > 10000) {
			bonusCities += 1;
			rebuildScore -= 10000;
		}
	}

	function checkRebuild() {
		var hitCities = cities.filter(function(city) {return(city.hit == true)})
		if (bonusCities > 0 && hitCities.length > 1) {
			return true;
		} else {
			return false;
		}
	}

	function showEndScore() {
		var sT = "Score: " + score;
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 70, canvas.width, 40);
		ctx.fillStyle = "#fff";
		centerText(sT, 100);
	}

	function blackRect(startx, starty, width, height) {
		ctx.fillStyle = "#000";
		ctx.fillRect(startx, starty, width, height);
	}



	function nextLevelScreen() {
		var sM = scoreMultiplier();
		blackRect(0, 0, canvas.width, canvas.height - 100);
		ctx.fillStyle = "#fff";
		var levText = "Level " + level;
		ctx.fillText(levText, 200, 200);
	}

	function drawCanvas() {
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

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

	City.prototype.draw = function() {
		ctx.beginPath(); 
		ctx.fillStyle = "#ff0";
		if (this.hit) {
			ctx.fillStyle = "#f00";
		}
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

	function IncomingMissile(x, target, delay) {
		Missile.call(this, { x: x,
									 y: -10,
									 color: "#f00",
									 trailColor: "#fff",
									 targetX: target.x,
									 targetY: target.y});
		this.target = target;
		this.delay = delay;
		speed = 600 - level*30;
		this.dx = (this.targetX - this.x) / speed;
		this.dy = (this.targetY - this.y) / speed;
	}

	IncomingMissile.prototype = Object.create(Missile.prototype);
	IncomingMissile.prototype.constructor = IncomingMissile;

	IncomingMissile.prototype.move = function() {
		if (this.delay > 0) {
			this.delay--;
		}
		if (this.state == MISSILE_STATES.moving && this.y >= this.targetY) {
			if (this.target.hit == false) {
				this.target.hit = true;
				if (this.target instanceof Base) {
					this.target.missileCount = 0;
				}
			}
				this.state = MISSILE_STATES.expanding;
		} 
		if (this.state == MISSILE_STATES.moving && this.delay == 0) {
			this.x += this.dx;
			this.y += this.dy;
		} else {
			this.explode();
		}
	}	

	function initIncoming() {
		var possTargets = randIncomingTargets();
		for (i=0; i < 10 + level; i++) {
			var sX = Math.floor(Math.random() * canvas.width);
			var delay = Math.round(Math.random()*200);
			var target = possTargets.shuffle()[0];
			incomingMissiles.push(new IncomingMissile(sX, target, delay));
		}
	}


	function notHit(bc) {
		return(bc.hit == false);
	}

	function randIncomingTargets() {
		var possTargets = bases.filter(notHit);
		possTargets = possTargets.concat(cities.filter(notHit).shuffle().slice(0, 3))
		return(possTargets);
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
		this.dx = (this.targetX - this.x) / 10;
		this.dy = (this.targetY - this.y) / 10;
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
		$.each(incomingMissiles, function(i, missile) {
			if (missile.state == MISSILE_STATES.moving &&
					Math.abs(missile.x - expMiss.x) <= expMiss.explodeCount &&
					Math.abs(missile.y - expMiss.y) <= expMiss.explodeCount) {
				missile.state = MISSILE_STATES.expanding;
				score += 25*scoreMultiplier();
				rebuildScore += 25*scoreMultiplier();
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


	function newGame() {
		gameState = GAMESTATE.start;
		initDefault();
		initLevel();
	}

	function initDefault() {
		level = 1;
		score = 0;
		rebuildScore = 0;
		bonusCities = 0;
		bases = [];
		cities = [];
		initBases();
		initCities();
		drawStatic();
	}

	function initLevel() {
		gameState = GAMESTATE.playing;
		bases.forEach(function(base) {
			base.missileCount = 10;
		})
		baseMissiles = [];
		incomingMissiles = [];
		initIncoming();
		mover = setInterval(nextFrame, gameSpeed*10)
	}

	function nextFrame() {
		drawStatic();
		moveMissiles();
		drawIncoming();
		drawBase();
		drawScore();
		checkLevelEnd();
	}

	function scoreMultiplier() {
		if (level <= 10) {
			return (Math.round(level / 2));
		} else {
			return 6;
		}
	}

	function unusedMissiles() {
		var unusedBase = 0;
		bases.forEach(function(base) {
			unusedBase += base.missileCount;
		});
		return unusedBase;
	}

	function checkLevelEnd() {
		if (incomingMissiles.length == 0) {
			endLevel();
		};
	}

	function endLevel() {
		clearInterval(mover);
		if (cities.filter(notHit).length == 0) {
			gameOver()
		} else {
			endLevelScreen();
			level += 1;
		}
	}

	function rebuildCity() {
		var hitCities = cities.filter(function(city) { return city.hit == true; })
		hitCities.shuffle()[0].hit = false;
	}

	function startNextLevel() {
		nextLevelScreen();
		setTimeout(initLevel, 5000);
	}

	function gameOver() {
		drawCanvas();
		ctx.fillText("game over", 100, 100); 
	}

	function handleSpacePress() {
	 if (gameState == GAMESTATE.playing) {
			clearInterval(mover);
			gameState = GAMESTATE.paused;
		} else if (gameState == GAMESTATE.paused) {
			mover = setInterval(nextFrame, gameSpeed*10);
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
			if (gameState == GAMESTATE.playing) {
				var coords = canvas.relMouseCoords(e);
				var targetX = coords.x;
				var targetY = coords.y;
				base = chooseBase(targetX);
				if (base.missileCount > 0) {
					baseMissiles.push(new BaseMissile(base.x, base.y - 25, targetX, targetY))
					base.missileCount -= 1;
				}
			}
		})

		$("#fastforward").click(function() {
			if (gameSpeed == GAMESPEED.normal) {
				gameSpeed = GAMESPEED.faster;
			} else if (gameSpeed == GAMESPEED.faster) {
				gameSpeed = GAMESPEED.fastest;
			} else {
				gameSpeed = GAMESPEED.normal;
			}
			clearInterval(mover);
			mover = setInterval(nextFrame, gameSpeed*10)
		})
	}

	return {
		init: init,
		listeners: listeners
	}

})();

$(document).ready(function() {

	missComm.init({score: 10000, rebuildScore: 10000});
	missComm.listeners();
});