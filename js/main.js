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
var gameSpeed = 0,
	season = SUMMER,
	debug = false, // verbose output and display
	debugUpdateDelay = FRAMES_PER_SEC / 3; // in frames

var speedLimit = true, // fps upper limit to defined value of FRAMES_PER_SEC
	skipLimit = false, // app may stop bc of background, when false progress will updated according to deltaT 
	maxFrameSkipAmount = 1; // max amount of frames skipped 

// related, normalized time representations and references
var frameCounter = 0, // frame counter, integer increased each tick
	fpsShow = 0, // buffered value for delay	
	timeCounter = 0, // current day time normalized to distance on unit circle
	timeCounterRelative = 0, // percent of full day
	dayNr = 0;
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
var i_energy, i_light, i_melatonin, i_heart;

const imgSize = 640;
var edge = 600, padding = 10;
var bed, bonsai, lamp, desk, ball, shelf, chair, laptop, counter, wecker, monitor, board, ceilingLamp;

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
	x: 1050,
	y: 570,
	w: 50,
	h: 50
}, i_lamp = {
	x: 580,
	y: 490,
	w: 100,
	h: 140
}, i_bed = {
	x: 240,
	y: 500,
	w: 400,
	h: 200
}, i_bonsai = {
	x: 650,
	y: 520,
	w: 100,
	h: 100
}, i_desk = {
	x: 830,
	y: 490,
	w: 240,
	h: 160
}, i_chair = {
	x: 730,
	y: 510,
	w: 140,
	h: 180
}, i_laptop = {
	x: 910,
	y: 455,
	w: 80,
	h: 50
}, i_board = {
	x: 1000,
	y: 350,
	w: 260,
	h: 190
}, i_shelf = {
	x: 620,
	y: 360,
	w: 120,
	h: 80
}, i_counter = {
	x: 290,
	y: 590,
	w: 300,
	h: 80
}, i_postit = {
	x: 1030,
	y: 370,
	w: 40,
	h: 40
}, i_ceilingLamp = {
	x: 830,
	y: 170,
	w: 80,
	h: 90
};

var infoBoxLongFiller = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod temporiii incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
infoBoxGameInfo = "<b>SLEEP GAME</b><br> Simulate your Day-Night! Organize your day in order to stay energetic and healthy. Sleep is a naturally recurring state of mind and body, characterized by altered consciousness, relatively inhibited sensory activity, reduced muscle activity and inhibition of nearly all voluntary muscles during rapid eye movement (REM) sleep, and reduced interactions with surroundings.",
infoBoxLight = "<b>Light</b><br> When eyes receive light from the sun, the pineal gland's production of melatonin is inhibited and the hormones produced keep the human awake. When the eyes do not receive light, melatonin is produced in the pineal gland and the human becomes tired.",
infoBoxMelatonin = "<b>Melatonin</b><br> Melatonin is a hormone primarily released by the pineal gland at night, and has long been associated with control of the sleep–wake cycle.",
infoBoxEnergy = "<b>Energy</b><br> This indicator displays your current energy level. A full bar means you have plenty of energy to spare for the tasks of the day such as programming a game about sleep. A low bar means you are very tired and should go to sleep. Staying awake for extended periods of time on end can have negative effects on your health!",
infoBoxHealth = "<b>Health</b><br> Sleep has a direct effect on your health! Sleep plenty to stay healthy. Not sleeping enough can make you sick as your body has a no time regenerate and fight off diseases. Not sleeping for several days can even be fatal!",
infoBoxSchedule = "<b>Schedule</b><br> This is your schedule. It shows your daily routine in hourly segments starting at 0 (the first hour of the day) and ending at 23. You can adjust it by clicking on the colored boxes next to an activity and then clicking in the position in the schedule."
