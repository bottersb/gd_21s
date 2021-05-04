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

// Easing of sun height
const SUMMER = function (v) { return max(0.1, EasingFunctions.easeOutCubic(v) * 100) },
	WINTER = function (v) { return max(0.1, EasingFunctions.easeInCubic(v) * 80) },
	SPRING = FALL = function (v) { return max(0.1, EasingFunctions.easeInOutCubic(v) * 90) };

const col_main = "#40752D",
	col_main_t70 = "#40752Db3",
	col_main_dark = "#335E24",
	col_main_darkest = "#1A2F12",
	col_main_light = "#5ca840",
	col_main_lighter = "#D9E3D5",
	col_main_lightest = "#ECF4E9";

// settings
var gameSpeed = 1,
	season = SUMMER,
	debug = true, // verbose output and display
	debugUpdateDelay = FRAMES_PER_SEC / 3; // in frames

var speedLimit = true, // fps upper limit to defined value of FRAMES_PER_SEC
	skipLimit = false, // app may stop bc of background, when false progress will updated according to deltaT 
	maxFrameSkipAmount = 1; // max amount of frames skipped 

// related, normalized time representations and references
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

const imgSize = 640;
var edge = 600, padding = 10;
var bed, bonsai, lamp, desk, ball, shelf, chair, laptop, counter, wecker, monitor, board;

var daySchedule = [
	"Sleep",
	"Sleep",
	"Sleep",
	"Sleep",
	"Sleep",
	"Sleep",
	"Sleep",
	"Recreation",
	"Recreation",
	"Work",
	"Work",
	"Work",
	"Work",
	"Recreation",
	"Work",
	"Work",
	"Work",
	"Work",
	"Recreation",
	"Recreation",
	"Work",
	"Work",
	"Recreation",
	"Sleep"
];


function preload() {
	fontRegular = loadFont('res/Poppins-Regular.ttf');
	lamp = loadImage('img/lamp-575998_640.png');
	ball = loadImage('img/basketball-155997_640.png');
	bed = loadImage('img/bed-575800_640.png');
	bonsai = loadImage('img/bonsai-154570_640.png');
	desk = loadImage('img/desk-575953_640.png');
	chair = loadImage('img/office-chair-575881_640.png');
	laptop = loadImage('img/computer-156583_640.png');
	shelf = loadImage('img/shelf-159852_640.png');
	counter = loadImage('img/counter-576093_640.png');
	wecker = loadImage('img/clock-1293099_640.png');
	monitor = loadImage('img/monitor-2026552_640.png');
	board = loadImage('img/whiteboard-3205371_640.png');
}

function setup() {
	createCanvas(1280, 800);
	frameRate(FRAMES_PER_SEC);

	loadControls();
	loadClock();
}

