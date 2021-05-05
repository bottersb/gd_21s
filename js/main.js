const SEED = 42,
	RAND = SeedRandom(SEED),
	MIN_PER_DAY = 24 * 60, // 1440
	RAD_PER_MIN = (2 * Math.PI) / MIN_PER_DAY; // ~0.004363, 

const RANDP = function () {
	return RAND(100) / 100;
}

const FRAMES_PER_SEC = 60, // when 60 fps, then:
	TICK = 1000 / FRAMES_PER_SEC, // ~16,667ms
	FULL_DAY = TICK * MIN_PER_DAY; // 24 seconds irl

// Easing of sun height
const SUMMER = function (v) { return max(0.1, EasingFunctions.easeOutCubic(v) * 99) },
	WINTER = function (v) { return max(0.1, EasingFunctions.easeInCubic(v) * 80) },
	SPRING = function (v) { return max(0.1, EasingFunctions.easeInOutCubic(v) * 90) };
	FALL = function (v) { return max(0.1, EasingFunctions.easeInOutCubic(v) * 90) };

const col_main = "#40752D",
	col_main_t70 = "#40752Db3",
	col_main_dark = "#335E24",
	col_main_darkest = "#1A2F12",
	col_main_light = "#5ca840",
	col_main_lighter = "#D9E3D5",
	col_main_lightest = "#ECF4E9";

// settings
var gameSpeed = 1,
	season = SUMMER,
	debug = true, // verbose output and display
	debugUpdateDelay = FRAMES_PER_SEC / 3; // in frames

var speedLimit = true, // fps upper limit to defined value of FRAMES_PER_SEC
	skipLimit = false, // app may stop bc of background, when false progress will updated according to deltaT 
	maxFrameSkipAmount = 1; // max amount of frames skipped 

// related, normalized time representations and references
var frameCounter = 0, // frame counter, integer increased each tick
	fpsShow = 0, // buffered value for delay	
	timeCounter = 0, // current day time normalized to distance on unit circle
	timeCounterRelative = 0, // percent of full day 
	fpsNow = 0, // true time since last frame may vary and therefore the fps
	then = Date.now(), // time reference for deltaT
	deltaT = 0; // progress in ms since last frame

var sunColor = {},
	skyColor = {};

// fonts
var fontRegular;

// buttons
var pause, play, faster, fastest;

// indicators
var i_energy, i_light, i_melatonin;

const imgSize = 640;
var edge = 600, padding = 10;
var bed, bonsai, lamp, desk, ball, shelf, chair, laptop, counter, wecker, monitor, board;

var dailySchedule = [
	"Sleep",
	"Sleep",
	"Sleep",
	"Sleep",
	"Sleep",
	"Sleep",
	"Sleep",
	"Recreation",
	"Recreation",
	"Work",
	"Work",
	"Work",
	"Work",
	"Recreation",
	"Work",
	"Work",
	"Work",
	"Work",
	"Recreation",
	"Recreation",
	"Work",
	"Work",
	"Recreation",
	"Sleep"
];


// compact solution: https://gist.github.com/gre/1650294
EasingFunctions = {
	// no easing, no acceleration
	linear: t => t,
	// accelerating from zero velocity
	easeInQuad: t => t * t,
	// decelerating to zero velocity
	easeOutQuad: t => t * (2 - t),
	// acceleration until halfway, then deceleration
	easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
	// accelerating from zero velocity 
	easeInCubic: t => t * t * t,
	// decelerating to zero velocity 
	easeOutCubic: t => (--t) * t * t + 1,
	// acceleration until halfway, then deceleration 
	easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
	// accelerating from zero velocity 
	easeInQuart: t => t * t * t * t,
	// decelerating to zero velocity 
	easeOutQuart: t => 1 - (--t) * t * t * t,
	// acceleration until halfway, then deceleration
	easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
	// accelerating from zero velocity
	easeInQuint: t => t * t * t * t * t,
	// decelerating to zero velocity
	easeOutQuint: t => 1 + (--t) * t * t * t * t,
	// acceleration until halfway, then deceleration 
	easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
}

function SeedRandom(state1, state2) {
	var mod1 = 4294967087
	var mul1 = 65539
	var mod2 = 4294965887
	var mul2 = 65537
	if (typeof state1 != "number") {
		state1 = +new Date()
	}
	if (typeof state2 != "number") {
		state2 = state1
	}
	state1 = state1 % (mod1 - 1) + 1
	state2 = state2 % (mod2 - 1) + 1
	function random(limit) {
		state1 = (state1 * mul1) % mod1
		state2 = (state2 * mul2) % mod2
		if (state1 < limit && state2 < limit && state1 < mod1 % limit && state2 < mod2 % limit) {
			return random(limit)
		}
		return (state1 + state2) % limit
	}
	return random
}

// interior
const fenster = {
	x: 310,
	y: 350,
	w: 250,
	h: 150
}, i_ball = {
	x: 600,
	y: 600,
	w: 50,
	h: 50
}, i_lamp = {
	x: 300,
	y: 560,
	w: 100,
	h: 140
}, i_bed = {
	x: 440,
	y: 600,
	w: 400,
	h: 200
}, i_bonsai = {
	x: 700,
	y: 570,
	w: 100,
	h: 100
}, i_desk = {
	x: 950,
	y: 570,
	w: 240,
	h: 160
}, i_chair = {
	x: 800,
	y: 600,
	w: 140,
	h: 180
}, i_laptop = {
	x: 950,
	y: 480,
	w: 80,
	h: 50
}, i_board = {
	x: 1130,
	y: 440,
	w: 260,
	h: 190
}, i_shelf = {
	x: 680,
	y: 400,
	w: 120,
	h: 80
}, i_counter = {
	x: 440,
	y: 630,
	w: 300,
	h: 80
};