// SLEEP
// 
// game is designed to run at 1 ingame minute per frame at normal (1x) game speed
// 

function preload() {
	fontRegular = loadFont('res/Poppins-Regular.ttf');
	outdoor = loadImage('img/evergreen-2025158.png');
	windowFrame = loadImage('img/window-576026_640.png');
}

var infoBox, infoBoxCloser;
function setup() {
	createCanvas(1280, 800);
	frameRate(FRAMES_PER_SEC);

	loadControls();
	loadIndicators()
	loadClock();
	loadSchedule();
	loadInterior();
	loadSelectors();
	infoBox = createDiv().addClass("infoBox").position(110, 210).size(1060, 520);
	infoBoxCloser = createSpan("X").id("infoCloser").addClass("infoCloser").mouseReleased(function () { infoBox.toggleClass("show"); });
	showInfoBox(infoBoxGameInfo);
}

function draw() {
	updateDelta();
	drawSunCicle();
	//drawAllClouds();
	drawRoom();
	updateClock();
	darkenRoom();
	drawIndicators();
	drawOutline();
	randomEvent();
	//print(mouseX + " " + mouseY);
	if (debug) {
		debugDisplay();
	}
}

var sliderToolTip, difMap = ["Easy", "Normal", "Hard"]
function difSliderOnChange(event){
	difficulty = event.target.value;
	let difName = difMap[difficulty - 1]
	sliderToolTip.html("<span class=\"dif" + difName + "\">"+difName+"</span>");
}

var difficulty = 2;
function loadSelectors(){	
	// difficulty
	//sDifficulty = createImg('img/rubiks-cube-145949_640.png').position(790, 80).size(40, 40);
	sDifficulty = createImg('img/rubiks-cube-157058_640.png').position(820, 80).size(40, 40);
	sDifficulty.elt.draggable = false;
	sDifficulty.mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoDifficulty);

	let divDifSlider = createDiv().position(880, 80);
	divDifSlider.class('difficulty');
	let difSlider = createSlider(1, 3, difficulty, 1);
	difSlider.style('width', '60px');
	sliderToolTip = createSpan().addClass("tooltiptext");
	let difName = difMap[difficulty - 1]
	sliderToolTip.html("<span class=\"dif" + difName + "\">"+difName+"</span>");

	difSlider.parent(divDifSlider);
	sliderToolTip.parent(divDifSlider);

	difSlider.input(difSliderOnChange);
	
	// random
	sRandom = createImg('img/dice-151867_640.png').position(820, 140).size(40, 40);
	sRandom.elt.draggable = false;
	sRandom.mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoRandom);

	let randomToggleContainer = createElement('label').position(880, 142);
	randomToggleContainer.toggleClass("switch");

	let randomToggleSlider = createSpan('');
	randomToggleSlider.toggleClass('slider');
	randomToggleSlider.mouseReleased(toggleRandomEvents)

	let randomToggleInput = createInput('', 'checkbox')
	
	randomToggleInput.parent(randomToggleContainer);
	randomToggleSlider.parent(randomToggleContainer);
}

var randomEventsEnabled = false;
function toggleRandomEvents(){
	randomEventsEnabled = !randomEventsEnabled;
}

var spawnFrame = -1
function randomEvent(){
	if(gameSpeed == 0) {
		return;
	}

	// handle current event
	if(currRandomEvent !== undefined){
		//handle long running random event
	}

	// no events
	if(randomEventsEnabled == false) {
		return;
	} 
	if(spawnFrame > frameCounterGame) {
		// not time yet
		return;
	} 
	if(spawnFrame + 4 < frameCounterGame) {
		currRandomEvent = undefined;
		spawnFrame = RAND(MIN_PER_DAY * 10);
	}
	
	else {
		spawnRandomEvent();
	}
}

