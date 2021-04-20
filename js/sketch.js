// SLEEP
// 
// game is designed to run at 1 ingame minute per frame at normal (1x) game speed
// 

const SEED = 42,
	RAND = SeedRandom(SEED),
	MIN_PER_DAY = 24 * 60, // 1440
	RAD_PER_MIN = (2 * Math.PI) / MIN_PER_DAY; // ~0.004363, 

const RANDP = function () {
	return RAND(100) / 100;
}

const FRAMES_PER_SEC = 60, // when 60 fps, then:
	TICK = 1000 / FRAMES_PER_SEC, // ~16,667ms
	FULL_DAY = TICK * MIN_PER_DAY; // 24 seconds irl

const SUMMER = function (v) { return max(0.1, EasingFunctions.easeOutCubic(v) * 100) },
	WINTER = function (v) { return max(0.1, EasingFunctions.easeInCubic(v) * 80) },
	SPRING = FALL = function (v) { return max(0.1, EasingFunctions.easeInOutCubic(v) * 90) };

// settings
var gameSpeed = 1,
	season = SUMMER,
	debug = true, // verbose output and display
	debugUpdateDelay = FRAMES_PER_SEC / 3; // in frames

var speedLimit = true, // fps upper limit to defined value of FRAMES_PER_SEC
	skipLimit = false, // app may stop bc of background, when false progress will updated according to deltaT 
	maxFrameSkipAmount = 1; // max amount of frames skipped 

// related time representations and references
var frameCounter = 0, // frame counter, integer increased each tick
	fpsShow = 0, // buffered value for delay	
	timeCounter = 0, // current day time normalized to distance on unit circle
	timeCounterRelative = 0, // percent of full day 
	fpsNow = 0, // true time since last frame may vary and therefore the fps
	then = Date.now(), // time reference for deltaT
	deltaT = 0; // progress in ms since last frame

var sunColor = {},
	skyColor = {};

// fonts
var fontRegular;

// buttons
var pause, play, faster, fastest;

// interior
var bed, bonsai;
function preload() {
	fontRegular = loadFont('res/Poppins-Regular.ttf');
	bed = loadImage('bed-575800_640.png');
	bonsai = loadImage('bonsai-154570_640.png');
}

function setup() {
	createCanvas(1280, 800);
	frameRate(FRAMES_PER_SEC);
	
	loadControls();
}

function draw() {
	updateDelta();
	drawSunCicle();
	//drawAllClouds();
	drawInterior();
	
	drawOutline();
	if (debug) {
		debugDisplay();
	}
}

function loadControls() {
	var xPos = 1000, p = 0, dim = 40;
	pause = createImg('img/pause.png').position(xPos + (dim * 1.5 * p++), 100).size(dim, dim);
	pause.mouseOver(controlsEventHandler).mouseOut(controlsEventHandler).mouseReleased(controlsEventHandler);
	pause.elt.draggable = false;
	pause.elt.name = "pause";
	pause.elt.speed = 0;

	play = createImg('img/play.png').position(xPos + (dim * 1.5 * p++), 100).size(dim, dim);
	play.mouseOver(controlsEventHandler).mouseOut(controlsEventHandler).mouseReleased(controlsEventHandler);
	play.elt.draggable = false;
	play.elt.name = "play";
	play.elt.speed = 1;
	play.elt.classList.toggle("selected");

	faster = createImg('img/faster.png').position(xPos + (dim * 1.5 * p++), 100).size(dim, dim);
	faster.mouseOver(controlsEventHandler).mouseOut(controlsEventHandler).mouseReleased(controlsEventHandler);
	faster.elt.draggable = false;
	faster.elt.name = "faster";
	faster.elt.speed = 2;

	fastest = createImg('img/fastest.png').position(xPos + (dim * 1.5 * p++), 100).size(dim, dim);
	fastest.mouseOver(controlsEventHandler).mouseOut(controlsEventHandler).mouseReleased(controlsEventHandler);
	fastest.elt.draggable = false;
	fastest.elt.name = "fastest";
	fastest.elt.speed = 4;
}

function controlsEventHandler(event) {
	switch (event.type) {
		case 'mouseover':
			event.target.classList.toggle("shadow");
			break;
		case 'mouseout':
			event.target.classList.toggle("shadow");
			break;
		case 'mouseup':
			pause.elt.classList.remove("selected");
			play.elt.classList.remove("selected");
			faster.elt.classList.remove("selected");
			fastest.elt.classList.remove("selected");
			event.target.classList.toggle("selected");
			gameSpeed = event.target.speed;
			break;
	}
}

function drawOutline(){
	strokeWeight(2);
	stroke(200);
	fill(col_main_dark);
	rect(0,0, width,63);
	textSize(38);
	fill(255);
	text('Schlaf', 15, 45);

	fill(col_main);
	rect(0,height-70, width,height);
	noStroke();
	fill("gray");
	rect(0,height-30, width,height);
}

