(function() {
  window[registryName].apply('Spritely',['PixelPainter','PixelCanvas','PaletteUI'],function(PixelPainter,PixelCanvas,PaletteUI) {
    return function(instanceName,inputId,widthFieldId,heightFieldId,colorSelectPrefix,colorPrefix,paletteId,svgId,canvasId,outId,codeOutId,initSize,pixelSize) {
      
      var paletteUI = new PaletteUI(instanceName,paletteId,colorSelectPrefix,colorPrefix);

      var pixelCanvas = new PixelCanvas(instanceName,svgId,initSize,initSize,pixelSize);

      var pixelPainter = new PixelPainter();
	  
	  var ui = {};

      var me = this;
      
      me.init = function() {
        paletteUI.init();
        pixelCanvas.init(paletteUI.getPalette());
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
      
      this.loadData = function() {
        // TODO: fetch data from ui.loader, parse, load
        var loadedData = JSON.parse(ui.loader.value);
        if (loadedData) {
          data = loadedData;
          ui.background.value = data.palette[0];
          displayPalette();
          redraw();
        }
      }
      
      this.setScale = function(scale) {
        data.scale = scale;
        redraw();
      }

      this.makeTransparent = function(makeTransparent) {
        data.transparent = makeTransparent;
        redraw();
      }
      
      var redraw = function() {
        var palette = paletteUI.getPalette()
        pixelCanvas.redraw(palette);
        var img = pixelPainter.paint(pixelCanvas.getWidth(),pixelCanvas.getHeight(),pixelCanvas.getGrid(),palette);
		ui.out.innerHTML = JSON.toXML({
			tag:"a",
			attrs:{
			  href:"#",
			  onClick:instanceName + ".makeSaveFile()"
			},
			content:[{
			  tag:"img",
			  attrs:{src:ui.canvas.toDataURL("image/png")}
			}]
		  })

      }
      
      Array.from(["activate","addColor"]).forEach(function(fn) {
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
      
      Array.from(["transform"]).forEach(function(fn) {
        me[fn] = function() {
          pixelCanvas[fn].apply(pixelCanvas,Array.from(arguments));
          redraw();
        }
      });
	  
	  this.setColor = function(x,y) {
		  pixelCanvas.setColor(x,y,paletteUI.getActiveIndex());
		  redraw();
	  }
      
      this.makeSaveFile = function() {
        ui.codeOut.value = JSON.stringify(data,null,2);
        ui.codeOut.select();
        document.execCommand('copy');
      }
    }
  });
})()