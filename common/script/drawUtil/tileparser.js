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
    return function(){
      this.parse = function(myMaps) {
        return myMaps.entries().reduce(function(out,entry) {
          return out.merge(Object.map(entry[0], 
            entry[1].map(function(level){
              return level.entries().reduce(function(out,entry) {
                return out.merge(Object.map(entry[0], explodeCoords(entry[1])));
              }, {})
            })
          ))
        }, 
        {});
      }
    }
  });
  window[registryName].apply('TileTransformer', 
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
       
    return function() {
      this.buildTransform = function(tile,palette,transforms) {
        return tile.map(buildTransform(transforms.map((k) => tf[k]).concat(applyPalette(palette)))).filter((p) => (p.c != "none" && p.c != undefined));
      }
    }
    
  });
  window[registryName].apply('MapBuilder', ['TileTransformer','Point'], function(TileTransformer,Point){
    var tileTF = new TileTransformer();
    return function(tiles,palettes) {
      this.transform = function(levels) {
        return levels.reduce(function(out,level){
          return level.entries().reduce(function(out, entry){
            //console.log("This is a key-value pair");
            //console.log(entry[0]);
            var key = entry[0].split("|");
            var tileName = key.shift();
            console.log("tile name: " + tileName);
            var paletteName = key.shift();
            console.log("palette name: " + paletteName);
            var tile = tiles[tileName];
            console.log("tile");
            console.log(tile);
            var palette = palettes[paletteName];
            console.log("palette");
            console.log(palette);
            var tfTile = tileTF.buildTransform(tile,palette,key);
            console.log("tfTile");
            console.log(tfTile);
            console.log("coords");
            console.log(entry[1]);
            return entry[1].reduce(function(out,s){
              return tfTile.reduce(function(out,p){
                var key = new Point(s.x * 16 + p.x, s.y * 16 + p.y).toString();
                out[key] = p.c;
                return out;
              },out);
            },out);
          }, out);
        },{})
      }
    }
  });

})()
