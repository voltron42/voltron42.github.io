(function(){
  window[registryName].apply('Cobblestone',['PaletteUI','PixelCanvas'],function(PaletteUI,PixelCanvas){
    return function(instanceName,dlButtonId,tileListId,tileCanvasId,paletteListId,paletteId) {
      var paletteUI = new PaletteUI(instanceName,paletteId,"colorSelect","color");
      var pixelCanvas = new PixelCanvas(instanceName,tileCanvasId,16,16,6);
      var ui = {};
      var data = {
        tiles:{},
        palettes:{},
        transforms:{}
      };
      var me = this;
      this.init = function() {
        ui.dlBtn = document.getElementById(dlButtonId);
        ui.tileList = document.getElementById(tileListId);
        ui.tileCanvas = document.getElementById(tileCanvasId);
        ui.paletteList = document.getElementById(paletteListId);
        ui.palette = document.getElementById(paletteId);
      };
      this.loadData = function(input) {
        loadFile(input,function(result){
          var temp = JSON.parse(result);
          Object.entries(temp).forEach(function(entry){
            data[entry[0]] = entry[1];
          });
        });
      }
      this.selectTile = function(selector) {
        pixelCanvas.applyGrid(data.tiles[selector.value]);
        pixelCanvas.redraw(data.palettes[ui.paletteList.value]);
      }
      var nameTile = function() {
        var name = prompt("Enter the name of the new tile.");
        if (data.tiles[name]) {
          return nameTile;
        } else {
          return name;
        }
      }
      var listTiles = function(name) {
        ui.tileList.innerHTML = Object.keys(data.tiles).map(function(tileName) {
          var selected = (tileName == name)?' selected="true"':"";
          return '<option' + selected + ' value="' + tileName + '">' + tileName + '</option>';
        }).join("");
        me.selectTile(ui.tileList);        
      }
      this.addNewTile = function() {
        var name = nameTile();
        data.tiles[name] = {};
        listTiles(name);
      }
      this.removeCurrentTile = function() {
        delete data.tiles[ui.tileList.value];
        listTiles();
      }
      this.transform = function(tfType) {
        pixelCanvas.transform(tfType);
        data.tiles[ui.tileList.value] = pixelCanvas.getGrid();
      }
      this.selectPalette = function(selector) {
        
      }
      this.addNewPalette = function() {
        
      }
      this.removeCurrentPalette = function() {
        
      }
      this.activate = function(value) {
        
      }
      this.updateColor = function(value,index) {
        
      }
      this.addColor = function() {
        
      }
      this.selectTfTile = function(selector) {
        
      }
      this.selectTfPalette = function(selector) {
        
      }
      this.applyTransform = function(tfType) {
        
      }
      this.selectTransform = function(selector) {
        
      }
    }
  })
})()