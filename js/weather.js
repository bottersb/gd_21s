var weather = true,
weatherInterval = MIN_PER_DAY * 2,
weatherDuration = MIN_PER_DAY * 2.5,
weatherRandomness = false,
weatherStart = 0,
weatherEnd = 0;

var cloudCount = 8;
var clouds = [];
function drawAllClouds() {
	if (frameCounter % (MIN_PER_DAY / 4) == 0) {
		clouds = [];
		for (let i = 0; i < 50; i++) {
			clouds.push(new Cloud(RAND(width) - (width * 1.5), RAND(height)));
		}
	}

	var l = clouds.length;
	while (l--) {
		clouds[l].update(3).draw()
	}

}

var Cloud = class {
	components = [];
	xOffset = 0;
	z = 0;

	constructor(x, y, factor = 1) {
		var size = round(250 * factor);
		var kummuli = round(8 * factor);
		this.z = RANDP(3);
		for (let i = 0; i < kummuli; i++) {
			let w = RAND(size),
				x_ = x + RAND(size),
				y_ = y + (RAND(size) / 5),
				h = round(w / 3);
			this.components.push({ x: x_, y: y_, w: w, h: h });
		}
		return this;
	}

	draw() {
		ellipseMode(CENTER);
		noStroke();
		for (let i = 0; i < this.components.length; i++) {
			let c = this.components[i];
			for (let j = 0; j < 3; j++) {
				fill(255 - (j * 10));
				c.x = c.x + this.xOffset + this.z;
				ellipse(c.x, c.y - (2 * j), c.w, c.h);
			}
		}
		this.xOffset = 0;
	}

	update(v) {
		this.xOffset = v*gameSpeed;
		return this;
	}
}

// TODO actually check weather
function checkWeather() {
	if (!weather) {
		return;
	}

	if (weatherEnd <= frameCounter) {
		weatherStart = frameCounter + RANDP(2 * weatherInterval);
		weatherEnd = weatherStart + RANDP(2 * weatherDuration);
	}
}