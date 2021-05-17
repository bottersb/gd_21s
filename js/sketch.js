// SLEEP
// 
// game is designed to run at 1 ingame minute per frame at normal (1x) game speed
// 

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
	loadIndicators()
	loadClock();
	loadSchedule();
}

function draw() {
	updateDelta();
	drawSunCicle();
	//drawAllClouds();
	drawInterior();
	updateClock();
	darkenRoom();
	//drawSchedule();
	drawIndicators();
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

	play.elt.classList.toggle("selected");
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
			lastGameSpeed = undefined;
			pause.elt.classList.remove("selected");
			play.elt.classList.remove("selected");
			faster.elt.classList.remove("selected");
			fastest.elt.classList.remove("selected");
			event.target.classList.toggle("selected");
			gameSpeed = event.target.speed;
			break;
	}
}

let lastGameSpeed;
function keyReleased() {
	if (keyCode === 32) {
		pause.elt.classList.remove("selected");
		play.elt.classList.remove("selected");
		faster.elt.classList.remove("selected");
		fastest.elt.classList.remove("selected");
		if (lastGameSpeed == undefined) {
			lastGameSpeed = gameSpeed;
			pause.elt.classList.toggle("selected");
			gameSpeed = 0;
		} else {
			gameSpeed = lastGameSpeed;
			switch(lastGameSpeed){
				case 1:
					play.elt.classList.toggle("selected");	
					break;
				case 2:
					faster.elt.classList.toggle("selected");
					break;
				case 4:
					fastest.elt.classList.toggle("selected");
					break;
			}
			lastGameSpeed = undefined;
		}
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

let testi;
function drawInterior() {
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
	image(lamp, i_lamp.x, i_lamp.y, i_lamp.w, i_lamp.h)
	image(ball, i_ball.x, i_ball.y, i_ball.w, i_ball.h)
	image(bed, i_bed.x, i_bed.y, i_bed.w, i_bed.h)
	image(bonsai, i_bonsai.x, i_bonsai.y, i_bonsai.w, i_bonsai.h)
	image(desk, i_desk.x, i_desk.y, i_desk.w, i_desk.h)
	image(chair, i_chair.x, i_chair.y, i_chair.w, i_chair.h)
	image(laptop, i_laptop.x, i_laptop.y, i_laptop.w, i_laptop.h)
	image(board, i_board.x, i_board.y, i_board.w, i_board.h);
	image(shelf, i_shelf.x, i_shelf.y, i_shelf.w, i_shelf.h);
	image(counter, i_counter.x, i_counter.y, i_counter.w, i_counter.h);
}

function loadIndicators() {
	var xPos = 20, yPos = 180, dim = 50, p = 0;

	i_light = createImg('img/light-156054_640.png').position(xPos, yPos + (dim * 1.2 * p++)).size(dim, dim);
	i_light.elt.draggable = false;

	i_melatonin = createImg('img/melatonin.png').position(xPos, yPos + (dim * 1.2 * p++)).size(dim, dim);
	i_melatonin.elt.draggable = false;

	i_energy = createImg('img/battery-151574_640.png').position(xPos, yPos + (dim * 1.2 * p++)).size(dim, dim);
	i_energy.elt.draggable = false;
}

let brightness = 0, currMelatonin = 0.4;
function drawIndicators() {
	var xPos = 20, yPos = 180, dim = 50, maxW = 150, p = 0;
	let energyBar, melatoninBar, light;

	noStroke();
	fill(250);

	var startingX = 200,
		startingY = 120,
		w = 30;

	rect(map(timeCounterRelative, 0, 1, startingX, startingX + (24 * w)), startingY + w, 5, 10);

	stroke(1)
	strokeWeight(1)
	fill(250);
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, maxW, dim - 20);
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, maxW, dim - 20);
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, maxW, dim - 20);
	p = 0;
	fill("yellow");
	brightness = 0.90 * season(getSunHeight());
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, map(brightness, 0, 100, 0, maxW), dim - 20);
	fill("cyan");
	var mD = map(brightness, 0, 100, 0.005, -0.005);
	if (gameSpeed != 0) {
		currMelatonin += mD;
		currMelatonin = min(1, currMelatonin);
		currMelatonin = max(0, currMelatonin);
	}
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, map(currMelatonin, 0, 1, 0, maxW), dim - 20);


}