var currRandomEvent, currEventDescription, eventEndDay, eventEndHour, eventEndMin;
function spawnRandomEvent(){
	// pause game
	pause.elt.classList.remove("selected");
	play.elt.classList.remove("selected");
	faster.elt.classList.remove("selected");
	fastest.elt.classList.remove("selected");
	pause.elt.classList.toggle("selected");
	gameSpeed = 0;

	// get random unspawned event from list
	currRandomEvent = randomEvents[RAND(randomEvents.length)]
	currEventDescription = currRandomEvent["desc"];
	if(currRandomEvent["singular"] == false) {
		
		let currentMins = floor(map(timeCounterRelative, 0, 1, 0, 1440));
		let endMinsTotal = currentMins + currRandomEvent["duration"];
		let eventEndDay = dayNr + floor(endMinsTotal / MIN_PER_DAY);
		let endMins = endMinsTotal % MIN_PER_DAY;
		let eventEndHour = floor(endMins / 60);
		var eventEndMin = floor(endMins % 60);
		
		currEventDescription = currEventDescription 
		+ " The event will end at "
		+ eventEndHour.toLocaleString(undefined, digits) + ":" + eventEndMin.toLocaleString(undefined, digits)
		+ " on day " + eventEndDay;
	} 

	if(currRandomEvent["id"] == "food_01"){
		currFood = 0;
		currRandomEvent = undefined
	} else if(currRandomEvent["id"] == "work_02"){
		currEnergy = maxEnergy;
		currFood = maxFood;
		currHappiness = maxHappiness;
		currRandomEvent = undefined
	} else {
		// postit
		// visualize effect
	}

	showInfoRandomEvent();
}

