(function(){
  window[registryName].apply('PixelPainter',['Point'],function(Point) {
    return function() {
      
      var ui = {};
      
      var state = {};
      
      this.setCanvas = function(canvas) {
        ui.canvas = canvas;
        ui.ctx = canvas.getContext("2d");
      }
      
      this.setTransparent = function(transparent) {
        state.transparent = transparent;
      }
      
      this.setScale = function(scale) {
        state.scale = scale;
      }
      
      this.paint = function(width, height, grid, palette) {
        ui.canvas.width = width;
        ui.canvas.height = height;
        ui.ctx.clearRect(0, 0, width * state.scale, height * state.scale);
        Object.entries(grid).forEach(function(entry) {
          var point = Point.parse(entry[0]);
          ui.ctx.fillStyle = palette[entry[1]];
          ui.ctx.fillRect(state.scale * point.getX(), state.scale * point.getY(), state.scale, state.scale);
        });
        return ui.canvas.toDataURL();
      }
      
    }
  });
})()