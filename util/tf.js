(function() {
  window.Transformer = function(size) {
    var bound = size - 1;
    this["flip-down"] = ((p) => p.merge({ x:p.x, y:(bound - p.y) }));
    this["flip-over"] = ((p) => p.merge({ x:(bound - p.x), y:p.y }));
    this["turn-left"] = ((p) => p.merge({ x:p.y, y:(bound - p.x) }));
    this["turn-right"] = ((p) => p.merge({ x:(bound - p.y), y:p.x }));
    this["shift-right"] = ((p) => p.merge({ x:(parseInt(p.x) + 1), y:p.y }));
    this["shift-left"] = ((p) => p.merge({ x:(p.x - 1), y:p.y }));
    this["shift-up"] = ((p) => p.merge({ x:p.x, y:(p.y - 1) }));
    this["shift-down"] = ((p) => p.merge({ x:p.x, y:(parseInt(p.y) + 1) }));
  };
})()