let divSleepBox, divWorkBox, divRecreationBox;
function loadSchedule() {
	var startingX = 200,
		startingY = 120,
		w = 30;

	let divScheduleText = createDiv("Schedule:").position(startingX, 78);
	divScheduleText.addClass('scheduleText');

	divSleepBox = createDiv().position(390, 80);
	divSleepBox.addClass('scheduleBox').addClass('sleep').addClass('sleep_selector');
	divSleepBox.elt.name = "Sleep";
	divSleepBox.elt.type = "select";

	let divSleepText = createDiv("Sleep").position(390 + w + 10, 78);
	divSleepText.addClass('scheduleText').addClass('sleep');

	divWorkBox = createDiv().position(525, 80);
	divWorkBox.addClass('scheduleBox').addClass('work').addClass('work_selector');
	divWorkBox.elt.name = "Work";
	divWorkBox.elt.type = "select";

	let divWorkText = createDiv("Work").position(525 + w + 10, 78);
	divWorkText.addClass('scheduleText').addClass('work');

	divRecreationBox = createDiv().position(650, 80);
	divRecreationBox.addClass('scheduleBox').addClass('recreation').addClass('recreation_selector');
	divRecreationBox.elt.name = "Recreation";
	divRecreationBox.elt.type = "select";

	let divRecreationText = createDiv("Recreation").position(650 + w + 10, 78);
	divRecreationText.addClass('scheduleText').addClass('recreation');

	divSleepBox.mouseReleased(scheduleClickListener);
	divWorkBox.mouseReleased(scheduleClickListener);
	divRecreationBox.mouseReleased(scheduleClickListener);

	for (let i = 0; i < 24; i++) {
		let schedType = dailySchedule[i];

		let divScheduleElement = createDiv().position(startingX + (i * w), startingY);
		divScheduleElement.addClass('scheduleBox').addClass(schedType.toLowerCase());
		divScheduleElement.elt.scheduleIndex = i;
		divScheduleElement.elt.type = "put";
		divScheduleElement.id("schedPut_" + i);
		divScheduleElement.mouseReleased(scheduleClickListener);
	}
}

var clickTarget, scheduleTargetName, scheduleInteraction = false, snu;
function scheduleClickListener(e) {
	// bug related to text inside of the box
	/*print(e)
	let el;
	snu = e;
	if(e.explicitOriginalTarget.childNodes.length == 0){
		el = e.explicitOriginalTarget.parentElement;
	} else {
		el = e.explicitOriginalTarget;
	}
	print(el)*/

	el = e.explicitOriginalTarget;
	let left = el.style.left.match(/\d/g).join('');
	left = parseInt(left, 10)
	let top = el.style.top.match(/\d/g).join('');
	top = parseInt(top, 10)
	let height = el.clientHeight;
	let width = el.clientWidth;

	clickTarget = {
		x: left,
		y: top,
		w: width,
		h: height
	}

	let type = el.type;
	if (type == "put") {
		if (scheduleInteraction) {
			let element = select('#' + el.id);
			element.class('').addClass('scheduleBox').addClass(scheduleTargetName.toLowerCase());
			dailySchedule[el.scheduleIndex] = scheduleTargetName;
		}
	} else {
		//el.classList.add("selected");
		scheduleTargetName = el.name;
	}
}

function mouseReleased() {
	if (clickTarget !== undefined && mouseInside(clickTarget.x, clickTarget.y, clickTarget.w, clickTarget.h) && scheduleTargetName !== undefined) {
		scheduleInteraction = true;
	} else {
		scheduleInteraction = false;
		scheduleTargetName = undefined;
		/*
		divSleepBox.elt.classList.remove("selected");
		divWorkBox.elt.classList.remove("selected");
		divRecreationBox.elt.classList.remove("selected");*/
	}
}

function mouseInside(x, y, w, h) {
	if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
		return true;
	} else {
		return false;
	}
}

var currentLight;
function darkenRoom() {
	// get light, darken room, TODO move to different function
	let c = color('hsba(180, 100%, 0%,' + 0.80 * (1 - season(getSunHeight()) / 100) + ')');
	currentLight = c;
	fill(c);
	rect(0, 0, width, height);
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
	let tSize = 18, xPos = 1030, yPos = 380, p = 0;
	strokeWeight(2);
	stroke(0);
	fill(200);
	textFont(fontRegular);
	textSize(tSize);
	textAlign(LEFT, BASELINE);
	text("FPS: " + fpsShow, xPos, yPos + (tSize * p++));
	text("FNr: " + frameCounter % FRAMES_PER_SEC, xPos, yPos + (tSize * p++));
	text("d%: " + round(1000 * timeCounterRelative) / 1000, xPos, yPos + (tSize * p++));
	text("SH: " + round(100 * getSunHeight()) / 100, xPos, yPos + (tSize * p++));
	text("S: " + season.name, xPos, yPos + (tSize * p++));

	//print(mouseX, mouseY);
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
	divClock.position(xPos, yPos).size(dim, dim);
}

function updateClock() {
	var currentMins = floor(map(timeCounterRelative, 0, 1, 0, 1440));
	const hour = ((floor(currentMins / 60) + 11) % 12 + 1) * 30;
	const minute = floor(currentMins % 60) * 6;
	document.querySelector('.hour').style.transform = `rotate(${hour}deg)`;
	document.querySelector('.minute').style.transform = `rotate(${minute}deg)`;
}