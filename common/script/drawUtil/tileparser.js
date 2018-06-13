(function() {
  var decodeChar = function (c) { return c.charCodeAt(0) - 97; }

  window[registryName].apply('TileParser', [], function() {
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
    
    return function(width, height) {
      this.parse = function(tileText) {
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
          return out.concat(row.map((c,x) => Object.map("c", decodeChar(c), "x", x, "y", y)).filter((o) => (0 < o.c)));
        },[]);
      }
    }
  });
  window[registryName].apply('MapParser', 
  [], 
  function() {
    var explodeCoords = function(coords){
      coords = coords.reduce(function(out,coord){
        var xy = coord.split("/");
        var x = xy[0].split("").map(decodeChar);
        var y = xy[1].split("").map(decodeChar);
        var xa = x[0];
        var xb = x[1] || xa;
        var ya = y[0];
        var yb = y[1] || ya;
        return Number.range(ya,yb+1).reduce(function(out,y){
          return out.concat(Number.range(xa,xb+1).map((x) => Object.map("x",x,"y",y)));
        },[]);
      },[]);
      return coords;
    }
    
    this.parse = function(myMaps) {
      return myMaps.entries.reduce(function(out,entry) {
        return out.merge(Object.map(entry[0], 
        entry[1].entries().reduce(function(out,entry) {
          return out.merge(Object.map(entry[0], explodeCoords(entry[1])));
        }, {})))
      }, 
      {});
    }
  });
  window[registryName].apply('MapBuilder', 
  ['ColorConstants','Point','Transformer'], 
  function(ColorConstants,Point,Transformer) {
    var transformer = new Transformer(16);

    var tf = ["flip-down","flip-over","turn-left","turn-right"].reduce(function(out,fn) {
      out[fn] = function(p) {
        return p.merge(transformer[fn](new Point(p.x,p.y)).toJSON());
      }
      return out;
    },{})
    
    var buildTransform = function(transforms) {
      return (p) => transforms.reduce((p1,f) => f(p1),p);
    }
    
    var applyPalette = function(palette) {
      return function(p) {
        p.c = ColorConstants.get(palette[p.c]);
        return p;
      }
    }
    
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
    
    return function() {
      
    }
    
  });
})()
