var settings;

var svg;
var svgStore;

var date = new Date();
var tickSpeed = 50; // milliseconds till next frame
var minuteStep = 1; // minutes per tick
var gamespeed = 0; // speed factor for minute step

var sunPercent, clockTimer;

var sunAnimDuration, solarMinPerDay;

var currentPercent = 0;

const pos = {"lat":48.2, "lon":16.3}; //vienna, at
var sunTimes, sunTimesSorted, sunTimesTomorow;
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

function setSunTimer(){
	return setInterval(function(){
		if(currentPercent < 100)
		{
			currentPercent += 1;
		}
		else {
			currentPercent = 0;
		}
		updateInfo();
	}, Math.ceil(sunAnimDuration/100));
}

function setClockTimer(){
	return setInterval(clock, tickSpeed);
}

function updateInfo(){
	$("#info").text(currentPercent + '%');
}

$(document).ready(function() {
	settings = loadFileSync('res/config.json', 'json');
	getSunData();
	initClock();
	adjustGameSpeed(0, $("#pause"));
	updateInfo();
	
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

	console.log("ready!");

});

function fadeColor(lower, upper, fade){
	var l = hexToRgb(lower);
	var u = hexToRgb(upper);
	var newRed = ((u.r - l.r) * fade ) + l.r;
	var newGreen = ((u.g - l.g) * fade ) + l.g;
	var newBlue = ((u.b - l.b) * fade ) + l.b;

	return rgbToHex(newRed, newGreen, newBlue);
}

function getColorForTime(time){
	var result = {};
	var i = sunTimesSorted.map(t => t[1]).findIndex(st => st > time);
	//TODO crashes when done before nadir
	var duration = sunTimesSorted[i][1] - sunTimesSorted[i-1][1];
	var fade = (sunTimesSorted[i][1] - time) / duration;
	
	result["index"] = i;
	result["duration"] = duration;
	result["color"] = fade;

	return fadeColor(color[sunTimesSorted[i-1][0]], color[sunTimesSorted[i][0]], fade);
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function rgbToHex(red, green, blue) {
	const rgb = (red << 16) | (green << 8) | (blue << 0);
	return '#' + (0x1000000 + rgb).toString(16).slice(1);
}

function adjustGameSpeed(factor, element) {
	gamespeed = factor;
	updateAnimDuration();
	clearInterval(sunPercent);
	clearInterval(clockTimer);
	if(factor <= 0) {
		$('.sunCicle').css('animation-play-state', 'paused');
	} else {
		$('.sunCicle').css('animation-duration', sunAnimDuration + "ms");
		$('.sunCicle').css('animation-play-state', 'running');
		sunPercent = setSunTimer();
		clockTimer = setClockTimer();
	}

	$('.controlsSpeed').removeClass('selected');
	$(element).toggleClass('selected');
}

function updateAnimDuration(){
	sunAnimDuration = Math.floor(((solarMinPerDay/minuteStep)*tickSpeed)/(gamespeed > 0 ? gamespeed : 1));
}

function getSunData(){
	sunTimes = SunCalc.getTimes(date, pos.lat, pos.lon);
	sunTimesTomorow = SunCalc.getTimes(new Date (sunTimes.solarNoon.getTime() + 86400000), pos.lat, pos.lon);
	solarMinPerDay = (sunTimesTomorow.solarNoon - sunTimes.solarNoon)/1000/60;
	updateAnimDuration();
	sunTimesSorted = [];
	for (var time in sunTimes) {
		sunTimesSorted.push([time, sunTimes[time]]);
	}

	sunTimesSorted.sort(function(a, b) {
		return a[1] - b[1];
	});

	SunCalc.getPosition(date,pos.lat, pos.lon);
}

function loadSvg(domTarget, location){
	var contents = loadFileSync(location);
	return SVG().addTo(domTarget).size(1000, 1000).svg(contents);
}

function loadFileSync(location, dataType){
	var result = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': location,
		'dataType': dataType,
		'success': function (data) {
			result = data;
		}
	});
	return result;
}

function clock() {
	var newDate = new Date(date.getTime() + (minuteStep*60000)*gamespeed);
	// check for new day
	if(newDate.getDay() != date.getDay()){
		getSunData();
	}
	date = newDate;
	const hour = ((date.getHours() + 11) % 12 + 1) * 30;
	const minute = date.getMinutes() * 6;

	document.querySelector('.hour').style.transform = `rotate(${hour}deg)`
	document.querySelector('.minute').style.transform = `rotate(${minute}deg)`
}

function initClock(){
	date = sunTimes.solarNoon;
	const hour = ((date.getHours() + 11) % 12 + 1) * 30;
	const minute = date.getMinutes() * 6;

	document.querySelector('.hour').style.transform = `rotate(${hour}deg)`;
	document.querySelector('.minute').style.transform = `rotate(${minute}deg)`;
}

function getAllEvents(element) {
	var result = [];
	for (var key in element) {
		if (key.indexOf('on') === 0) {
			result.push(key.slice(2));
		}
	}
	return result.join(' ');
}

function l(msg){
	console.log(msg);
}

const animator = {
	items: [],
	add(...items) {
		this.items.push(...items);
	},
	get(index) {
		return this.items[index];
	},
	toggle(){

	}
};
