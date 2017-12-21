(function() {
  Object.prototype.merge = function(input) {
    var me = this;
    Object.keys(input).forEach(function(key){
      me[key] = input[key];
    });
  }
})()
