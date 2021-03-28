var date = new Date();
var tickSpeed = 50; // milliseconds till next frame
var minuteStep = 1; // minutes per tick
var gamespeed = 0; // speed factor for minute step
var currentPercent = 0; // approx sun percent

var tickCounter = 0;

var sunPercent, clockTimer; // timer

var sunAnimDuration, minTillNextNoon; // daily

// sun
const pos = {"lat":48.2, "lon":16.3}; //vienna, at
var sunTimes, sunTimesSorted, sunTimesTomorrow;

// lookup
var color = {
	"nadir":"#000000",
	"nightEnd":"#050510",
	"dawn":"#372e38",
	"sunrise":"#6d555d",
	"sunriseEnd":"#a4827d",
	"goldenHourEnd":"#d4b79f",
	"solarNoon":"#f9f1c9",
	"goldenHour":"#d4b79f",
	"sunsetStart":"#a4827d",
	"sunset":"#6d555d",
	"dusk":"#372e38",
	"night":"#050510"
}; 

$(document).ready(function() {
	getSunData(); // first
	initClock();
	adjustGameSpeed(0, $("#pause"));
	setListener();
	
	console.log("ready!");
});

function update(){
	tickCounter += 1;
	//l(tickCounter);

	clock();
	updateColor();
}

function getSunData(){
	// store sun times for here and now
	sunTimes = SunCalc.getTimes(date, pos.lat, pos.lon);
	
	// store sorted sun times for here and now
	sortSunTimes();
	
	// store sun times plus 1 day
	var tomorrow = new Date (sunTimes.solarNoon.getTime() + 1000*60*60*24);
	sunTimesTomorrow = SunCalc.getTimes(tomorrow, pos.lat, pos.lon);

	// calculate exact minutes until full sun cicle
	minTillNextNoon = (sunTimesTomorrow.solarNoon - sunTimes.solarNoon)/1000/60;

	// calculate fuzzy minutes until full sun cicle
	minTillNextNoon = Math.round(minTillNextNoon*2)/2;
	
	updateSunAnimDuration();
}

// minTillNextNoon to real world ms according to current 
function updateSunAnimDuration(){
	sunAnimDuration = Math.floor(((minTillNextNoon/minuteStep)*tickSpeed)/(gamespeed > 0 ? gamespeed : 1));	
}

// sunTimesSorted reset and refill
function sortSunTimes(){
	sunTimesSorted = [];
	for (var time in sunTimes) {
		sunTimesSorted.push([time, sunTimes[time]]);
	}
	sunTimesSorted.sort(function(a, b) {
		return a[1] - b[1];
	});
}

// color
function updateColor(){
	$("#playbutton").css({
		"background-color": getColorForTime(date)
	});
}

function getColorForTime(time){
	// get new index
	var i = sunTimesSorted.map(t => t[1]).findIndex(st => st > time);

	var duration;
	if(i == 0) {
		duration = date - sunTimesSorted[i][1];
	} else {
		duration = sunTimesSorted[i][1] - sunTimesSorted[i-1][1];
	}
	var fade = (sunTimesSorted[i][1] - time) / duration;

	var col;
	if(i == 0) {
		col = fadeColor(date, color[sunTimesSorted[i+1][0]], fade);
	} else {
		col = fadeColor(color[sunTimesSorted[i-1][0]], color[sunTimesSorted[i][0]], fade);
	}
	return col;
}

// clock
function initClock(){
	date = sunTimes.solarNoon;
	const hour = ((date.getHours() + 11) % 12 + 1) * 30;
	const minute = date.getMinutes() * 6;

	document.querySelector('.hour').style.transform = `rotate(${hour}deg)`;
	document.querySelector('.minute').style.transform = `rotate(${minute}deg)`;
}

function clock() {
	// minute lookahead
	var newDate = new Date(date.getTime() + (1000*60*gamespeed));
	// check for new day
	if(newDate.getDay() != date.getDay()){
		// get sun data for current day + tomorrow
		getSunData();
	}
	// update for exact time
	date = newDate;
	const hour = ((date.getHours() + 11) % 12 + 1) * 30;
	const minute = date.getMinutes() * 6;
	document.querySelector('.hour').style.transform = `rotate(${hour}deg)`;
	document.querySelector('.minute').style.transform = `rotate(${minute}deg)`;
}

// general app speed
function updateSpeed(){
	updateSunAnimDuration();
	clearTimers();
	setTimers();
}

function adjustGameSpeed(factor, element) {
	gamespeed = factor;
	if(factor <= 0) {
		$('.sunCicle').css('animation-play-state', 'paused');
	} else {
		$('.sunCicle').css('animation-duration', sunAnimDuration + "ms");
		$('.sunCicle').css('animation-play-state', 'running');
	}

	$('.controlsSpeed').removeClass('selected');
	$(element).toggleClass('selected');
}

// timer
function setSunPercentTimer(){
	return setInterval(function(){
		if(currentPercent < 100)
		{
			currentPercent += 1;
		}
		else {
			currentPercent = 0;
		}
		$("#info").text(currentPercent + '%');
	}, Math.ceil(sunAnimDuration/100));
}

function setTimers(){
	sunPercent = setSunPercentTimer();
	clockTimer = setInterval(update, tickSpeed);
}

function clearTimers(){
	l("clear timer");
	clearInterval(sunPercent);
	clearInterval(clockTimer);
}

// listener
function setListener(){
	$(".controlsSpeed").hover(function() { 
		$(this).toggleClass('shadow');
	});
	$("#pause").click(function() {
		adjustGameSpeed(0, this);
		updateSpeed();
	});
	$("#play").click(function() {
		adjustGameSpeed(1, this);
		updateSpeed();
	});
	$("#faster").click(function() {
		adjustGameSpeed(2, this);
		updateSpeed();
	});
	$("#fastest").click(function() {
		adjustGameSpeed(4, this);
		updateSpeed();
	});
}