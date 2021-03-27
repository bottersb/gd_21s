var settings;

var svg;
var svgStore;

var date = new Date();
var gamespeed = 0;
var minuteStep = 1;

$(document).ready(function() {
	settings = loadFileSync('res/config.json', 'json');

	$("#pause").toggleClass('selected');
	$(".controlsSpeed").hover(function()
	{ 
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


	//svgStore = loadSvg("#playbutton", "img/play_buttons.svg");
	clock();
	setInterval(clock, 50);
	console.log("ready!");

});

function adjustGameSpeed(factor, element) {
	gamespeed = factor;
	$('.controlsSpeed').removeClass('selected');
	$(element).toggleClass('selected')
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
	
	date = new Date(date.getTime() + (minuteStep*60000)*gamespeed);
	const hours = ((date.getHours() + 11) % 12 + 1);
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	const hour = hours * 30;
	const minute = minutes * 6;

	document.querySelector('.hour').style.transform = `rotate(${hour}deg)`
	document.querySelector('.minute').style.transform = `rotate(${minute}deg)`
}

function l(msg){
	console.log(msg);
}
