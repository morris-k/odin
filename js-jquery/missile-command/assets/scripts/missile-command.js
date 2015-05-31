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
		normal: 1000/30,
		faster: 1000/60,
		fastest: 1000/90
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

	function startOpts(startState) {
		switch(startState) {
			case "endLevel": 
				initDefault();
				endLevel();
				break;
			case "withCityBonus":
				initDefault();
				score = 10000;
				rebuildScore = 10000;
				endLevel();
				break;
			case "withBonusAndHit":
				initDefault();
				score = 20000;
				rebuildScore = 20000;
				cities[0].hit = true;
				cities[3].hit = true;
				drawStatic();
				endLevel();
				break;
		}
	}

	function init(options) {
		gameSpeed = GAMESPEED.normal;
		gameState = GAMESTATE.start;
		if (options !== undefined) {
			console.log(options)
			startOpts(options);
			// initLevel();
		} else {
			ctx.font = "30px Impact";
			newGame();
		}
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

	function drawStartScreen() {
		drawCanvas();
		centerText("MISSILE COMMAND", 200);
		centerText("START", 250);
	};

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
		blackRect(0,0,canvas.width, canvas.height - 80);
		ctx.font="30px Impact";
		ctx.fillStyle = "#fff";
		centerText("Score Multiplier: " + scoreMultiplier(), 50);
		endLevelAnim();
	}

	function endLevelAnim() {
		showEndScore();
		drawUnusedTime();
	}
	var addScore = function(inc) {
			score += inc;
			showEndScore();
		}

	function drawUnusedTime() {
		var unusedMiss = unusedMissiles();
		var unusedBonus =  unusedMiss * 5 * scoreMultiplier();
		rebuildScore += unusedBonus;

		var unMissText = "Unused Missiles: " + unusedMiss;
		centerText(unMissText, 180);
		setTimeout(function() {
			var m = setInterval(function() {
				if (unusedMiss > 0) {
						addScore(1);
						unusedMiss--;
				} else {
					clearInterval(m);
					setTimeout(drawSavedCities, 1000);
				}
			}, 1);
		}, 1000);
	}

	function drawSavedCities() {
		var cityBonus = cities.filter(notHit).length * 100 * scoreMultiplier();
		rebuildScore += cityBonus;
		var savedCities = cities.filter(notHit).length;
		var sCityText = "Saved Cities: " + savedCities;
		centerText(sCityText, 230);
		setTimeout(function() {
			var m = setInterval(function() {
				if (cityBonus > 0) {
						addScore(5);
						cityBonus -= 5;
				} else {
					addRebuild();
					clearInterval(m);
					setTimeout(drawBonusCities, 1000);
				}
			}, 1);
		}, 1000);
	}

	function drawBonusCities() {
		var bCityText = "Bonus Cities Earned: " + bonusCities;
		centerText(bCityText, 280);
		var hitCities = 6 - cities.filter(notHit).length
		if (checkRebuild(hitCities) == true) {
			var m = setInterval(function() {
				if (bonusCities > 0 && hitCities > 0) {
					rebuildCity();
					cities.forEach(function(city) {
						city.draw();
					});
					blackRect(0, 250, canvas.width, 30);
					bCityText = "Bonus Cities Earned: " + bonusCities;
					centerText(bCityText, 280);
				} else {
					console.log("next")
					setTimeout(checkNextLevel, 1000);
					clearInterval(m);
				}
			}, 1000)
		} else {
			setTimeout(checkNextLevel, 1000);
		}
	}

	function checkNextLevel() {
		console.log(cities.filter(notHit).length);
		if (cities.filter(notHit).length == 0) {
			console.log("go")
			gameOver();
		} else {
			console.log("nl")
			startNextLevel();
		}
	}

	function centerText(text, height) {
		ctx.fillStyle = "#fff";
		ctx.fillText(text, centerTextX(text), height);
	}

	function addRebuild() {
		while (rebuildScore >= 10000) {
			bonusCities += 1;
			rebuildScore -= 10000;
		}
	}

	function checkRebuild(hitCities) {
		if (bonusCities > 0 && hitCities > 0) {
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
		ctx.fillStyle = "#ff0";
		ctx.beginPath(); 
		ctx.moveTo(this.x - 25, this.y);
		ctx.lineTo(this.x, this.y - 10);
		ctx.lineTo(this.x + 25, this.y);
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.fillStyle = "#0ff";
		if (this.hit) {
			ctx.fillStyle = "#f00";
		}
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
		ctx.moveTo(this.x - 50, this.y + 50);
		ctx.strokeStyle = "#ff0";
		ctx.fillStyle = "#ff0";
		ctx.lineTo(this.x - 25, this.y - 5);
		ctx.lineTo(this.x - 20, this.y);
		ctx.lineTo(this.x + 20, this.y);
		ctx.lineTo(this.x + 25, this.y - 5);
		ctx.lineTo(this.x + 50, this.y + 50);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		var delta = [ [21, 21], [7, 21], [-7, 20], [-21, 20],
                	[14, 14], [0, 14], [-14, 14], 
                  [-7, 7], [7, 7], [0, 0] ];
    for( var i = 0, len = this.missileCount - 1; len > i-1; len-- ) {
      x = this.x + delta[len][0];
      y = this.y + delta[len][1];
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

	IncomingMissile.prototype.draw = function() {
		if (this.state === MISSILE_STATES.moving) {
			ctx.beginPath();
			ctx.strokeStyle = this.trailColor;
			ctx.moveTo(this.startX, this.startY);
			ctx.lineTo(this.x, this.y);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.moveTo(this.x, this.y);
			ctx.arc(this.x, this.y, 2, 0, Math.PI*2);
			ctx.fill();
			ctx.closePath();
		} else if (this.state == MISSILE_STATES.expanding || this.state == MISSILE_STATES.contracting ) {
			ctx.beginPath();
			ctx.fillStyle = "#f00";
			ctx.moveTo(this.x, this.y);
			ctx.arc(this.x, this.y, this.explodeCount, 0, Math.PI*2);
			ctx.fill();
			ctx.closePath();
			explodeNearMissiles(this);
		}
	}

	function initIncoming() {
		var possTargets = randIncomingTargets();
		for (i=0; i <  10 + level; i++) {
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
		this.dx = (this.targetX - this.startX) / 10;
		this.dy = (this.targetY - this.startY) / 10;
	}
	BaseMissile.prototype = Object.create(Missile.prototype);
	BaseMissile.prototype.constructor = BaseMissile;

	BaseMissile.prototype.move = function() {
		if (this.state == MISSILE_STATES.moving && this.y <= this.targetY) {
				console.log("explode", this.x, this.y)
				this.x = this.targetX;
				this.y = this.targetY;
				this.state = MISSILE_STATES.expanding;
		}
		if (this.state == MISSILE_STATES.moving ) {
			this.x += this.dx;
			this.y += this.dy;
		} else {
			this.explode();
		}
	}

	BaseMissile.prototype.draw = function() {
		if (this.state === MISSILE_STATES.moving) {
			ctx.beginPath();
			ctx.strokeStyle = this.trailColor;
			ctx.moveTo(this.startX, this.startY);
			ctx.lineTo(this.x, this.y);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.moveTo(this.x, this.y);
			ctx.arc(this.x, this.y, 2, 0, Math.PI*2);
			ctx.fill();
			ctx.closePath();
		} else if (this.state == MISSILE_STATES.expanding || this.state == MISSILE_STATES.contracting ) {
			ctx.beginPath();
			ctx.fillStyle = "#f00";
			ctx.moveTo(this.x, this.y);
			ctx.arc(this.x, this.y, this.explodeCount, 0, Math.PI*2);
			ctx.fill();
			ctx.closePath();
			explodeNearMissiles(this);
		}
	}

	function launchMissile(targetX, targetY) {
		var base = bases[chooseBase(targetX)];
		if (base.missileCount > 0) {
			baseMissiles.push(new BaseMissile(base.x, base.y, targetX, targetY))
			base.missileCount--;
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



	function chooseBase(targetX)  {

		var baseWithMissiles = function(f, s, t) {
			if (bases[f].missileCount > 0) {
				return f;
			} else if (bases[s].missileCount > 0) {
				return s;
			} else {
				return t;
			}
		}

		var closestBase = function(targetX) {
			var closest;
			if (targetX <= canvas.width / 3) {
				closest = baseWithMissiles(0, 1, 2);
			} else if (targetX >= ((2*w) / 3)) {
				closest = baseWithMissiles(2, 1, 0);
			} else {
				closest = baseWithMissiles(1, 0, 2);
			}
			return closest;
		}

		if ( bases[0].missileCount == 0 &&
				bases[1].missileCount == 0 &&
				bases[2].missileCount == 0) {
			return -1;
		} else {
			return (closestBase(targetX));
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
		var pos = { 0: { x: 50, y: h-50},
								1: { x: 300, y: h-50},
								2: { x: 550, y: h-50},
							}
		for (j=0;j<3;j++) {
			bases.push(new Base(pos[j]));
		}
	}

	function City(options) {
		this.x = options.x;
		this.y = options.y;
		this.hit = false;
		this.rebuilding = false;
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
		drawStartScreen();
		if (gameState == GAMESTATE.start)
			$('canvas').one("click", function() {
				initDefault();
				initLevel();
			});
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
		listeners();
		bases.forEach(function(base) {
			base.missileCount = 10;
		})
		gameState = GAMESTATE.playing;
		baseMissiles = [];
		incomingMissiles = [];
		initIncoming();
		mover = setInterval(nextFrame, gameSpeed)
	}

	function nextFrame() {
		drawStatic();
		moveIncoming();
		drawIncoming();
		moveBase();
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
		resetListeners();
		endLevelScreen();
	}

	function rebuildCity() {
		var hitCities = cities.filter(function(city) { return city.hit == true; })
		var rebuilt = hitCities.shuffle()[0]
		bonusCities -= 1;
		rebuilt.hit = false;
		rebuilt.rebuilding = true;
		rebuilt.draw();
	}

	function startNextLevel() {
		level++;
		nextLevelScreen();
		setTimeout(initLevel, 1000);
	}

	function gameOver() {
		drawCanvas();
		centerText("game over", 100); 
		centerText("score: " + score, 140);
		setTimeout(newGame, 5000);
	}

	function handleSpacePress() {
	 if (gameState == GAMESTATE.playing) {
			clearInterval(mover);
			gameState = GAMESTATE.paused;
		} else if (gameState == GAMESTATE.paused) {
			mover = setInterval(nextFrame, gameSpeed);
			gameState = GAMESTATE.playing;
		}
	} 


	var resetListeners = function() {
		$(document).off('keydown');
		$('canvas').off('click');
		$("#fastforward").off('click');
	}

	var listeners = function() {
		$(document).on('keydown', function(e) {
			if (e.keyCode == 32) {
				e.preventDefault();
				handleSpacePress();
			}
		})

		$('canvas').click(function(event) {
				var targetX = (event.pageX - $(this).offset().left);
				var targetY = (event.pageY - $(this).offset().top);
				launchMissile(targetX, targetY);
		})

		$("#fastforward").click(function() {
			if (gameSpeed == GAMESPEED.normal) {
				gameSpeed = GAMESPEED.faster;
			} else if (gameSpeed == GAMESPEED.faster) {
				gameSpeed = GAMESPEED.fastest;
			} else {
				gameSpeed = GAMESPEED.normal;
			}
			if (gameState == GAMESTATE.playing) {
				clearInterval(mover);
				mover = setInterval(nextFrame, gameSpeed)
			}
		})
	}

	return {
		init: init
	}

})();

$(document).ready(function() {

	missComm.init();

});