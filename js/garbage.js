var settings;
var svg;
var svgStore;

function foo(){
	settings = loadFileSync('res/config.json', 'json');
	
	var draw = SVG().addTo('#playbutton').size(1000, 1000);
	var rect = draw.rect(100, 100).attr({ fill: getColorForTime(date) });
	runner = rect.animate();

	/*var result = {};
	result["index"] = i;
	result["duration"] = duration;
	result["color"] = fade;*/
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