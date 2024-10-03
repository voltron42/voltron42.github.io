namespace("2181robotics.beach-bash.BounceTest", {
  "2181robotics.beach-bash.Bounce": "Bounce"
}, ({ Bounce }) => {
  const frameRate = 24;
  const heading = 30;
  const launchAngle = 65;
  const launchVelocity = 20;
  const initHeight = 1.5;
  const getMinMaxXY = function(path) {
    const xs = path.map(p => p.x);
    const ys = path.map(p => p.y);
    const minX = Math.min.apply(null,xs);
    const maxX = Math.max.apply(null,xs);
    const minY = Math.min.apply(null,ys);
    const maxY = Math.max.apply(null,ys);
    return { minX, maxX, minY, maxY };
  }
  const wrapSVG = function(content) {
    return `<svg width="100%" height="100%" viewBox="${minX} ${minY} ${width} ${height}">${content}</svg>`;
  }
  const path2d = Bounce.calcPath2d(launchAngle, launchVelocity, initHeight);
  const path3d = Bounce.calcPath3d(heading, launchAngle, launchVelocity, initHeight);
  return function() {
    this.draw = function() {
      // todo
    }
  }
});