const fenster = {
	x:200,
	y:200,
	w:300,
	h:250
},
tuer = {
	x:200,
	y:200,
	w:300,
	h:250
};

const imgSize = 640;
var edge = 600, padding = 10;

function drawInterior(){
	noStroke();
	
	// wall
	fill("SandyBrown");
	rect(0,0,width,edge);
	// floor
	fill("Khaki");
	rect(0,edge,width,height-edge);
	// window
	fill("brown");
	rect(fenster.x,fenster.y,fenster.w,fenster.h);
	fill(skyColor);
	rect(fenster.x+padding,fenster.y+padding,fenster.w-(2*padding),fenster.h-(2*padding));
	

	image(bed, 30, edge-200);
	image(bonsai, width/2, edge-200, imgSize/3, imgSize/3);
}

// TODO actually check weather
function checkWeather() {
	if (!weather) {
		return;
	}

	if (weatherEnd <= frameCounter) {
		weatherStart = frameCounter + RANDP(2 * weatherInterval);
		weatherEnd = weatherStart + RANDP(2 * weatherDuration);
	}
}

function drawSunCicle() {
	// yellow
	var sunHeight = (getSunHeight() + 1) / 2;
	sunColor = color('hsb(45, 10%,' + season(sunHeight) + '%)');
	// blue
	skyColor = color('hsb(197, 43%,' + season(sunHeight) + '%)');
	background(skyColor);
}

// day starts at 0:00, sun should be lowest
var getSunHeight = function () {
	return -cos(timeCounter);
}

function debugDisplay() {
	let tSize = 20, p = 5;
	strokeWeight(2);
	stroke(0);
	fill(200);
	textFont(fontRegular);
	textSize(tSize);
	text("FPS: " + fpsShow, 10, tSize * p++);
	text("FNr: " + frameCounter % FRAMES_PER_SEC, 10, tSize * p++);
	text("d%: " + round(1000 * timeCounterRelative) / 1000, 10, tSize * p++);
	text("SH: " + round(100 * getSunHeight()) / 100, 10, tSize * p++);
}

function updateDelta() {
	var now = new Date();
	deltaT = now - then;
	then = now;
	deltaTLimiter();

	timeCounter += RAD_PER_MIN * (deltaT / TICK) * gameSpeed;
	timeCounterRelative = (timeCounter % TWO_PI) / TWO_PI;

	frameCounter += 1;
	fpsNow = round(1000 / deltaT);
	if (frameCounter % debugUpdateDelay == 0) {
		fpsShow = fpsNow;
	}
}

// simulation may run faster, progress can be limited to desired progress.
// when using real time for deltaT, the simulation may jump 
// when the visual part is stopped, ie changing tabs. 
function deltaTLimiter() {
	if (speedLimit) {
		deltaT = max(deltaT, TICK);
	}
	if (skipLimit) {
		deltaT = min(deltaT, ceil(maxFrameSkipAmount * (1000 / TICK)));
	}
}

// compact solution: https://gist.github.com/gre/1650294
EasingFunctions = {
	// no easing, no acceleration
	linear: t => t,
	// accelerating from zero velocity
	easeInQuad: t => t * t,
	// decelerating to zero velocity
	easeOutQuad: t => t * (2 - t),
	// acceleration until halfway, then deceleration
	easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
	// accelerating from zero velocity 
	easeInCubic: t => t * t * t,
	// decelerating to zero velocity 
	easeOutCubic: t => (--t) * t * t + 1,
	// acceleration until halfway, then deceleration 
	easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
	// accelerating from zero velocity 
	easeInQuart: t => t * t * t * t,
	// decelerating to zero velocity 
	easeOutQuart: t => 1 - (--t) * t * t * t,
	// acceleration until halfway, then deceleration
	easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
	// accelerating from zero velocity
	easeInQuint: t => t * t * t * t * t,
	// decelerating to zero velocity
	easeOutQuint: t => 1 + (--t) * t * t * t * t,
	// acceleration until halfway, then deceleration 
	easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
}

function SeedRandom(state1, state2) {
	var mod1 = 4294967087
	var mul1 = 65539
	var mod2 = 4294965887
	var mul2 = 65537
	if (typeof state1 != "number") {
		state1 = +new Date()
	}
	if (typeof state2 != "number") {
		state2 = state1
	}
	state1 = state1 % (mod1 - 1) + 1
	state2 = state2 % (mod2 - 1) + 1
	function random(limit) {
		state1 = (state1 * mul1) % mod1
		state2 = (state2 * mul2) % mod2
		if (state1 < limit && state2 < limit && state1 < mod1 % limit && state2 < mod2 % limit) {
			return random(limit)
		}
		return (state1 + state2) % limit
	}
	return random
}