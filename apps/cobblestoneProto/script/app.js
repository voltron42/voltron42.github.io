(function(){
    window[registryName].apply('BuilderProto',
    ['MapBuilder','MapParser','TileParser','ColorConstants','Point','Transformer'],
    function(MapBuilder, MapParser, TileParser, Point, ColorConstants, Transformer) {

      var tf = new Transformer(16);
      var tileParser = new TileParser(16,16);
      var mapParser = new MapParser();
      
      var compileFiles = function(contents) {
         return Object.entries(contents).reduce(function(out,entry){
          var json = JSON.parse(entry[1]);
          Object.entries(json[0]).forEach(function(tile){
            out.tiles[tile[0]] = tile[1];
          });
          Object.entries(json[1]).forEach(function(palette){
            out.palettes[palette[0]] = palette[1];
          });
          Object.entries(json[2]).forEach(function(page){
            out.pages[page[0]] = page[1];
          });
          return out;
        },{tiles:{},palettes:{},pages:{}});
      }
      
      var buildMapBuilder = function(uiBuilder, uiDisplay) {
        return function(contents) {
          console.log(contents);
          var data = compileFiles(contents);
          console.log(data);
          data.tiles = Object.entries(data.tiles).reduce(function(tiles,tile){
            tiles[tile[0]] = tileParser.parse(tile[1]);
            return tiles;
          },{})
          console.log(data);
          data.pages = mapParser.parse(data.pages);
          console.log(data);
          var mapBuilder = new MapBuilder(data.tiles, data.palettes);
          var pages = Object.entries(data.pages).reduce(function(out, page){
            out[page[0]] = mapBuilder.transform(page[1]);
            return out;
          },{})
          console.log(pages)
        };
      }
      
      return function(inputId,builderId,displayId) {
        var ui = {};
        
        this.init = function(){
          ui.input = document.getElementById(inputId);
          ui.builder = document.getElementById(builderId);
          ui.display = document.getElementById(displayId);
        }
        
        this.build = function() {
          loadFile(ui.input,buildMapBuilder(ui.builder,ui.display));
        }
      }
    });
})()