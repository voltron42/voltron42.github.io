namespace("2181robotics.beach-bash.BeachBall", () => {
  const draw = function(x,y,z,color) {
    return `<circle cx="${x}" cy="${y}" r="${6 + z / 12}" fill="${color}" stroke="black"/>`;
  }
  const BeachBall = function(color, x, y) {
    const state = {
      x, y, z: 0
    };
    this.draw = (() => draw(state.x, state.y, state.z, color));
    this.getXYZ = (() => [ state.x, state.y, state.z ]);
    this.getColor = (() => color);
  }
  return BeachBall;
});