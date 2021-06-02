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
	frameCounterGame = 0,
	fpsShow = 0, // buffered value for delay	
	timeCounter = 0, // current day time normalized to distance on unit circle
	timeCounterRelative = 0, // percent of full day
	dayNr = 0,
	currHour = 0,
	currMin = 0,
	fpsNow = 0, // true time since last frame may vary and therefore the fps
	then = Date.now(), // time reference for deltaT
	deltaT = 0; // progress in ms since last frame

var sunColor = {},
	skyColor = {};

// fonts
var fontRegular;

// buttons
var pause, play, faster, fastest;

// selectors
var sRandom, sDifficulty;

// indicators
var i_energy, i_light, i_melatonin, i_heart, i_apple, i_smiley,
i_smiley_sad, i_smiley_unhappy, i_smiley_neutral, i_smiley_happy, i_smiley_ecstatic;

const imgSize = 640;
var edge = 600, padding = 10;
var bed, bonsai, lamp, desk, ball, shelf, chair, laptop, counter, wecker, monitor, board, ceilingLamp, dreamcatcher, fireplace;
var outdoor, windowFrame;

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
	"Recreation",
	"Recreation",
	"Sleep"
];

var randomEvents = [
	{
		"id":"food_01",
		"desc": "<b>Food Spoiled</b><br> Oh no! Your food was stored incorrectly and has gone bad!",
		"singular":true,
		"duration": 0
	},
	{
		"id":"work_02",
		"desc": "<b>Good Work</b><br> You did an incredibly good job with your work! This gave you a boost to your Energy, Happiness and of course Food.",
		"singular":true,
		"duration": 0
	}/*,
	{
		"id":"light_01",
		"desc": "<b>Solar Eclipse</b><br> The sun is blocked by the moon and will not shine! Although this phenomnon is temporary it will last unnaturally long.",
		"singular":false,
		"duration": 2160
	},
	{
		"id":"health_01",
		"desc": "<b>Sickness</b><br> You catched a cold. Your Energy and Health is limited.",
		"singular":false,
		"duration": 4320
	},
	{
		"id":"work_01",
		"desc": "<b>Super boring work</b><br> The work your are currently doing is immensly boring. The next 24 units of work will be twice as exhausting!",
		"duration": 24
	}*/
	
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
	x: 230,
	y: 570,
	w: 50,
	h: 50
}, i_lamp = {
	x: 580,
	y: 470,
	w: 100,
	h: 150
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
	y: 470,
	w: 240,
	h: 190
}, i_chair = {
	x: 730,
	y: 510,
	w: 140,
	h: 180
}, i_laptop = {
	x: 910,
	y: 440,
	w: 80,
	h: 50
}, i_board = {
	x: 1000,
	y: 310,
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
	y: 180,
	w: 80,
	h: 90
}, i_poster = {
	x: 800,
	y: 380,
	w: 60,
	h: 90
}, i_dreamcatcher = {
	x: 800,
	y: 380,
	w: 60,
	h: 120
}, i_fireplace = {
	x: 1070,
	y: 480,
	w: 200,
	h: 160
};

