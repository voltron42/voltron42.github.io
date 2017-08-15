function TileSet(appendTo,defId) {
	var mytiles = 0;
	var tileCtrl = function(n) {
		return [{
			tag: "li",
			children: [{
				tag: "input",
				attrs: {
					name: "tileSelect",
					id: "tileSelect" + n,
					type: "radio",
					value: n
				}
			},{
				tag: "label",
				children: " Name: "
			},{
				tag: "input",
				attrs: {
					id: "tileName" + n,
					type: "text",
				}
			},{
				tag: "label",
				children: " Color: "
			},{
				tag: "input",
				attrs: {
					id: "tileColor" + n,
					type: "text",
				}
			},{
				tag: "label",
				children: " JSON Contents: "
			},{
				tag: "textarea",
				attrs: {
					id: "tileContents" + n,
				}
			}]
		}]
	}
	var tilePattern = function(name,color,contents) {
		return {
			tag: "g",
			attrs: {
				id: name
			},
			children: [{
				tag: "rect",
				attrs: {
					width: 20,
					height: 20,
					fill: color
				}
			}].concat(contents)
		};
	}
	this.add = function() {
		append(document.getElementById(appendTo),tileCtrl(mytiles));
		mytiles++;
	}
	this.update = function() {
		build(document.getElementById(defId),range(mytiles).map(function(n){
			var fields = ["tileName","tileColor","tileContents"].map(function(label){
				return document.getElementById(label + n).value;
			})
			return tilePattern.apply(null,fields);
		}))
	}
	this.getSelected = function() {
		var value = range(mytiles).map(function(n){
			return document.getElementById("tileSelect" + n);
		}).filter(function(radio){
			return radio.checked;
		}).map(function(radio){
			return radio.value;
		});
	}
}

function Grid(instanceName,appendTo,defId,tileSet) {
	var grid = {};
	this.init = function() {
		build(document.getElementById(appendTo),[{
			tag: "svg",
			attrs: {
				id: "mySvg",
				width: "50%",
				height: "50%",
				viewBox: "0 0 0 0"
			},
			children: [{
				tag: "defs",
				children:[{
					tag: "polygon",
					attrs: {
						id: "frame",
						points: [
							[0,10],
							[5,0],
							[15,0],
							[20,10],
							[15,20],
							[5,20]
						].map(function(p){
							return p.join(",");
						}).join(" "),
						stroke: "black",
						"stroke-width": "1",
						fill: "inherit"
					}
				},{
					tag:"g",
					attrs: {
						id: defId
					}
				}]
			},{
				tag: "g",
				attrs: {
					id: "thisGrid"
				}
			}]
		}]);
	}
	this.setDim = function(widthField, heightField) {
		grid = {};
		var width = document.getElementById(widthField).value;
		var height = document.getElementById(heightField).value;
		var svg = document.getElementById("mySvg");
		var viewBox = svg.attributes.getNamedItem("viewBox");
		var size = {
			width: width * 15 + 7,
			height: height * 20 + 12
		};
		viewBox.value = [0,0,size.width,size.height].join(" ");
		var hexes = range(height).reduce(function(out,row){
			return range(width).reduce(function(prev,col){
				var id = col + "-" + row;
				grid[id] = "white";
				return prev.concat({
					tag: "use",
					attrs: {
						id: id,
						x: 1 + 15 * col,
						y: 1 + 20 * row + ((col % 2) * 10),
						href: "#frame",
						fill: "white",
						onClick: instanceName + ".applyTile(" + col + "," + row + ")"
					}
				})
			},out);
		},[{
			tag: "rect",
			attrs: {
				width: size.width,
				height: size.height,
				stroke: "black",
				"stroke-width": "1",
				fill: "white"
			}
		}]);
		build(document.getElementById("thisGrid"), hexes);
	}
	this.publish = function(textOut) {
		
	}
	this.applyTile = function(col,row) {
		var tileId = tileSet.getSelected();
		var hex = document.getElementById(col + "-" + row);
		var fill = hex.attributes.getNamedItem("fill");
		fill.value = "url(#" + tileId + ")";
	}
}

var tiles = new TileSet("input-list","defs");

var myGrid = new Grid("myGrid","map","defs",tiles);

