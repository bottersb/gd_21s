// date, date, distance (%)
function fadeColor(lower, upper, fade){
	var l = hexToRgb(lower);
	var u = hexToRgb(upper);
	var newRed = ((u.r - l.r) * fade ) + l.r;
	var newGreen = ((u.g - l.g) * fade ) + l.g;
	var newBlue = ((u.b - l.b) * fade ) + l.b;

	return rgbToHex(newRed, newGreen, newBlue);
}

// requires 6 digit hex value, not 	necessarily 
function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

// will return 
function rgbToHex(red, green, blue) {
	const rgb = (red << 16) | (green << 8) | (blue << 0);
	return '#' + (0x1000000 + rgb).toString(16).slice(1);
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

function loadSvg(domTarget, location){
	var contents = loadFileSync(location);
	return SVG().addTo(domTarget).size(1000, 1000).svg(contents);
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

function logAllEvents(el){
	el.bind(getAllEvents(el[0]), function(e) {
    	console.log(e);
	});
}

function l(msg){
	console.log(msg);
}