var infoBoxLongFiller = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod temporiii incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
infoBoxGameInfo = "<b>SLEEP GAME</b><br> Simulate your Day-Night! Organize your day in order to stay energetic and healthy. Sleep is a naturally recurring state of mind and body, characterized by altered consciousness, relatively inhibited sensory activity, reduced muscle activity and inhibition of nearly all voluntary muscles during rapid eye movement (REM) sleep, and reduced interactions with surroundings.",
infoBoxLight = "<b>Light</b><br> When eyes receive light from the sun, the pineal gland's production of melatonin is inhibited and the hormones produced keep the human awake. When the eyes do not receive light, melatonin is produced in the pineal gland and the human becomes tired.",
infoBoxMelatonin = "<b>Melatonin</b><br> Melatonin is a hormone primarily released by the pineal gland at night, and has long been associated with control of the sleep–wake cycle.",
infoBoxEnergy = "<b>Energy</b><br> This indicator displays your current energy level. A full bar means you have plenty of energy to spare for the tasks of the day such as programming a game about sleep. A low bar means you are very tired and should go to sleep. Staying awake for extended periods of time on end can have negative effects on your health!",
infoBoxHealth = "<b>Health</b><br> Sleep has a direct effect on your health! Sleep plenty to stay healthy. Not sleeping enough can make you sick as your body has a no time regenerate and fight off diseases. Not sleeping for several days can even be fatal!",
infoBoxSchedule = "<b>Schedule</b><br> This is your schedule. It shows your daily routine in hourly segments starting at 0 (the first hour of the day) and ending at 23. You can adjust it by clicking on the colored boxes next to an activity and then clicking in the position in the schedule.",
infoBoxGameOver = "<b>Game Over</b><br> Your health ran out. Please restart the game by pressing F5.",
infoBoxFood = "<b>Food</b><br> Food is a vital resource, which is acquired by working. Working will increase your food stockpile, however you only have limited space and can only stockpile a certain amount of food. When not working your food reserves will decrease due to other activities. When food runs low your mood will decrease, when food runs out it will affect your health.",
infoBoxHappiness = "<b>Happiness</b><br> Your happiness is positively influenced by recreation. If you become unhappy, your work efficiency will suffer. Working, very low energy (10%) and low health will decrease your happiness.",
infoBoxRandom = "<b>Random</b><br> Select if you want random events to happen.",
infoBoxDifficulty = "<b>Difficulty</b><br> Select your difficulty. <br><span class=\"difEasy\">Easy</span><br> Work is fun! You are currently doing a task you enjoy a lot and your happiness will improve when working!<br><span class=\"difNormal\">Normal</span><br> Work is work and has to be done. Your happiness will slightly decrease when working.<br><span class=\"difHard\">Hard</span><br> Work sucks! You do not enjoy your current work and your happiness will rapidly decrease!",
infoBoxExcersise = "<b>Excersise</b><br> <a href=\"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5385214/\">Numerous studies</a> have explored the link between exercise and sleep, and most conclude that certain types of physical activity improve sleep quality and duration. Interestingly, other forms of exercise can decrease sleep quality and prevent us from getting enough rest. The best exercise to improve sleep largely depends on how old you are. For instance, some studies have found that moderate exercise training over the course of several weeks can improve sleep quality and duration for adolescents, whereas vigorous exercise during the same timespan has been shown to decrease sleep duration for some teens. Regular exercise can help healthy adults sleep better. While acute physical activity can have a small effect on sleep quality and duration, regular, moderate exercise can extend sleep duration, improve sleep quality, and decrease sleep onset, or the time it takes to fall asleep.",
infoBoxDreams = "<b>Dreams</b><br> Dreaming is one of the most unique and intriguing aspects of sleep. During a normal night’s sleep, it’s typical to spend about two hours dreaming. The most intense dreams happen during the rapid eye movement (REM) sleep stage, but distinct types of dreams can occur during any part of the sleep cycle.<br><br>Dreams can have imagery that is positive, negative, or outright confusing, likely reflecting a period of immense imagination during sleep. Nevertheless, whether in good or bad dreams, experiences from when you’re awake are frequently incorporated into dream content.<br><br>Experts continue to debate about why we dream, but considerable evidence points to dreams playing a role in facilitating brain functions like memory and emotional processing. Dreams appear to be an important part of normal, healthy sleep. At the same time, though, nightmares can disrupt sleep and even affect a person during their waking hours.",
infoBoxTemperature = "<b>Temperature</b><br> Your body heat peaks late afternoon and then starts to drop in the evening to prepare your body for sleep, kickstarting melatonin production. An ideal bedroom temperature is around 16-18°C (60-65°F).<br><br>Hot, cold or draughty rooms can seriously impact on your sleep, in particular REM (rapid eye movement) sleep. Temperatures over 24°C (71°F) are likely to cause restlessness, while a cold room of about 12°C (53°F) will make it difficult to drop off.",
infoBoxElectronics = "<b>Electronic Devices</b><br> Electronic back-lit devices like cell phones, tablets, readers, and computers emit short-wavelength enriched light, also known as blue light. <a href=\"https://www.cdc.gov/niosh/emres/longhourstraining/color.html\">Fluorescent and LED lights</a> also emit blue light, which has been shown to reduce or delay the natural production of melatonin in the evening and decrease feelings of sleepiness. Blue light can also reduce the amount of time you spend in slow-wave and rapid-eye movement (REM) sleep, two stages of the sleep cycle that are vital for cognitive functioning.",
infoBoxLearning = "<b>Learning</b><br>  Multiple hypotheses explain the possible connections between sleep and learning in humans. Research indicates that sleep does more than allow the brain to rest. It may also aid the consolidation of long-term memories.<br><br>REM sleep and slow-wave sleep play different roles in memory consolidation. REM is associated with the consolidation of nondeclarative (implicit) memories. An example of a nondeclarative memory would be a task that we can do without consciously thinking about it, such as riding a bike. Slow-wave, or non-REM (NREM) sleep, is associated with the consolidation of declarative (explicit) memories. These are facts that need to be consciously remembered, such as dates for a history class.",
infoBoxPlants = "<b>Plants</b><br>  The green leaves of plants carry out both photosynthesis (in light) and respiration (all the time). Photosynthesis uses carbon dioxide to make sugar and produces oxygen as a byproduct. Respiration uses oxygen to release energy from stored sugar and produces carbon dioxide as a byproduct.<br><br>During daytime, photosynthesis is going on faster than respiration, so, normally, plants will produce oxygen during the day (just what your dad could do with). However, at night, only respiration continues, so plants (like other organisms - mice - cats - dogs - people - bacteria) produce carbon dioxide and use up oxygen. This is not true for all plants. Some will produce more oxygen during the night than they consume.",
infoBoxLightSci = "<b>Light</b><br>  Rhythmic variations in ambient illumination impact behaviours such as rest during sleep and activity during wakefulness as well as their underlying biological processes. Rather recently, the availability of artificial light has substantially changed the light environment, especially during evening and night hours. This may increase the risk of developing circadian rhythm sleep–wake disorders (CRSWD), which are often caused by a misalignment of endogenous circadian rhythms and external light–dark cycles.",
infoBoxSleepStages = "<b>Sleep Cycle</b><br>  We all know the concept of sleeping: You go to bed in the evening, close your eyes, fall asleep at some point and maybe dream during the night before you awake in the morning. But what happens when you sleep? Simply, it´s a state of body and mind during the sleep cycle when you are less reactive to stimuli and you don´t move. Sleep is orchestrated by the internal circadian clock, which tells you when you need sleep. When you fall asleep, your body alternates between two phases: REM and non-REM sleep. REM stands for rapid eye movement.  First, Non-REM sleep (divided into N1 and N2) occurs and after a certain time transits into slow-wave sleep or deep sleep (N3). During this phase, body temperature drops, the heart rate slows down and the brain uses less energy. Second, REM sleep occurs. It represents a smaller portion of the total sleep time. During this phase the brain waves get faster, dreams occur, the eyes move but you don´t. One sleep cycle (alternation between Rem and non-REM) takes 90 minutes. In a good nights sleep four to six of these cycles occur. Later in the night the REM phases occur more often compared to the beginning of the night. In the following graph you can see a hypnogramm which shows the sleep cycle with all sleep phases. <img id=\"infoBoxImg\" src=\"img/sleep_stages_walker.png\"></img>",
infoBoxUnfinished = "<b>Random Event Information</b><br>  In a perfect world here you would find information about currently active random events such as \"Solar Eclipse\" and \"Flu\". Maybe next time.";
