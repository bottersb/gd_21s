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