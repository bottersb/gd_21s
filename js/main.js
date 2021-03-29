var date;
const minPerDay = 1440;

var tickSpeed = 50; // milliseconds till next frame
var gamespeed; // speed factor for minute step

var tickCounter = 0;

var clockTimer; // timers

$(document).ready(function() {
	initDate();
	updateClock();
	adjustGameSpeed(0, $("#pause"));
	setListeners();

	console.log("ready!");
});

function initDate(){
	var tmp = new Date();
	date = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate(), 12);
}

// timer
function setTimers(){
	clockTimer = setInterval(update, tickSpeed);
}

function update(){
	l(tickCounter);
	if(tickCounter >= minPerDay) {
		tickCounter=0;
	} else 	{
		tickCounter += (1*gamespeed);
	}
	setClock();
	updateClock();
	updateColor();
}

function clearTimers(){
	clearInterval(clockTimer);
}

// general app speed
function updateSpeed(){
	clearTimers();
	if(gamespeed != 0) {
		setTimers();
	}
}

function adjustGameSpeed(factor, element) {
	gamespeed = factor;
	updateSpeed();
	$('.controlsSpeed').removeClass('selected');
	$(element).toggleClass('selected');
}


// color
function updateColor(){
	$("#playbutton").css({
		"background-color": getColorForTime()
	});
}

var upperSunPhase, lowerSunPhase, currSunPhaseIndex = 0, blendPercent;
function getColorForTime(){
	//var dayCiclePercent = Math.floor(tickCounter/minPerDay);
	
	// index of tickCounter placed after equal or more than sunInfo timing,
	// sun timing lookup value starts at 0
	// sunInfo[0].timing = tickCounter = 0 will produce i = 1
	// therefore index always has lower, not always upper sun phase
	var i = sunInfo.map(data => data["timing"]).findIndex(data => data > tickCounter);
		
	if(i != currSunPhaseIndex){
		lowerSunPhase = sunInfo[i-1];
		if (i != sunInfo.length) {
			// normal operation
			upperSunPhase = sunInfo[i];
		} else {
			// last cicle phase
			upperSunPhase = {"name":"solarNoon","color": "#f9f1c9", "timing":minPerDay, "brightness":1.4};
		}
	}

	blendPercent = (tickCounter - lowerSunPhase.timing) / upperSunPhase.timing;
	var newBrightness = (blendPercent * (upperSunPhase.brightness - lowerSunPhase.brightness)) + lowerSunPhase.brightness;
	$("#playbutton").css({"filter":"brightness("+newBrightness+")"});
}



// clock
function updateClock(){
	const hour = ((date.getHours() + 11) % 12 + 1) * 30;
	const minute = date.getMinutes() * 6;

	document.querySelector('.hour').style.transform = `rotate(${hour}deg)`;
	document.querySelector('.minute').style.transform = `rotate(${minute}deg)`;
}

function setClock() {
	// minute lookahead
	date = new Date(date.getTime() + (1000*60*gamespeed));
	// do check and do something on new day
}

// listener
function setListeners(){
	$(".controlsSpeed").hover(function() { 
		$(this).toggleClass('shadow');
	});
	$("#pause").click(function() {
		adjustGameSpeed(0, this);
	});
	$("#play").click(function() {
		adjustGameSpeed(1, this);
	});
	$("#faster").click(function() {
		adjustGameSpeed(2, this);
	});
	$("#fastest").click(function() {
		adjustGameSpeed(4, this);
	});
}