function loadControls() {
	var xPos = 1000, yPos = 110, p = 0, dim = 40;
	pause = createImg('img/pause_c.png').position(xPos + (dim * 1.5 * p++), yPos).size(dim, dim);
	pause.mouseOver(controlsEventHandler).mouseOut(controlsEventHandler).mouseReleased(controlsEventHandler);
	pause.elt.draggable = false;
	pause.elt.name = "pause";
	pause.elt.speed = 0;

	play = createImg('img/play_c.png').position(xPos + (dim * 1.5 * p++), yPos).size(dim, dim);
	play.mouseOver(controlsEventHandler).mouseOut(controlsEventHandler).mouseReleased(controlsEventHandler);
	play.elt.draggable = false;
	play.elt.name = "play";
	play.elt.speed = 1;

	faster = createImg('img/faster_c.png').position(xPos + (dim * 1.5 * p++), yPos).size(dim, dim);
	faster.mouseOver(controlsEventHandler).mouseOut(controlsEventHandler).mouseReleased(controlsEventHandler);
	faster.elt.draggable = false;
	faster.elt.name = "faster";
	faster.elt.speed = 2;

	fastest = createImg('img/fastest_c.png').position(xPos + (dim * 1.5 * p++), yPos).size(dim, dim);
	fastest.mouseOver(controlsEventHandler).mouseOut(controlsEventHandler).mouseReleased(controlsEventHandler);
	fastest.elt.draggable = false;
	fastest.elt.name = "fastest";
	fastest.elt.speed = 4;

	pause.elt.classList.toggle("selected");
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
			switch (lastGameSpeed) {
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

function drawRoom() {
	noStroke();
	// wall
	fill("Linen");
	rect(0, 0, width, edge);
	// floor
	fill("SaddleBrown");
	rect(0, edge, width, height - edge);
	// window
	image(outdoor, fenster.x + padding, fenster.y + padding, fenster.w - (2 * padding), fenster.h - (2 * padding));
	let sunHeight = (getSunHeight() + 1) / 2;
	// blue
	let c = color('hsba(197, 43%, ' + season(sunHeight) + '%, '+ (1-0.99*sunHeight) +')');
	fill(c);
	rect(fenster.x + padding, fenster.y + padding, fenster.w - (2 * padding), fenster.h - (2 * padding));
	image(windowFrame, fenster.x, fenster.y, fenster.w, fenster.h);
	
	// ceiling
	fill("LightSlateGray");
	rect(0, height - edge, width, -edge);
}

function loadInterior() {
	bonsai = createImg('img/bonsai-154570_640.png').position(i_bonsai.x, i_bonsai.y).size(i_bonsai.w, i_bonsai.h);
	bonsai.mouseOver(glow).mouseOut(glow).mouseReleased(showInfoPlants);
	bed = createImg('img/bed-575800_640.png').position(i_bed.x, i_bed.y).size(i_bed.w, i_bed.h);
	bed.mouseOver(glow).mouseOut(glow).mouseReleased(showInfoSleepStages);
	ball = createImg('img/basketball-155997_640.png').position(i_ball.x, i_ball.y).size(i_ball.w, i_ball.h);
	ball.mouseOver(glow).mouseOut(glow).mouseReleased(showInfoExcersise);
	lamp = createImg('img/lamp-575998_640.png').position(i_lamp.x, i_lamp.y).size(i_lamp.w, i_lamp.h);
	lamp.mouseOver(glow).mouseOut(glow).mouseReleased(showInfoLightSci);
	desk = createImg('img/desk-575953_640.png').position(i_desk.x, i_desk.y).size(i_desk.w, i_desk.h);
	chair = createImg('img/office-chair-575881_640.png').position(i_chair.x, i_chair.y).size(i_chair.w, i_chair.h);
	laptop = createImg('img/computer-156583_640.png').position(i_laptop.x, i_laptop.y).size(i_laptop.w, i_laptop.h);
	laptop.mouseOver(glow).mouseOut(glow).mouseReleased(showInfoElectronics);
	shelf = createImg('img/shelf-159852_640.png').position(i_shelf.x, i_shelf.y).size(i_shelf.w, i_shelf.h);
	shelf.mouseOver(glow).mouseOut(glow).mouseReleased(showInfoLearning);
	counter = createImg('img/counter-576093_640.png').position(i_counter.x, i_counter.y).size(i_counter.w, i_counter.h);
	board = createImg('img/whiteboard-3205371_640.png').position(i_board.x, i_board.y).size(i_board.w, i_board.h);
	//poster = createImg('img/wrestler-149840_640.png').position(i_poster.x, i_poster.y).size(i_poster.w, i_poster.h);
	dreamcatcher = createImg('img/dream-catcher-1904179_640.png').position(i_dreamcatcher.x, i_dreamcatcher.y).size(i_dreamcatcher.w, i_dreamcatcher.h);
	dreamcatcher.mouseOver(glow).mouseOut(glow).mouseReleased(showInfoDreams);
	postit = createImg('img/note-147951_640.png').position(i_postit.x, i_postit.y).size(i_postit.w, i_postit.h);
	postit.mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoUnfinished);
	fireplace = createImg('img/fireplace-575989_640.png').position(i_fireplace.x, i_fireplace.y).size(i_fireplace.w, i_fireplace.h);
	fireplace.mouseOver(glow).mouseOut(glow).mouseReleased(showInfoTemperature);
}

function pulse(event) {
	switch (event.type) {
		case 'mouseover':
			event.target.classList.toggle("pulse");
			break;
		case 'mouseout':
			event.target.classList.toggle("pulse");
			break;
	}
}

function glow(event) {
	switch (event.type) {
		case 'mouseover':
			event.target.classList.toggle("glow");
			break;
		case 'mouseout':
			event.target.classList.toggle("glow");
			break;
	}
}

function showInfoLight() {
	showInfoBox(infoBoxLight);
}

function showInfoMelatonin() {
	showInfoBox(infoBoxMelatonin);
}

function showInfoEnergy() {
	showInfoBox(infoBoxEnergy);
}

function showInfoHealth() {
	showInfoBox(infoBoxHealth);
}

function showInfoSchedule() {
	showInfoBox(infoBoxSchedule);
}

function showInfoFood() {
	showInfoBox(infoBoxFood);
}

function showInfoHappiness() {
	showInfoBox(infoBoxHappiness);
}

function showInfoRandom() {
	showInfoBox(infoBoxRandom);
}

function showInfoDifficulty() {
	showInfoBox(infoBoxDifficulty);
}

function showInfoExcersise() {
	showInfoBox(infoBoxExcersise);
}

function showInfoDreams() {
	showInfoBox(infoBoxDreams);
}

function showInfoTemperature() {
	showInfoBox(infoBoxTemperature);
}

function showInfoElectronics() {
	showInfoBox(infoBoxElectronics);
}

function showInfoLearning() {
	showInfoBox(infoBoxLearning);
}

function showInfoPlants() {
	showInfoBox(infoBoxPlants);
}

function showInfoLightSci() {
	showInfoBox(infoBoxLightSci);
}

function showInfoSleepStages() {
	showInfoBox(infoBoxSleepStages);
}

function showInfoRandomEvent() {
	showInfoBox(currEventDescription);
}

function showInfoUnfinished() {
	showInfoBox(infoBoxUnfinished);
}

function showGameOverInfo() {
	play.elt.classList.remove("selected");
	faster.elt.classList.remove("selected");
	fastest.elt.classList.remove("selected");

	lastGameSpeed = gameSpeed = 0;
	pause.elt.classList.toggle("selected");
	
	var currentMins = floor(map(timeCounterRelative, 0, 1, 0, 1440));
	var hour = floor(currentMins / 60);
	var min = floor(currentMins % 60);
	infoBox.html("");
	infoBox.html(infoBoxGameOver, true);
	infoBox.html("<br>You lasted <b>" + dayNr + "</b> days, <b>" + hour.toLocaleString(undefined, digits) + "</b> hours and <b>" + min.toLocaleString(undefined, digits) + "</b> minutes.", true);
	infoBox.toggleClass("show");
}

function showInfoBox(content) {
	infoBox.html("");
	infoBoxCloser.parent(infoBox);
	infoBox.html(content, true);
	infoBox.toggleClass("show");
}

var smileyX, smileyY;
function loadIndicators() {
	var xPos = 20, yPos = 220, dim = 50, p = 0;

	i_light = createImg('img/light-156054_640.png').position(xPos, yPos + (dim * 1.2 * p++)).size(dim, dim);
	i_light.mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoLight);
	i_light.elt.draggable = false;

	i_melatonin = createImg('img/melatonin.png').position(xPos, yPos + (dim * 1.2 * p++)).size(dim, dim);
	i_melatonin.mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoMelatonin);
	i_melatonin.elt.draggable = false;

	i_energy = createImg('img/battery-151574_640.png').position(xPos, yPos + (dim * 1.2 * p++)).size(dim, dim);
	i_energy.mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoEnergy);
	i_energy.elt.draggable = false;

	i_heart = createImg('img/heart-1297159_640_res.png').position(xPos, yPos + (dim * 1.2 * p++)).size(dim, dim);
	i_heart.mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoHealth);
	i_heart.elt.draggable = false;

	i_apple = createImg('img/apple-1293174_640.png').position(xPos, yPos + (dim * 1.2 * p++)).size(dim, dim);
	i_apple.mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoFood);
	i_apple.elt.draggable = false;

	smileyX = xPos, smileyY = yPos + (dim * 1.2 * p++);
	i_smiley_sad = createImg('img/smiley-1635452_640.png').position(smileyX, smileyY).size(0, 0).mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoHappiness);
	i_smiley_sad.elt.draggable = false;
	i_smiley_unhappy = createImg('img/smiley-1635448_640.png').position(smileyX, smileyY).size(0, 0).mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoHappiness);
	i_smiley_unhappy.elt.draggable = false;
	i_smiley_neutral = createImg('img/smiley-1635450_640.png').position(smileyX, smileyY).size(0, 0).mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoHappiness);
	i_smiley_neutral.elt.draggable = false;
	i_smiley_happy = createImg('img/smiley-1635449_640.png').position(smileyX, smileyY).size(0, 0).mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoHappiness);
	i_smiley_happy.elt.draggable = false;
	i_smiley_ecstatic = createImg('img/smiley-1635451_640.png').position(smileyX, smileyY).size(0, 0).mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoHappiness);
	i_smiley_ecstatic.elt.draggable = false;

	setHappiness();
}

