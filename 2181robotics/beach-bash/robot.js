namespace("2181robotics.beach-bash.Robot", () => {
  const wheelBaseDegreesPerFeet = 360 / (Math.sqrt(2 * 16 * 16) * 2 * Math.PI);
  const numbers = {
    "1": "One",
    "2": "Two"
  }
  const intakeStates = {
    empty: "white",
    intakeOn: "yellow",
    loading: "url(#loading)",
    ready: "green"
  };
  const draw = function(color, number, { x, y, r, intakeState }) {
    return `<g transform="translate(${x},${y}) rotate(${r})">
      <rect x="-18" y="-18" width="36" height="36" fill="${color}" stroke="black"/>
      <polygon points="0 -14 14 14 -14 14" fill="${intakeStates[intakeState]}"/>
      <use href="#mark${numbers[number]}" stroke="${color}"/>
    </g>`;
  }
  const Robot = function(color, number, x, y, initConfig) {
    const id = color + numbers[number];
    const state = {
      x, y, r:0, intakeState: "empty"
    };
    const config = Object.assign({}, initConfig);
    this.getId = (() => id);
    this.getPoly = (() => [0,1,2,3].map(i => {
      const radians = (state.r + 45 + i * 90) * Math.PI / 180;
      return [ Math.cos(radians), Math.sin(radians) ];
    }));
    this.draw = function() {
      document.getElementById(id).innerHTML = draw(color, number, state);
    }
    this.move = function(deltaX, deltaY, deltaR) {
      state.x += deltaX * config.moveSpeed * 12 / config.frameRate;
      state.y += deltaY * config.moveSpeed * 12 / config.frameRate;
      state.r += deltaR * config.moveSpeed * 12 * wheelBaseDegreesPerFeet / config.frameRate;
    }
    this.reconfigure = function(newConfig) {
      Object.assign(config, newConfig);
    }
    this.setIntakeState = function(newIntakeState) {
      if (!(newIntakeState in intakeStates)) {
        throw `Invalid intake state: ${newIntakeState}`;
      }
      state.intakeState = newIntakeState;
    }
  };
  Robot.getIntakeStates = function() {
    return Object.keys(intakeStates);
  }
  return Robot;
});