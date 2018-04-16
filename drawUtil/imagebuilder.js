(function() {
  window[registryName].apply('ImageBuilder',[],function() {
    return function(canvasId,imgId) {
      var state = {};
      this.setScale = function(scale) {
        state.scale = scale;
      }
      this.draw = function(instructions) {
        
      }
    }
  });
})()