// sad, unhappy, neutral, happy, ecstatic
var happinessState, 
// has to be the same as in loadIndicators
indicatorDim = 50;
function setHappiness(){
	if(currHappiness < 20 && happinessState !== "sad"){
		print("bla");
		happinessState = "sad";
		hideAllSmileys();
		i_smiley_sad.size(indicatorDim, indicatorDim);
	} else if(currHappiness >= 20 && currHappiness < 40 && happinessState !== "unhappy"){
		happinessState = "unhappy";
		hideAllSmileys();
		i_smiley_unhappy.size(indicatorDim, indicatorDim);
	} else if(currHappiness >= 40 && currHappiness < 60 && happinessState !== "neutral"){
		happinessState = "neutral";
		hideAllSmileys();
		i_smiley_neutral.size(indicatorDim, indicatorDim);
	} else if(currHappiness >= 60 && currHappiness < 80 && happinessState !== "happy"){
		happinessState = "happy";
		hideAllSmileys();
		i_smiley_happy.size(indicatorDim, indicatorDim);
	} else if(currHappiness >= 80 && happinessState !== "ecstatic"){
		happinessState = "ecstatic";
		hideAllSmileys();
		i_smiley_ecstatic.size(indicatorDim, indicatorDim);
	} 
}

function hideAllSmileys(){
	i_smiley_sad.size(0,0);
	i_smiley_unhappy.size(0,0);
	i_smiley_neutral.size(0,0);
	i_smiley_happy.size(0,0);
	i_smiley_happy.size(0,0);
}

