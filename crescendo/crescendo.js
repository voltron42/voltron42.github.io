namespace("crescendo.Crescendo", () => {
  const getDefs = function() {
    return `<g id="floor">
      <rect width="200" height="100" fill="grey" stroke="white" stroke-width="2"/>
      <rect x="2" y="2" width="196" height="96" fill="none" stroke="black" stroke-width="2"/>
      <line x1="2" y1="50" x2="198" y2="50" stroke="black" stroke-width="0.5"/>
      <line x1="100" y1="8" x2="100" y2="92" stroke="black" stroke-width="0.5"/>
      <line x1="51" y1="13" x2="51" y2="92" stroke="black"/>
      <line x1="149" y1="13" x2="149" y2="92" stroke="black"/>
      <line x1="82" y1="8" x2="82" y2="92" stroke="blue"/>
      <polygon fill="blue" points="30 45 40 40 40 30 30 25"/>
      <polygon fill="white" points="40 40 40 30 30 35"/>
      <polygon stroke="blue" fill="none" points="62 50 82 38 82 62"/>
      <line x1="118" y1="8" x2="118" y2="92" stroke="red"/>
      <polygon stroke="red" fill="none" points="138 50 118 38 118 62"/>
      <polygon fill="red" points="170 45 160 40 160 30 170 25"/>
      <polygon fill="white" points="160 40 160 30 170 35"/>
      <polyline stroke="red" fill="none" points="30 75 50 85 50 92"/>
      <polyline stroke="blue" fill="none" points="30 13 62 13 62 8"/>
      <polyline stroke="blue" fill="none" points="170 75 150 85 150 92"/>
      <polyline stroke="red" fill="none" points="138 8 138 13 170 13"/>
      <polygon stroke="black" fill="none" points="170 8 170 82 150 92 50 92 30 82 30 8"/>
    </g>
    <g id="ring">
      <circle cx="0" cy="0" r="1.5" fill="none" stroke="orange"/>
    </g>
    <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
      <stop offset="0%" stop-color="green">
      </stop>
      <stop offset="100%" stop-color="yellow">
      </stop>
    </linearGradient>
    <pattern id="loading" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
      <rect y="-3" width="3" height="3" fill="url(#gradient)">
        <animate 
          attributeName="y"
          begin="0s"
          dur="0.75s"
          from="-3"
          to="0"
          repeatCount="indefinite"/>
      </rect>
      <rect y="0" width="3" height="3" fill="url(#gradient)">
        <animate 
          attributeName="y"
          begin="0s"
          dur="0.75s"
          from="0"
          to="3"
          repeatCount="indefinite"/>
      </rect>
    </pattern>`;
  }
  const ring = function([x,y]) {
    return `<use href="#ring" x="${x}" y="${y}"/>`;
  }
  const intakeStates = {
    empty: "white",
    intakeOn: "yellow",
    loading: "url(#loading)",
    ready: "green"
  }
  const robot = function({id,color,x,y,r,intakeState}) {
    return `<g transform="translate(${x},${y}) rotate(${r})">
      <rect x="-2.5" y="-2.5" width="5" height="5" fill="${color}"/>
      <polygon fill="${intakeStates[intakeState]}" points="0 -1.5 -1.5 1.5 1.5 1.5"/>
      <title>${id}</title>
    </g>`;
  }
  const rings = [
    [60,20],
    [60,35],
    [60,50],
    [140,20],
    [140,35],
    [140,50],
    [100,20],
    [100,35],
    [100,50],
    [100,65],
    [100,80]
  ];
  const robots = [{
    id: 2181,
    color: "blue",
    x: 40,
    y: 55,
    r: 80,
    intakeState: "empty"
  }, {
    id: 2040,
    color: "blue",
    x: 40,
    y: 65,
    r: 80,
    intakeState: "intakeOn"
  }, {
    id: 4005,
    color: "blue",
    x: 40,
    y: 75,
    r: 80,
    intakeState: "ready"
  }, {
    id: 1234,
    color: "red",
    x: 160,
    y: 55,
    r: 280,
    intakeState: "loading"
  }, {
    id: 4321,
    color: "red",
    x: 160,
    y: 65,
    r: 280,
    intakeState: "empty"
  }, {
    id: 5678,
    color: "red",
    x: 160,
    y: 75,
    r: 280,
    intakeState: "ready"
  }];
  const Crescendo = function(layerId) {
    this.run = function() {
      document.getElementById(layerId).innerHTML = rings.map(ring).concat(robots.map(robot)).join("");
    }
  };
  Crescendo.getDefs = getDefs;
  return Crescendo;
});