var settings;

$(document).ready(function() {
	settings = loadJsonFileSync("res/config.json");
	console.log("ready!");
});

function loadJsonFileSync(location){
	 var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': location,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
}

