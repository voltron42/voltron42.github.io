import kaplay from "https://unpkg.com/kaplay@3000.1.17/dist/kaboom.mjs"

(() => {
  const k = kaplay({ 
    global: false,
    scale: 0.75,
    background: [ 0, 0, 0 ]
  });
  const utils = importNamespace("delian-maze.Utilities");
  const gameData = importNamespace("delian-maze.GameData");
  const SPEED = 120;

  k.loadSpriteAtlas("./assets/tiles.png", utils.buildSpriteAtlas(gameData.spriteMap, 50, 7, 8));

  k.addLevel(gameData.floorMap, {
    tileWidth:50,
    tileHeight:50,
    tiles: utils.buildLevelTiles(gameData.floors, 
      (spriteName) => [
        k.sprite(spriteName)
      ])
  });

  const wallTiles = utils.buildLevelTiles(gameData.walls, 
    (spriteName) => {
      const areaConfig = {};
      const brazier = gameData.braziers[spriteName];
      if (brazier) {
        const [ x, y, width, height ] = brazier;
        areaConfig.shape = new k.Rect( k.vec2( x, y ), width, height );
      }
      return [
        k.sprite( spriteName ),
        k.area( areaConfig ),
        k.body({ isStatic: true }),
        k.tile({ isObstacle: true }),
      ];
    });

  wallTiles["@"] = (() => [
    k.sprite("ranger"),
    k.area(),
    k.body(),
    k.anchor("bot"),
    "player"
  ]);

  const map = k.addLevel(gameData.wallMap, {
    tileWidth:50,
    tileHeight:50,
    tiles: wallTiles
  });

  const player = map.get("player")[0];

  player.onUpdate(() => {
    // Set the viewport center to player.pos
    k.camPos(player.pos)
  })
  
  player.onPhysicsResolve(() => {
    // Set the viewport center to player.pos
    k.camPos(player.pos)
  })
  
  k.onKeyDown("right", () => player.move(SPEED, 0));
  k.onKeyDown("left", () => player.move(-SPEED, 0));
  k.onKeyDown("up", () => player.move(0, -SPEED));
  k.onKeyDown("down", () => player.move(0, SPEED));

})();
