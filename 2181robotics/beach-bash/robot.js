namespace("2181robotics.beach-bash.Robot", () => {
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
  const draw = function(color, number, x, y, r, intakeState) {
    return `<g transform="translate(${x},${y}) rotate(${r})">
      <rect x="-18" y="-18" width="36" height="36" fill="${color}" stroke="black"/>
      <polygon points="0 -14 14 14 -14 14" fill="${intakeStates[intakeState]}"/>
      <use href="#mark${numbers[number]}" stroke="${color}"/>
    </g>`;
  }
  const Robot = function(color, number) {
    
  };
  Robot.getIntakeStates = function() {
    return Object.keys(intakeStates);
  }
  Robot.getIntakeStateColor = function(intakeState) {
    return intakeStates[intakeState];
  }
  return Robot;
});