function buildHexmap(tiles, map) {
	var hexframe = {
		tag: "polygon",
		attrs: {
			id: "frame",
			points: [
				[0,10],
				[5,0],
				[15,0],
				[20,10],
				[15,20],
				[5,20]
			].map(function(p){
				return p.join(",");
			}).join(" "),
			stroke: "black",
			"stroke-width": "1",
			fill: "inherit"
		}
	};
	var patterns = Object.keys(tiles).map(function(tileId) {
		var tile = tiles[tileId];
		return {
			tag: "pattern",
			attrs: {
				id: tileId,
				width: "20",
				height: "20"
			},
			children: [{
				tag: "rect",
				attrs: {
					width: 20,
					height: 20,
					fill: tile.color
				}
			}].concat(tile.contents)
		};
	});
	var keys = ["x", "y"];
	var dim = {x: 0, y: 0};
	var hexes = Object.keys(map).reduce(function(prev,tileId){
		return map[tileId].reduce(function(out,xy){
			console.log("xy:" + xy);
			var p = xy.reduce(function(prev,c,i){
				prev[keys[i]] = c;
				return prev;
			},{});
			console.log("p:");
			console.log(p);
			keys.forEach(function(k){
				dim[k] = Math.max(p[k],dim[k]);
			});
			console.log("dim:");
			console.log(dim);
			return out.concat({
				tag: "use",
				attrs: {
					id: p.x + "-" + p.y,
					x: 1 + 15 * p.x,
					y: 1 + 20 * p.y + ((p.x % 2) * 10),
					href: "#frame",
					fill: "url(#"+tileId+")",
					onClick: "setHex(" + p.x + "," + p.y + ")"
				}
			});
		},prev);
	},[]);
	keys.forEach(function(k){
		dim[k]++;
	})
	var size = {
		width: dim.x*15 + 7,
		height: dim.y * 20 + 12
	};
	return [{
		tag: "svg",
		attrs: {
			width: "50%",
			height: "50%",
			viewBox: [0, 0, size.width, size.height].join(" ")
		},
		children: [{
			tag: "defs",
			children: [hexframe].concat(patterns)
		},{
			tag: "rect",
			attrs: {
				width: size.width,
				height: size.height,
				"stroke-width": 1,
				stroke: "black",
				fill: "white"
			}
		}].concat(hexes)
	}]
}

function buildMe() {
	var input = document.getElementById("input");
	var json = JSON.parse(input.value);
	var divmap = document.getElementById("map");
	var hexmap = buildHexmap(json.tiles, json.map);
	console.log(hexmap);
	build(divmap, hexmap);
}

function startup() {
	var size = {
		rows: 3,
		cols: 4
	};
	var r0 = "y".repeat(size.rows).split("").reduce(function(out,v0,row){
		return "x".repeat(size.cols).split("").reduce(function(prev,v1,col){
			prev.push([col,row]);
			return prev;
		},out)
	},[])
	console.log(r0);
	build(document.getElementsByTagName("body")[0],[{
		tag: "UL",
		attrs: {
			id: "input-list"
		}
	},{
		tag: "br"
	},{
		tag: "button",
		attrs:{
			onClick: "tiles.add()"
		},
		children: ["Add Tile"]
	},{
		tag: "button",
		attrs:{
			onClick: "tiles.update()"
		},
		children: ["Update Tiles"]
	},{
		tag: "br"
	},{
		tag: "label",
		children: ["Width: "]
	},{
		tag: "input",
		attrs: {
			id: "cols",
			type: "number",
			style: "width: 5em",
			value: 1
		}
	},{
		tag: "label",
		children: [" Height: "]
	},{
		tag: "input",
		attrs: {
			id: "rows",
			type: "number",
			style: "width: 5em",
			value: 1
		}
	},{
		tag: "button",
		attrs:{
			onClick: "grid.setDim('cols','rows')"
		},
		children: ["Build"]
	},{
		tag: "br"
	},{
		tag: "button",
		attrs:{
			onClick: "grid.publish('input')"
		},
		children: ["Publish"]
	},{
		tag: "br"
	},{
		tag: "div",
		attrs: {
			id: "map"
		}
	},{
		tag: "br"
	},{
		tag: "textarea",
		attrs: {
			id: "input"
		}
	}]);
}