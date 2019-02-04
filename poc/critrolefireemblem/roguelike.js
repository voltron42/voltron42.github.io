(function(){
  window.RogueLikeMap = function(ui,config) {
    var decodeLoc = function(loc) {
      var col = loc.codePointAt(0) - "A".codePointAt(0);
      var row = parseInt(loc.slice(1)) - 1;
      return {col:col,row:row};
    }
    var draw = function() {
      var rows = config.map.length;
      var cols = config.map.map(function(c){
        return c.length;
      }).reduce(Math.max,0);
      config.map = config.map.map(function(row){
        return row + " ".repeat(cols - row.length);
      });
      var rowDigitMax = String.valueOf(rows.length - 1).length;
      var colHeader = "A".repeat(cols).map(function(c,i){
        return String.fromCharCode(c.charCodeAt(0) + i);
      });
      
    }
    var moveChar = function(name,loc) {
      config.locs[name] = loc;
      draw();
    }
    this.moveCharacter = function(index,loc){
      moveChar(config.party[parseInt(index)-1],loc);
    }
    this.moveFoe = function(index,loc) {
      moveChar(config.foes[index.codePointAt(0) - "a".codePointAt(0)],loc);
    }
  }
})();
