(function() {
  window[registryName].apply('TileParser', ['ColorConstants'], function(ColorConstants) {

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
          return out.concat(row.map((c,x) => Object.map("c", decodeChar(c), "x", x, "y", y)));
        },[]);
      }
    }
  })
})()