function draw() {
	updateDelta();
	drawSunCicle();
	//drawAllClouds();
	drawInterior();
	drawSchedule();
	clock();
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

function loadClock() {
	let xPos = 800, yPos = 400, dim = 40;

	let divClock = createDiv();
	divClock.class('clock');
	let divHour = createSpan();
	divHour.class('hour');
	let divMinute = createSpan();
	divMinute.class('minute');
	let divDot = createSpan();
	divDot.class('dot');
	
	divHour.parent(divClock);
	divMinute.parent(divClock);
	divDot.parent(divClock);
	divClock.position(xPos, yPos).size(dim,dim);
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

function drawOutline() {
	strokeWeight(2);
	stroke(200);
	fill(col_main_dark);
	rect(0, 0, width, 63);
	textSize(38);
	fill(255);
	textAlign(LEFT, BASELINE);
	text('Schlaf', 15, 45);

	fill(col_main);
	//rect(0, height - 70, width, height);
	//noStroke();
	//fill("gray");
	rect(0, height - 30, width, height);
}


// interior
const fenster = {
	x: 310,
	y: 350,
	w: 250,
	h: 150
}, i_ball = {
	x: 600,
	y: 600,
	w: 50,
	h: 50
}, i_lamp = {
	x: 300,
	y: 560,
	w: 100,
	h: 140
}, i_bed = {
	x: 440,
	y: 600,
	w: 400,
	h: 200
}, i_bonsai = {
	x: 700,
	y: 570,
	w: 100,
	h: 100
}, i_desk = {
	x: 950,
	y: 570,
	w: 240,
	h: 160
}, i_chair = {
	x: 800,
	y: 600,
	w: 140,
	h: 180
}, i_laptop = {
	x: 950,
	y: 480,
	w: 80,
	h: 50
}, i_board = {
	x: 1130,
	y: 440,
	w: 260,
	h: 190
}, i_shelf = {
	x: 680,
	y: 400,
	w: 120,
	h: 80
}, i_counter = {
	x: 440,
	y: 630,
	w: 300,
	h: 80
}

function drawInterior(){
	noStroke();
	// wall
	fill("SandyBrown");
	rect(0, 0, width, edge);
	// floor
	fill("Khaki");
	rect(0, edge, width, height - edge);
	// window
	fill("brown");
	rect(fenster.x, fenster.y, fenster.w, fenster.h);
	fill(skyColor);
	rect(fenster.x + padding, fenster.y + padding, fenster.w - (2 * padding), fenster.h - (2 * padding));

	imageMode(CENTER);
	image(lamp, i_lamp.x, i_lamp.y,i_lamp.w,i_lamp.h)
	image(ball, i_ball.x, i_ball.y,i_ball.w,i_ball.h)
	image(bed, i_bed.x, i_bed.y,i_bed.w,i_bed.h)
	image(bonsai, i_bonsai.x, i_bonsai.y,i_bonsai.w,i_bonsai.h)
	image(desk, i_desk.x, i_desk.y,i_desk.w,i_desk.h)
	image(chair, i_chair.x, i_chair.y,i_chair.w,i_chair.h)
	image(laptop, i_laptop.x, i_laptop.y,i_laptop.w,i_laptop.h)
	image(board, i_board.x, i_board.y, i_board.w, i_board.h);
	image(shelf, i_shelf.x, i_shelf.y, i_shelf.w, i_shelf.h);
	image(counter, i_counter.x, i_counter.y, i_counter.w, i_counter.h);
}

function drawSchedule(){
	var startingX = 200, 
	startingY = 120, 
	w = 30,
	wMargin = 10, 
	tSchedule = "Schedule: ", 
	tSleep = "Sleep",
	cSleep = "MidnightBlue", // RoyalBlue 
	cSleepHighlight = "RoyalBlue",
	tWork = "Work",
	cWork = "Orange",
	cWorkHighlight = "Gold",
	tRecreation = "Recreation",
	cRecreation = "LimeGreen", //Lime
	cRecreationHighlight = "Lime"; //Lime
	
	strokeWeight(0);
	stroke(0);
	fill(0);
	textFont(fontRegular);
	textSize(w);
	textAlign(LEFT, BASELINE);
	text(tSchedule, startingX, startingY-(w/2));
	
	var currX = startingX + textWidth(tSchedule) + 40;
	
	strokeWeight(1);
	currX = drawScheduleElement(currX, startingY, w, wMargin, cSleep, cSleepHighlight, tSleep);
	currX = drawScheduleElement(currX, startingY, w, wMargin, cWork, cWorkHighlight, tWork);
	drawScheduleElement(currX, startingY, w, wMargin, cRecreation, cRecreationHighlight, tRecreation);
	
	textSize(w/2);
	textAlign(CENTER, CENTER);
	strokeWeight(1);
	stroke("black");
	for(var i = 0; i < 24; i++){
		switch (daySchedule[i]) {
			case "Sleep":
				fill(cSleep);
			break;
			case "Work":
				fill(cWork);
			break;
			case "Recreation":
				fill(cRecreation);
			break;
			default:
				fill(250);
		}
		rect(startingX + (i * w), startingY, w, w);
		fill("white");
		text(i, startingX + (i * w) + w/2, startingY + w/2);
	}
}



function drawScheduleElement(currX, startingY, w, wMargin, c, cH, t){
	var rectY = startingY - (w+10)
	if(mouseInside(currX, rectY, w,w)) {
		fill(cH);

	} else {
		fill(c);
	}
	rect(currX, rectY, w, w)
	currX = currX + w + wMargin;
	fill(c);
	text(t, currX, startingY-(w/2));
	return currX + textWidth(t) + wMargin;
}

function mouseInside(x, y, w, h){
	if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
	 return true; 
	} else {
	 return false; 
	}
   }

function darkenRoom(){
	// get light, darken room, TODO move to different function
	let c = color('hsba(180, 100%, 0%,' + 0.80 * (1 - season(getSunHeight()) / 100) + ')');
	fill(c)
	rect(0,0,width, height);
}

function drawSunCicle() {
	var sunHeight = (getSunHeight() + 1) / 2;
	// blue
	skyColor = color('hsb(197, 43%,' + season(sunHeight) + '%)');
	background(skyColor);
	// yellow
	sunColor = color('hsb(45, 10%,' + season(sunHeight) + '%)');
	fill(sunColor);
	noStroke();
	circle(300, (height + cos(timeCounter) * 500), 300);
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
	textAlign(LEFT, BASELINE);
	text("FPS: " + fpsShow, 10, tSize * p++);
	text("FNr: " + frameCounter % FRAMES_PER_SEC, 10, tSize * p++);
	text("d%: " + round(1000 * timeCounterRelative) / 1000, 10, tSize * p++);
	text("SH: " + round(100 * getSunHeight()) / 100, 10, tSize * p++);

	print(mouseX, mouseY);
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

function clock() {
	var currentMins = floor(map(timeCounterRelative, 0,1,0,1440));
	const hour = ((floor(currentMins / 60) + 11) % 12 + 1) * 30;
	const minute = floor(currentMins % 60) * 6;
	document.querySelector('.hour').style.transform = `rotate(${hour}deg)`;
	document.querySelector('.minute').style.transform = `rotate(${minute}deg)`;
}