function getScheduledActivity() {
	var index = floor(map(timeCounterRelative, 0, 1, 0, 23))
	return dailySchedule[index];
}

const maxHealth = 96, maxEnergy = 16, maxFood = 18, maxHappiness = 100;
var brightness = 0, currMelatonin = 0.7, currEnergy = 6, currHealth = 96, currFood = 15, currHappiness = 75;
var melatoninDelta = 0.008;
function drawIndicators() {
	var xPos = 20, yPos = 220, dim = 50, maxW = 150, p = 0;

	stroke(1)
	strokeWeight(1)
	fill(250);

	var startingX = 40,
		startingY = 130,
		w = 30;

	// current time on schedule
	rect(map(timeCounterRelative, 0, 1, startingX, startingX + (24 * w)), startingY + w, 5, 10);

	var jitter = 0;
	if(map(currHealth, 0, maxHealth, 0, 1) < 0.25) {
		// health bar jitter
		jitter = RAND(5);
	}

	// empty boxes
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, maxW, dim - 20);
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, maxW, dim - 20);
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, maxW, dim - 20);
	rect(xPos + dim + 10 + jitter, yPos + (dim * 1.2 * p++) + 10 + jitter, maxW, dim - 20);
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, maxW, dim - 20);
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, maxW, dim - 20);
	// reset the vertical advance faktor
	p = 0;


	fill("lavender");
	// TODO when working at night light will be used, add a value
	brightness = 0.99 * season(getSunHeight());
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, map(brightness, 0, 100, 0, maxW), dim - 20);
	fill("aquamarine");

	// melatonin
	var mD = map(brightness, 0, 100, melatoninDelta, (-1) * melatoninDelta);
	if (gameSpeed != 0) {
		currMelatonin += mD * gameSpeed;
		currMelatonin = min(1, currMelatonin);
		currMelatonin = max(0, currMelatonin);
	}
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, map(currMelatonin, 0, 1, 0, maxW), dim - 20);

	// energy
	if (gameSpeed != 0) {
		let energyPerHour, energyPerTick;
		switch (getScheduledActivity()) {
			case "Sleep":
				// if you are exposed to a lot of light sleeping will be half as "good"
				energyPerHour = currMelatonin > 0.5 ? 2 : 1;
				energyPerTick = energyPerHour / 60;
				currEnergy += energyPerTick * gameSpeed;
				break;
			case "Recreation":
				// if you are exposed to darkness recreation will be double as exhausting
				energyPerHour = currMelatonin < 0.5 ? -1/3 : -2/3;
				energyPerTick = energyPerHour / 60;
				currEnergy += energyPerTick * gameSpeed;
				break;
			case "Work":
				// if you are exposed to darkness work will be double as exhausting
				energyPerHour = currMelatonin < 0.5 ? -1 : -2;
				energyPerTick = energyPerHour / 60;
				currEnergy += energyPerTick * gameSpeed;
				break;
		}
		// energy cannot be lower than 0 and not higher than maxEnergy
		currEnergy = min(maxEnergy, currEnergy);
		currEnergy = max(0, currEnergy);
	}

	fill("navy");
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, map(currEnergy, 0, maxEnergy, 0, maxW), dim - 20);
	
	// health
	if (gameSpeed != 0) {
		if(currEnergy < maxEnergy*0.03) {
			currHealth -= 1/60 * gameSpeed;
		} else if(currEnergy > maxEnergy*0.9) {
			currHealth += 1/60 * gameSpeed;
		}
		// energy cannot be lower than 0 and not higher than maxEnergy
		currHealth = min(maxHealth, currHealth);
		currHealth = max(0, currHealth);

		if(currHealth == 0){
			gameOver();
		}
	}
	
	fill("maroon");
	rect(xPos + dim + 10 + jitter, yPos + (dim * 1.2 * p++) + 10 + jitter, map(currHealth, 0, maxHealth, 0, maxW), dim - 20);

	// food
	// 1h work = +3 food
	// 1h else = -1/3 food
	if (gameSpeed != 0) {
		if(getScheduledActivity() == "Work") {
			let gainFactor = currHappiness < 40 ? 1.5 : 3;
			currFood += (1/60 * gameSpeed) * gainFactor;
		} else {
			currFood -= (1/60 * gameSpeed) * 1/3;
		}

		// food cannot be lower than 0 and not higher than maxFood
		currFood = min(maxFood, currFood);
		currFood = max(0, currFood);
	}

	fill("limegreen");
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, map(currFood, 0, maxFood, 0, maxW), dim - 20);
	
	//happiness
	if (gameSpeed != 0) {
		let moodFactor = 1, scheduleFactor;

		if(currEnergy <= maxEnergy/10 || currHealth <= maxHealth/2){
			if(getScheduledActivity() == "Work") {
				// negative effect doubled
				if (difficulty == 1) {
					moodFactor = 0;
				} else {
					moodFactor = 2;
				}
			} else {
				// positive effect halved
				moodFactor = 1/2;
			}
		} 
		
		if(getScheduledActivity() == "Recreation") {
			// increase
			scheduleFactor = 1;
		} else if(getScheduledActivity() == "Work") {
			
			if(difficulty == 1) { 
				scheduleFactor = 1/5;
			}
			// decrease
			else if(difficulty == 3) { 
				scheduleFactor = (-4);
			} else {
				scheduleFactor = (-2);
			}
		} else {
			// slight increase
			scheduleFactor = 1/3;
		}
		currHappiness += (1/60 * gameSpeed) * scheduleFactor * moodFactor;
		
		// Happiness cannot be lower than 0 and not higher than maxHappiness
		currHappiness = min(maxHappiness, currHappiness);
		currHappiness = max(0, currHappiness);

		setHappiness();
	}

	fill("yellow");
	rect(xPos + dim + 10, yPos + (dim * 1.2 * p++) + 10, map(currHappiness, 0, maxHappiness, 0, maxW), dim - 20);
}

