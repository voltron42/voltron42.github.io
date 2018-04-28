if (!Array.prototype.last){
  Array.prototype.last = function(){
    return this[this.length - 1];
  };
};
if (!Array.repeat){
  Array.repeat = function(n,x){
    return Array.from(Array(n), () => x);
  };
};
if (!Array.prototype.groupBy) {
  Array.prototype.groupBy = function(func) {
    return this.reduce(function(rv, x) {
      (rv[func(x)] = rv[func(x)] || []).push(x);
      return rv;
    }, {});
  }
}
