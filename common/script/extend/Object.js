if (!Object.prototype.merge) {
  Object.prototype.merge = function(myMap) {
    var me = this;
    Object.entries(myMap).forEach(function(entry){
      me[entry[0]] = entry[1];
    });
    return me;
  }
}
if (!Object.map) {
  Object.map = function() {
    var args = Array.from(arguments);
    var out = {};
    while (args.length > 0) {
      out[args.shift()] = args.shift();
    }
    return out;
  }
}