function gameOver(){
	showGameOverInfo();
}

let divSleepBox, divWorkBox, divRecreationBox;
function loadSchedule() {
	var startingX = 40,
		startingY = 130,
		w = 30;

	let divScheduleText = createDiv("Schedule:").position(startingX, 78);
	divScheduleText.mouseOver(pulse).mouseOut(pulse).mouseReleased(showInfoSchedule);
	divScheduleText.addClass('scheduleText');

	divSleepBox = createDiv().position(230, 80);
	divSleepBox.addClass('scheduleBox').addClass('sleep').addClass('sleep_selector');
	divSleepBox.elt.name = "Sleep";
	divSleepBox.elt.type = "select";

	let divSleepText = createDiv("Sleep").position(230 + w + 10, 78);
	divSleepText.addClass('scheduleText').addClass('sleep');

	divWorkBox = createDiv().position(365, 80);
	divWorkBox.addClass('scheduleBox').addClass('work').addClass('work_selector');
	divWorkBox.elt.name = "Work";
	divWorkBox.elt.type = "select";

	let divWorkText = createDiv("Work").position(365 + w + 10, 78);
	divWorkText.addClass('scheduleText').addClass('work');

	divRecreationBox = createDiv().position(490, 80);
	divRecreationBox.addClass('scheduleBox').addClass('recreation').addClass('recreation_selector');
	divRecreationBox.elt.name = "Recreation";
	divRecreationBox.elt.type = "select";

	let divRecreationText = createDiv("Recreation").position(490 + w + 10, 78);
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

var clickTarget, scheduleTargetName, scheduleInteraction = false, scheduleElement;
function scheduleClickListener(e) {
	//el = e.explicitOriginalTarget;
	scheduleElement = e.target;
	let left = scheduleElement.style.left.match(/\d/g).join('');
	left = parseInt(left, 10)
	let top = scheduleElement.style.top.match(/\d/g).join('');
	top = parseInt(top, 10)
	let height = scheduleElement.clientHeight;
	let width = scheduleElement.clientWidth;

	clickTarget = {
		x: left,
		y: top,
		w: width,
		h: height
	}

	let type = scheduleElement.type;
	if (type == "put") {
		if (scheduleInteraction) {
			let element = select('#' + scheduleElement.id);
			element.class('').addClass('scheduleBox').addClass(scheduleTargetName.toLowerCase());
			dailySchedule[scheduleElement.scheduleIndex] = scheduleTargetName;
		}
	} else {
		scheduleTargetName = scheduleElement.name;
	}
}

function mouseReleased() {
	if (clickTarget !== undefined && mouseInside(clickTarget.x, clickTarget.y, clickTarget.w, clickTarget.h) && scheduleTargetName !== undefined) {
		scheduleInteraction = true;
	} else {
		scheduleInteraction = false;
		scheduleTargetName = undefined;
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
	let c = color('hsba(180, 100%, 0%,' + 0.8 * (1 - season(getSunHeight()) / 100) + ')');
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
var eclipse = false;
var getSunHeight = function () {
	return eclipse ? -1 : -cos(timeCounter);
}

function debugDisplay() {
	//let tSize = 18, xPos = 1030, yPos = 380, p = 0;
	let tSize = 18, xPos = 30, yPos = 500, p = 0;
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

	print(mouseX, mouseY);
}

function updateDelta() {
	var now = new Date();
	deltaT = now - then;
	then = now;
	deltaTLimiter();

	timeCounter += RAD_PER_MIN * (deltaT / TICK) * gameSpeed;
	timeCounterRelative = (timeCounter % TWO_PI) / TWO_PI;
	dayNr = floor(timeCounter / TWO_PI);

	frameCounter += 1;
	frameCounterGame += gameSpeed;
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

var clockTooltip;
function loadClock() {
	let xPos = 925, yPos = 350, dim = 40;

	let divClock = createDiv();
	divClock.class('clock');
	let divHour = createSpan();
	divHour.class('hour');
	let divMinute = createSpan();
	divMinute.class('minute');
	let divDot = createSpan();
	divDot.class('dot');

	clockTooltip = createSpan().addClass("tooltiptext");

	divHour.parent(divClock);
	divMinute.parent(divClock);
	divDot.parent(divClock);
	clockTooltip.parent(divClock);
	divClock.position(xPos, yPos).size(dim, dim);
}

const digits = { minimumIntegerDigits: 2 };
function updateClock() {
	var currentMins = floor(map(timeCounterRelative, 0, 1, 0, 1440));
	currHour = floor(currentMins / 60);
	currMin = floor(currentMins % 60);
	clockTooltip.html("Time:\t" + currHour.toLocaleString(undefined, digits) + ":" + currMin.toLocaleString(undefined, digits));
	clockTooltip.html("<br>Day:\t" + dayNr, true);
	
	const hourDeg = ((currHour + 11) % 12 + 1) * 30;
	const minuteDeg = currMin * 6;
	
	document.querySelector('.hour').style.transform = `rotate(${hourDeg}deg)`;
	document.querySelector('.minute').style.transform = `rotate(${minuteDeg}deg)`;
}
