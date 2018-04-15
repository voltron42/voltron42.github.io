(function() {
  var tf = transform(15);
  
  var buildTransform = function(transforms) {
    return (p) => transforms.reduce((p1,f) => tf.f(p1),p);
  }
  
  var applyPalette = function(palette) {
    return function(p) {
      p.c = palette[p.c];
      return p;
    }
  }
  
  var explodeCoords = function(coords){
    coords = coords.reduce(function(out,coord){
      var xy = coord.split("/");
      var x = xy[0].split("").map(decodeChar);
      var y = xy[1].split("").map(decodeChar);
      var xa = x[0];
      var xb = x[1] || xa;
      var ya = y[0];
      var yb = y[1] || ya;
      return Array.range(ya,yb+1).reduce(function(out,y){
        return out.concat(Array.range(xa,xb+1).map((x) => Object.map("x",x,"y",y)));
      },[]);
    },[]);
    return coords;
  }
  
  var safeparse = function(str) {
    var value = parseInt(str);
    return isNaN(value)?str:value;
  };
  
  var byType = {
    string:function(out,val) {
      out.push(val);
      return out;
    },
    number:function(out,val) {
      var prev = out.pop();
      out.push(prev);
      return out.concat(Array.repeat(val, prev));
    }
  };
  
  var finishHex = function(coll) {
    var shortchange = 16 - coll.length;
    if (shortchange > 0) {
      coll = byType.number(coll,shortchange);
    }
    return coll;
  }
  
  var decodeChar = function (c) { return c.charCodeAt(0) - 97; }
  
  var parseTile = function(tileText){
    var explode = finishHex(tileText.split("|").reduce(function(out, row){
      if (row == "") {
        var step = out.pop();
        out.push(step);
        out.push(step);
      } else {
        out.push(finishHex(row.split("").map(safeparse).reduce(function(step, cell){
          return byType[(typeof cell)](step, cell);
        },[])));
      }
      return out;
    },[]));
    return explode.reduce(function(out, row, y){
      return out.concat(row.map((c,x) => Object.map("c", decodeChar(c), "x", x, "y", y)));
    },[]);
  };
  
  var drawSquare = function(coord,ctx) {
    return function(point) {
      if (point.c != "none") {
        var xy = ["x","y"].reduce(function(out, key){
          out[key] = 6 * (point[key] + 16 * coord[key]);
          return out;
        },{});
        ctx.fillStyle = point.c;
        ctx.fillRect(xy.x, xy.y, 6, 6);
      }
    }
  }
  
  var applyToCtx = function(ctx) {
    return function(entry) {
      entry.coords.forEach(function(coord) {
        console.log("coord");
        console.log(coord);
        entry.tile.forEach(drawSquare(coord, ctx));
        ctx.lineWidth = 1;
        ctx.strokeRect(coord.x * 96, coord.y * 96, 96, 96);
      });
    }
  };

  window.Builder = function (inId,canvasId,galleryId) {
    var input = document.getElementById(inId);
    var buildspace = document.getElementById(canvasId);
    var gallery = document.getElementById(galleryId);
    this.buildmap = function() {
      buildspace.innerHTML = "";
      gallery.innerHTML = "";
      console.log(input.value);
      eval("var inData = (" + input.value + ");");
      console.log(inData);
      var tiles = inData[0] || {};
      tiles = Object.entries(tiles).reduce(function(out,entry){
        out[entry[0]] = parseTile(entry[1]);
        return out;
      },{});
      var palettes = inData[1] || {};
      palettes = Object.entries(palettes).reduce(function(out,entry){
        out[entry[0]] = entry[1].map((c) => Array.isArray(c)?"rgb(" + c.join(",") + ")":c);
        return out;
      },{});
      var pages = inData[2] || {};
      gallery.innerHTML = Object.entries(pages).map(function(entry){
        var key = entry[0];
        var page = entry[1];
        var exploded = page.reduce(function(out,step){
          return Object.entries(step).reduce(function(o,entry){
            var key = entry[0].split("|");
            var tile = tiles[key.shift()];
            var palette = palettes[key.shift()];
            o.push({
              tile:tile.map(buildTransform(key.map((k) => transform[k]).concat(applyPalette(palette)))),
              coords:explodeCoords(entry[1])
            });
            return o;
          },out)
        },[]);
        var coords = [].concat.apply([],exploded.map((x) => x.coords));
        console.log(coords);
        var max = coords.reduce(function(out,coord){
          return ["x","y"].reduce(function(obj,key) {
            obj[key] = Math.max(out[key],coord[key]);
            return obj;
          },{});
        },{x:0,y:0});
        buildspace.innerHTML += '<canvas id="' + key + '"></canvas>';
        var canvas = document.getElementById(key);
        canvas.width = (1 + max.x) * 96;
        canvas.height = (1 + max.y) * 96;
        exploded.forEach(applyToCtx(canvas.getContext('2d'),tiles,palettes));
        var img = canvas.toDataURL("image/png");
        return '<img src="' + img + '" alt="' + key + '"/>';
      }).join("");
    };
  };
})()