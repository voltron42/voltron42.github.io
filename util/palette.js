(function(){
  window.PaletteUI = function(instanceName,paletteId) {
    
    var state = {
      palette:["#ffffff"],
      activeColor:0
    };
    
    var displayPalette = function() {
      state.paletteUI.innerHTML = [{
        tag:"input",
        attrs:{
          type:"radio",
          name:"colors",
          id:"colorSelect0",
          value:0,
          checked:true,
          onChange:instanceName + ".activate(this.value)"
        }
      },{
        tag:"label",
        attrs:{
          for:"colorSelect0"
        },
        content:[" Background Color: "]
      },{
        tag:"input",
        attrs:{
          type:"color",
          name:"palette",
          id:"color0",
          value:"#ffffff",
          onChange:instanceName + ".updateColor(this.value,0)"
        }
      },{
        tag:"ol",
        content:data.palette.slice(1).map(function(c,i){
          var index = i + 1;
          var colorSelect = ui.colorSelectPrefix + index;
          var colorId = colorPrefix + index;
          return {
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
          };
        })
      }].map(buildXML).join("");
    }
    
    this.init = function(){
      state.paletteUI = document.getElementById(paletteId);
      displayPalette();
    }
    
    this.activateColor = function(index) {
      state.activeColor = parseInt("" + index);
    }
    
    this.removeColor = function(index) {
      data.palette.splice(index,1);
      displayPalette();
    }
    
    this.updateColor = function(color, index) {
      data.palette[index] = color;
    }
    
    this.addColor = function() {
      state.activeColor = state.palette.length;
      state.palette.push("#ffffff");
      displayPalette();
    }
    
    this.getActiveIndex = function() {
      return state.activeColor;
    }
    
    this.getActiveColor = function() {
      return palette[state.activeColor];
    }
    
    this.getColor = function(index) {
      return palette[index];
    }
    
    this.colorCount = function() {
      return palette.length;
    }
    
    this.getPalette = function() {
      return palette.map((c) => c);
    }
  }
})()