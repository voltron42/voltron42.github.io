(function(){
  window[registryName].apply('PixelPainter',['Point'],function(Point) {
    return function(initScale,initTransparent) {
      
      var ui = {};
      
      var state = {scale:initScale,transparent:initTransparent};
      
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
      
      this.getData = function() {
        return Object.entries(state).reduce(function(out, entry) {
          out[entry[0]] = entry[1];
          return out;
        },{});
      }
      
      this.paint = function(width, height, grid, palette) {
        var w =  width * state.scale;
        var h =  height * state.scale;
        ui.canvas.width = w;
        ui.canvas.height = h;
        ui.ctx.clearRect(0, 0, w, h);
        if (!state.transparent) {
          ui.ctx.fillStyle = palette[0];
          ui.ctx.fillRect(0, 0, w, h);
        }
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