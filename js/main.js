var settings;

var svg;
var svgStore;

$(document).ready(function() {
	settings = loadFileSync('res/config.json', 'json');

	$(".controlsSpeed").hover(function()
	{ 
		$(this).toggleClass('shadow');
	});

	//svgStore = loadSvg("#playbutton", "img/play_buttons.svg");
	clock();
	setInterval(clock, 1000);
	console.log("ready!");

});

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
	const date = new Date();

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
