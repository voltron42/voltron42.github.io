(function() {
  window[registryName].apply('Spritely',['PixelPainter','PixelCanvas','PaletteUI'],function(PixelPainter,PixelCanvas,PaletteUI) {
    return function(instanceName,inputId,widthFieldId,heightFieldId,colorSelectPrefix,colorPrefix,paletteId,svgId,canvasId,outId,codeOutId,initSize,pixelSize) {
      var paletteUI = new PaletteUI(instanceName,paletteId);
      var pixelCanvas = new PixelCanvas(instanceName,svgId,initSize,initSize,pixelSize);
      var pixelPainter = new PixelPainter();

      var me = this;
      
      me.init = function() {}
      
      ['activateColor','updateColor','addColor','removeColor'].forEach(function(fn) {
        me[fn] = function() {
          paletteUI[fn].apply(paletteUI,Array.from(arguments));
        };
      });
      
      
    }
  });
})()