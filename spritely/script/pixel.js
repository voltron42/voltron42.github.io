(function() {
  window.PixelCanvas = function(instanceName,inputId,widthFieldId,heightFieldId,colorSelectPrefix,colorPrefix,paletteId,svgId,canvasId,outId,codeOutId,initSize,pixelSize) {

    var ui = {};
    
    var data = {
      width: initSize,
      height: initSize,
      scale: 1,
      palette: ["#ffffff"],
      grid:{},
    };
    
    var state = {
      activeColor:0,
      transparent:false
    }
    
    var drawInCanvas = function() {
      ui.canvas.width = data.width * data.scale;
      ui.canvas.height = data.height * data.scale;
      ui.ctx.clearRect(0, 0, data.width * data.scale, data.height * data.scale);
      if (!state.makeTransparent) {
        ui.ctx.fillStyle = data.palette[0];
        ui.ctx.fillRect(0, 0, data.width * data.scale, data.height * data.scale);
      }
      Object.entries(data.grid).forEach(function(pixel){
        var xy = pixel[0].split("-");
        ui.ctx.fillStyle = data.palette[pixel[1]];
        ui.ctx.fillRect(xy[0] * data.scale, xy[1] * data.scale, data.scale, data.scale);
      });
    }
  
    var buildSVG = function() {
      ui.svg.innerHTML = buildXML({
        tag:"svg",
        attrs:{
          width:"100%",
          viewBox:[0,0,data.width * pixelSize, data.height * pixelSize].join(" "),
          preserveAspectRatio:"xMaxYMax meet"
        },
        content:[{
          tag:"defs",
          content:data.palette.map(function(color,index){
            return {
              tag:"rect",
              attrs:{
                width:pixelSize,
                height:pixelSize,
                stroke:"black",
                "stroke-width":1,
                fill:color,
                id:"palette" + index
              }
            }
          })
        }].concat(Array.range(data.height).reduce(function(out,y){
          return out.concat(Array.range(data.width).map(function(x){
            var color = data.grid[x+"-"+y] || 0;
            return {
              tag:"use",
              attrs:{
                x:x * pixelSize,
                y:y * pixelSize,
                href:"#palette" + color,
                onClick:instanceName + ".setColor(" + x + "," + y + ")"
              }
            };
          }));
        },[]))
      })
    }
    
    var redraw = function() {
      buildSVG();
      drawInCanvas();
      ui.out.innerHTML = buildXML({
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
    
    var getActiveColorIndex = function() {
      var checked = Array.from(document.getElementByName("colors")).filter((c) => c.checked);
      return checked[0].value;
    }
    
    this.init = function() {
      // get ui components
      ui.loader = document.getElementById(inputId)
      ui.width = document.getElementById(widthFieldId);
      ui.height = document.getElementById(heightFieldId);
      ui.palette = document.getElementById(paletteId);
      ui.svg = document.getElementById(svgId);
      ui.canvas = document.getElementById(canvasId);
      ui.out = document.getElementById(outId);
      ui.codeOut = document.getElementById(codeOutId);
      ui.background = document.getElementById(colorPrefix + 0);
      
      ui.ctx = ui.canvas.getContext('2d');
      
      // apply preset size
      ui.width.value = initSize;
      ui.height.value = initSize;
      
      this.resize();
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
    
    this.resize = function() {
      data.width = ui.width.value;
      data.height = ui.height.value;
      Array.from(document.getElementsByName("transform")).forEach(function(b){
        b.disabled = (data.width != data.height);
      });
      redraw();
    }
    
    this.setScale = function(scale) {
      data.scale = scale;
      redraw();
    }

    this.transform = function(tfType) {
      var tf = new Transformer(data.width)[tfType];
      console.log(data.grid);
      data.grid = Object.entries(data.grid).reduce(function(out,entry){
        var xy = entry[0].split("-");
        xy = {x:xy[0],y:xy[1]};
        var newXY = tf(xy);
        out[newXY.x + "-" + newXY.y] = entry[1];
        return out;
      },{});
      redraw();
    }
    
    this.makeTransparent = function(makeTransparent) {
      state.makeTransparent = makeTransparent;
      redraw();
    }
    
    this.activate = function(index) {
      state.activeColor = index;
    }
    
    var displayPalette = function() {
      ui.palette.innerHTML = data.palette.slice(1).map(function(c,i){
        var index = i + 1;
        var colorSelect = ui.colorSelectPrefix + index;
        var colorId = colorPrefix + index;
        return buildXML({
          tag:"li",
          content:[{
            tag:"input",
            attrs:{
              type:"radio",
              name:"colors",
              id:colorSelect,
              value:index,
              checked:true,
              onChange:instanceName + ".activate(this.value)"
            }
          },{
            tag:"button",
            attrs:{onClick:instanceName+".deleteColor("+index+")"},
            content:[{
              tag:"svg",
              attrs:{
                width:"15px",
                height:"15px",
                viewBox:"0 0 30 30"
              },
              content:[{
                tag:"rect",
                attrs:{
                  width:30,
                  height:30,
                  "stroke-width":6,
                  stroke:"red",
                  fill:"none"
                }
              },{
                tag:"line",
                attrs:{
                  x1:0,
                  y1:0,
                  x2:30,
                  y2:30,
                  "stroke-width":3,
                  stroke:"red",
                  fill:"none"
                }
              },{
                tag:"line",
                attrs:{
                  x1:0,
                  y1:30,
                  x2:30,
                  y2:0,
                  "stroke-width":3,
                  stroke:"red",
                  fill:"none"
                }
              }]
            }]
          },{
            tag:"label",
            attrs: {for:colorSelect},
            content:[" Color " + index + ": "]
          },{
            tag:"input",
            attrs:{
              type:"color",
              name:"palette",
              id:colorId,
              value:c,
              onChange:instanceName + ".updateColor(this.value," + index + ")"
            }
          }]
        });
      }).join("");
    }

    this.addColor = function() {
      state.activeColor = data.palette.length;
      data.palette.push("#ffffff");
      displayPalette();
    }
    
    this.deleteColor = function(index) {
      data.palette.splice(index,1);
      displayPalette();
      Object.entries(data.grid).forEach(function(pixel){
        if (pixel[1] == index) {
          delete data.grid[pixel[0]];
        } else if (pixel[1] > index) {
          data.grid[pixel[0]] = pixel[1] - 1;
        }
      });
      redraw();
    }

    this.updateColor = function(color,index) {
      data.palette[index] = color;
      redraw();
    }
    
    this.setColor = function(x,y) {
      if (state.activateColor == 0) {
        data.grid[x + "-" + y]
      } else {
        data.grid[x + "-" + y] = state.activeColor;
      }
      redraw();
    }
    
    this.makeSaveFile = function() {
      ui.codeOut.value = JSON.stringify(data,null,2);
      ui.codeOut.select();
      document.execCommand('copy');
    }

  }
})()