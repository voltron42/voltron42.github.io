namespace("2181robotics.beach-bash.BeachBash", {
  "2181robotics.beach-bash.Constants": "Constants",
  "2181robotics.beach-bash.DigitalDisplay": "DigitalDisplay",
  "2181robotics.beach-bash.Robot": "Robot",
}, ({ Constants, DigitalDisplay, Robot }) => {
  const digitalDisplays = {
    timer: { initValue: 150, digitCount: 3 },
    red1score: { initValue: 0, digitCount: 2 },
    red2score: { initValue: 0, digitCount: 2 },
    blue1score: { initValue: 0, digitCount: 2 },
    blue2score: { initValue: 0, digitCount: 2 }
  };
  const ballInit = {
    red: [[36.5, 40], [236.5, 40], [162, 100], [198, 247]],
    blue: [[123.5, 40], [323.5, 40], [198, 137], [162, 284]]
  }
  const robotInitLoc = {
    "red-1": [49, 111],
    "red-2": [312, 273],
    "blue-1": [312, 111],
    "blue-2": [49, 273]
  }
  return function() {
    const state = {};
    this.init = function() {
      state.digitalDisplays = Object.entries(digitalDisplays).reduce((acc,[id, { initValue, digitCount }]) => {
        acc[id] = new DigitalDisplay(id, digitCount);
        acc[id].update(initValue);
        return acc;
      }, {});
      // TODO
    }
    this.config = function(event) {

    }
  }
});