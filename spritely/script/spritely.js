(function() {
  window[registryName].apply('Spritely',['PixelPainter','PixelCanvas','PaletteUI'],function(PixelPainter,PixelCanvas,PaletteUI) {
    return function(instanceName,inputId,widthFieldId,heightFieldId,colorSelectPrefix,colorPrefix,paletteId,svgId,canvasId,outId,codeOutId,initSize,pixelSize) {
      
      var paletteUI = new PaletteUI(instanceName,paletteId);

      var pixelCanvas = new PixelCanvas(instanceName,svgId,initSize,initSize,pixelSize);

      var pixelPainter = new PixelPainter();

      var me = this;
      
      me.init = function() {
        paletteUI.init();
        pixelCanvas.init();
        pixelPainter.setCanvas(document.getElementById(canvasId));        
        
        ui.loader = document.getElementById(inputId)
        ui.width = document.getElementById(widthFieldId);
        ui.height = document.getElementById(heightFieldId);
        ui.out = document.getElementById(outId);
        ui.codeOut = document.getElementById(codeOutId);
        ui.background = document.getElementById(colorPrefix + 0);
        ui.transforms = Array.from(document.getElementsByName("transform"));
        
        // apply preset size
        ui.width.value = initSize;
        ui.height.value = initSize;
        
        this.resize();
      }
      
      this.resize = function() {
        pixelCanvas.setSize(ui.width.value, ui.height.value);
        ui.transforms.forEach(function(b){
          b.disabled = (pixelCanvas.getWidth() != pixelCanvas.getHeight());
        });
        redraw();
      }

      var redraw = function() {
        var palette = paletteUI.getPalette()
        pixelCanvas.redraw(palette);
        var img = pixelPainter.paint(pixelCanvas.getWidth(),pixelCanvas.getHeight(),pixelCanvas.getGrid(),palette);
        
      }
      
      ['activateColor','addColor'].forEach(function(fn) {
        me[fn] = function() {
          paletteUI[fn].apply(paletteUI,Array.from(arguments));
        };
      });
      
      this.updateColor = function(color,index) {
        paletteUI.updateColor(color,index);
        redraw();
      }
      
      this.removeColor = function(index) {
        paletteUI.removeColor(index);
        pixelCanvas.removeColor(index);
        redraw();
      }
      
      ['setColor','transform'].forEach(function(f) {
        me[fn] = function() {
          pixelCanvas[fn].apply(pixelCanvas,Array.from(arguments));
          redraw();
        }
      });
      
    }
  });
})()