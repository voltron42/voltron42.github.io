namespace("face-swap.FaceSwap", {}, () => {
  const frameId = "animation-frame-id-"+(new Date()).getTime();
  const fontSize = "2.5em";
  const size = "4em";
  const iconStyle = { fontSize };
  const delay = 350;
  const clearIcon = "atom";
  const icons = {
    "happy":<i className="fas fa-face-grin color-yellow" style={ iconStyle }></i>,
    "angry":<i className="fas fa-face-angry color-red" style={ iconStyle }></i>,
    "wacky":<i className="fas fa-face-grin-tongue-wink color-orange" style={ iconStyle }></i>,
    "sad":<i className="fas fa-face-sad-tear color-blue" style={ iconStyle }></i>,
    "lovey":<i className="fas fa-face-grin-hearts color-pink" style={ iconStyle }></i>,
    "sick":<i className="fas fa-face-dizzy color-green" style={ iconStyle }></i>,
    "tense":<i className="fas fa-face-grimace color-grey" style={ iconStyle }></i>,
    "atom":<i className="fas fa-atom color-white" style={ iconStyle }></i>,
    "lightbulb":<i className="fas fa-lightbulb" style={ iconStyle }></i>,
    "sun":<i className="fas fa-sun" style={ iconStyle }></i>,
    "bolt":<i className="fas fa-bolt" style={ iconStyle }></i>,
    "bomb":<i className="fas fa-bomb" style={ iconStyle }></i>
  };
  const drawIcon = function(icon) {
    if (icon) {
      return `<i class="${ icon.props.className }" style="font-size: ${ icon.props.style.fontSize };"></i>`;
    } else {
      return "";
    }
  }
  const faces = {
    "happy": "yellow", 
    "angry": "red",
    "wacky": "orange",
    "sad": "blue",
    "lovey": "pink",
    "sick": "green",
    "tense": "grey",
  };
  const copyGrid = function(grid) {
    return grid.map(row => row.map(({ face }) => {
      var cell = {};
      if (face) {
        cell.face = face;
      }
      return cell;
    }));
  }
  const getNewFace = function() {
    const keys = Object.keys(faces);
    return keys[Math.floor(Math.random() * keys.length)];
  }
  const getMatches = function(grid, face, r, c) {
    const vertical = [[r,c]];
    for (let y = r - 1; y >= 0; y--) {
      if (grid[y][c].face != face) break;
      vertical.push([y,c]);
    }
    for (let y = r + 1; y < 8; y++) {
      if (grid[y][c].face != face) break;
      vertical.push([y,c]);
    }
    const horizontal = [[r,c]];
    for (let x = c - 1; x >= 0; x--) {
      if (grid[r][x].face != face) break;
      horizontal.push([r, x]);
    }
    for (let x = c + 1; x < 8; x++) {
      if (grid[r][x].face != face) break;
      horizontal.push([r, x]);
    }
    let results = [];
    if (horizontal.length >= 3) {
      results = results.concat(horizontal);
    }
    if (vertical.length >= 3) {
      results = results.concat(vertical);
    }
    return results;
  }
  const getFirstMatches = function(grid) {
    console.log({ fn: "getFirstMatches", grid});
    for (let r = 7; r >= 0; r--) {
      for (let c = 0; c < 8; c++) {
        const face = grid[r][c].face;
        const matches = getMatches(grid, face, r, c);
        if(matches.length > 0) return { face, matches };
      }
    }
  }
  const clearMatches = function(grid, { face, matches }) {
    const mutator = ((face == clearIcon)?(cell) => { delete cell.face }:(cell) => { cell.face = clearIcon });
    Array.from(matches).forEach(([r,c]) => {
      mutator(grid[r][c]);
    });
    return grid;
  }
  const getOpenSpots = function(grid) {
    console.log({ fn: "getOpenSpots", grid});
    const open = Array.from(grid).reduce((acc, row, r) => {
      return acc.concat(row.map((_, c) => {
        return { r, c };
      }));
    },[]).filter(({ r, c }) => !grid[r][c].face);
    const zeros = open.filter(({r}) => r === 0);
    const shifters = open.filter(({ r, c }) => r > 0 && grid[r-1][c].face);
    if (zeros.length > 0 || shifters.length > 0) {
      return { zeros, shifters };
    }
  };
  const shiftDown = function(grid, { shifters, zeros } ) {
    shifters.forEach(({ r, c }) => {
      grid[r][c].face = grid[r - 1][c].face;
      delete grid[r - 1][c].face;
    });
    zeros.forEach(({ r, c }) => {
      grid[r][c].face = getNewFace();
    });
    return grid;
  }
  const areAdjacent = function([r1,c1],[r2,c2]) {
    const rDiff = Math.abs(r1 - r2);
    if(rDiff > 1) return false;
    const cDiff = Math.abs(c1 - c2);
    if(cDiff > 1) return false;
    if(rDiff == cDiff) return false;
    return true;
  }
  const swapAndResolve = function(grid, [r1,c1], [r2,c2]) {
    const face1 = grid[r1][c1].face;
    const face2 = grid[r2][c2].face;
    const matches = getMatches(grid, face1, r2, c2).concat(getMatches(grid, face2, r1, c1));
    if (matches.length > 0) {
      const temp = grid[r1][c1];
      grid[r1][c1] = grid[r2][c2];
      grid[r2][c2] = temp;
      return { grid, selected: undefined, hold: true };
    }
  };
  const buildInitState = function() {
    const grid = Array(8).fill(Array(8).fill({})).map((row) => {
      return row.map(($) => {
        return { face: getNewFace() };
      });
    });
    return { grid, selected: undefined, hold: true };
  };
  const isSelected = function(selected, r, c) {
    if (Array.isArray(selected) && selected.length == 2) {
      const [ sr, sc ] = selected;
      return sr == r && sc == c;
    }
  }
  const drawGrid = function(grid) {
    const tdAttrs = `class="text-center" style="width: ${ size }; height: ${ size }; minWidth: ${ size }; minHeight: ${ size };"`;
    const btnAttrs = `class="tn btn-dark border rounded border-dark border-1" style="width: \"100%\"; height: \"100%\";"`;
    const cellTpl = ((cell) => `<td ${tdAttrs}><button ${btnAttrs}>${ drawIcon(icons[cell.face]) }</button></td>`);
    return grid.map((row) => `<tr>${ row.map(cellTpl).join("") }</tr>`).join("");
  }
  const animate = function(grid, callback) {
    const stepUpdate = function(message, obj) {
      return () => {
        console.log({ message, obj });
        document.getElementById(frameId).innerHTML = drawGrid(grid);
        animate(obj.grid, callback);
      }
    }
    const empties = getOpenSpots(grid);
    console.log({ when: "animate", grid, empties });
    if (empties) {
      const wrapper = {};
      setTimeout(stepUpdate("empties", wrapper), delay);
      wrapper.grid = shiftDown(grid, empties);
    } else {
      const firstMatches = getFirstMatches(grid);
      console.log({ when: "animate else", firstMatches });
      if (firstMatches) {
        const wrapper = {};
        setTimeout(stepUpdate("first matches", wrapper), delay);
        wrapper.grid = clearMatches(grid, firstMatches);
      } else {
        callback(grid);
      }
    }
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = buildInitState();
      console.log({ state: this.state });
    }
    componentDidMount() {
      this.afterRender();
    }
    componentDidUpdate() {
      this.afterRender();
    }
    afterRender() {
      if (this.state.hold) {
        animate(copyGrid(this.state.grid), (grid) => {
          document.getElementById(frameId).innerHTML = "";
          this.setState({ grid, hold: undefined });
        });
      }
    }
    click(r, c) {
      if(!this.state.hold) {
        if((typeof this.state.selected) == "undefined") {
          this.setState({ selected: [r,c] });
        } else if (!areAdjacent(this.state.selected, [r,c])) {
          this.setState({ selected: undefined });
        } else {
          let newState = swapAndResolve(copyGrid(this.state.grid), this.state.selected, [r,c]);
          if (newState) this.setState(newState);
        }
      }
    }
    render() {
      console.log({ state: this.state });
      if (this.state.grid) {
        if (this.state.hold) {
          return (<div className="d-flex flex-column justify-content-center">
            <div className="d-flex justify-content-center">
              <table>
                <tbody id={frameId} dangerouslySetInnerHTML={{ __html: drawGrid(this.state.grid)}}>
                </tbody>
              </table>
            </div>
          </div>);
        } else {
          return (<div className="d-flex flex-column justify-content-center">
            <div className="d-flex justify-content-center">
              <table>
                <tbody>
                { this.state.grid.map((row,r) => {
                  return <tr key={`row${r}`}>
                    { row.map(($,c) => {
                      return <td key={`cell${r}x${c}`} className="text-center" style={{
                        width: size,
                        height: size,
                        minWidth: size,
                        minHeight: size,
                    }}>
                      <button 
                        key={`button${r}x${c}`} 
                        className={`btn btn-dark border rounded ${ isSelected(this.state.selected,r,c)?"border-info border-4":"border-dark border-1"}`}
                        style={{width:"100%",height:"100%"}}
                        onClick={() => this.click(r,c)}
                        >{ icons[$.face] }</button>
                    </td>;
                    })}
                  </tr>;
                })}
                </tbody>
              </table>
            </div>
          </div>);
        }
      } else {
        return <></>;
      }
    }
  }
});