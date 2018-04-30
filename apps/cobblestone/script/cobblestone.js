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
        var palette = data.palettes[ui.paletteList.value];
        if (!palette) {
          alert("Please select a palette to display grid");
        } else {
          pixelCanvas.redraw(palette);
        }
      }
      var pickName = function(colName) {
        var name = prompt("Enter the name of the new tile.");
        if (data[colName][name]) {
          return nameTile;
        } else {
          return name;
        }
      }
      var makeList = function(uiList,colName,selectFn,name) {
        uiList.innerHTML = Object.keys(data[colName]).map(function(itemName) {
          var selected = (itemName == name)?' selected="true"':"";
          return '<option' + selected + ' value="' + itemName + '">' + itemName + '</option>';
        }).join("");
        me[selectFn](uiList);
      }
      var listTiles = function(name) {
        makeList(ui.tileList,"tiles","selectTile",name);
      }
      var listPalettes = function(name) {
        makeList(ui.paletteList,"palettes","selectPalette",name);
      }
      this.addNewTile = function() {
        var name = pickName("tiles");
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
        var tile = data.tiles[ui.tileList.value];
        if (!tile) {
          alert("Please select a tile to display grid");
        } else {
          pixelCanvas.applyGrid(tile);
          pixelCanvas.redraw(palettes[selector.value]);
        }
      }
      this.addNewPalette = function() {
        var name = pickName("tiles");
        data.tiles[name] = {};
        listTiles(name);
      }
      this.removeCurrentPalette = function() {
        delete data.palettes[ui.paletteList.value];
        listPalettes();
      }
      this.activate = function(value) {
        paletteUI.activate(value);
      }
      this.updateColor = function(value,index) {
        data.palettes[ui.paletteList.value][index] = value;
        
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