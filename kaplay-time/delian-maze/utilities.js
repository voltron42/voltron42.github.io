namespace("delian-maze.Utilities", {}, () => {
  const buildSpriteAtlas = function(spriteMap, tileSize, rowCount, columnCount) {
    let rowChars = "abcdefghij";
    let columnChars = "123456789";
    const spriteAtlas = {};
    for(let row = 0; row < rowCount; row++) {
      for(let column = 0; column < columnCount; column++) {
        let coord = rowChars.charAt(row) + columnChars.charAt(column);
        let sprite = spriteMap[coord]
        if (sprite) {
          spriteAtlas[sprite] = {
            x: column * tileSize,
            y: row * tileSize,
            width: tileSize,
            height: tileSize
          }
        }
      }
    }
    return spriteAtlas;
  }
  const buildLevelTiles = function(tileMap, tileFn) {
    return Object.entries(tileMap).reduce((acc, [key, sprite]) => {
      acc[key] = (() => tileFn(sprite,key));
      return acc;
    }, {});
  }
  return { buildSpriteAtlas, buildLevelTiles };
});