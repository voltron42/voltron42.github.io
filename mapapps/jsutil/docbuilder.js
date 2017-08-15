
function buildNode(node) {
    var out = ["<",node.tag];
    if ((typeof node.attrs) == "object") {
        Object.keys(node.attrs).filter(function(key) {
            return (typeof node.attrs[key]) != 'undefined';
        }).forEach(function(key){
            out = [].concat(out," ",key,"=",'"',node.attrs[key],'"');
        });
    }
    out.push(">");
    if (Array.isArray(node.children) && node.children.length > 0) {
        out = out.concat(node.children.map(function(child){
            if ((typeof child) == "string") {
                return child;
            } else {
                return buildNode(child);
            }
        }));
    }
    out = out.concat("</",node.tag,">");
    return out.join("");
}

function build(appendTo,nodes) {
    appendTo.innerHTML = nodes.map(buildNode).join("");
}

function append(appendTo,nodes) {
    appendTo.innerHTML += nodes.map(buildNode).join("");
}

function updateColors(count) {
    for (var i = 0; i < count; i++) {
        var color = document.getElementById("color" + i);
        var r = document.getElementById("r" + i);
        r.attributes.getNamedItem("fill").value = color.value;
    }
}

function range(count) {
	return "x".repeat(count).split("").map(function(v,i) {
		return i;
	});
}

function applyToGrid(bitsize,func) {
    var size = (1 << bitsize);
    range(size).forEach(function(y) {
        range(size).forEach(function (x) {
            func(x, y, size);
        });
    });
}


function encodebitmap(bitsize, colorssize) {
    var colorcount = 1 << colorssize;
    var pershort = 2 << (4 - colorssize);
    var colorbits = {};
    for (var c = 0; c < colorcount; c++) {
        colorbits["#r" + c] = c;
    }
    var colors = [];
    applyToGrid(bitsize, function (x, y, size) {
        var rect = document.getElementById(x.toString(size) + "" + y.toString(size));
        var fill = rect.attributes.getNamedItem("href");
        colors.push(colorbits[fill.value]);
    });
    var outbytes = [];
    while (colors.length > 0) {
        outbytes.push(colors.splice(0, pershort));
    }
    return outbytes.map(function (shortlist) {
        return shortlist.reduce(
            function (sum, val, index) {
                return sum | (val << (colorssize * index));
            }, 0);
    });
}

function clearAll(bitsize) {
    applyToGrid(bitsize,function (x, y, size) {
        var rect = document.getElementById(x.toString(size) + "" + y.toString(size));
        var fill = rect.attributes.getNamedItem("href");
        fill.value = "#r0";
    });
}

function buildGrid(bitsize, coeff) {
    var grid = [];
    applyToGrid(bitsize, function (x, y, size) {
        grid.push({
            tag: "use",
            attrs: {
                id: x.toString(16) + "" + y.toString(16),
                x: x * coeff,
                y: y * coeff,
                stroke: "black",
                href: "#r0",
                "stroke-width": 1,
                onClick: "togglePixel("+x+","+y+")"
            }
        });
    });
    return grid;
}

function buildTypes(bitsize) {
    var size = (1 << bitsize);
    function getX(x, y) {
        return x;
    }
    function getY(x, y) {
        return y;
    }
    function invertX(x, y) {
        return (size - 1) - x;
    }
    function invertY(x, y) {
        return (size - 1) - y;
    }
    return {
        horiz: {
            x: invertX,
            y: getY
        },
        vert: {
            x: getX,
            y: invertY
        },
        right: {
            x: invertY,
            y: getX
        },
        left: {
            x: getY,
            y: invertX
        }
    }
}

function transform(type, bitsize) {
    var tf = buildTypes(bitsize)[type];
    var newPoints = [];
    applyToGrid(bitsize, function (x, y, size) {
        var rect = document.getElementById(x.toString(size) + "" + y.toString(size));
        var fill = rect.attributes.getNamedItem("href");
        newPoints.push({
            x: tf.x(x, y),
            y: tf.y(x, y),
            fill: fill.value
        })
    });
    var size = 1 << bitsize;
    newPoints.forEach(function (p) {
        var rect = document.getElementById(p.x.toString(size) + "" + p.y.toString(size));
        var fill = rect.attributes.getNamedItem("href");
        fill.value = p.fill
    })
}

function loadGrid(bitsize, colorsize, shortlist) {
    var size = 1 << bitsize;
    var colorCount = 1 << colorsize;
    var colorlist = shortlist.reduce(function (out, short) {
        for (var b = 0; b < bitsize; b++) {
            out.push((short >>> b) % colorCount);
        }
    }, []);
    colorlist.forEach(function (color, index) {
        var x = index % size;
        var y = Math.floor(index / size);
        var rect = document.getElementById(x.toString(size) + "" + y.toString(size));
        var fill = rect.attributes.getNamedItem("href");
        fill.value = "#r" + color;
    })
}
