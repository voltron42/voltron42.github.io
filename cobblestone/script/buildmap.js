(function() {
	var transform = {
		"flip-down":function(point) {
			
		},
		"flip-over":function(point) {
			
		},
		"turn-left":function(point) {
			
		},
		"turn-right":function(point) {
			
		}		
	};
	var parseTile = function(tileText){
		
	};
	
	window.Builder = function (inId,canvasId,galleryId) {
		var input = document.getElementById(inId);
		var buildspace = document.getElementById(canvasId);
		var gallery = document.getElementById(galleryId);
		this.buildmap = function() {
			buildspace.innerHTML = "";
			gallery.innerHTML = "";
			var inData = JSON.parse(input.value);
			var tiles = inData[0];
			tiles = tiles?tiles:{};
			tiles = Object.entries(tiles).reduce(function(out,entry){
				out[entry[0]] = parseTile(entry[1]);
			},{});
			var palettes = inData[1];
			palettes = palettes?palettes:{};
			palettes = Object.entries(palettes).reduce(function(out,entry){
				out[entry[0]] = entry[1].map(function(color){
					if ((typeof color) == "string") {
						return color;
					} else {
						return "rgb(" + color.join(",") + ")";
					};
				});
			},{});
			var placements = inData[2];
			placements = placements?placements:{};
			var canvases = Object.entries(placements).reduce(function(out,entry){
				var key = entry[0];
				var value = entry[1];
				buildspace.innerHTML += '<canvas id="' + key + '"></canvas>';
				out[key] = document.getElementById(key).getContext('2d');
			},{});
		};
	};
})()