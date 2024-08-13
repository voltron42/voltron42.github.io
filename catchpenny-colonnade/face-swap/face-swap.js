namespace("face-swap.FaceSwap", {}, () => {
  const fontSize = "2.5em";
  const size = "4em";
  const iconStyle = { fontSize };
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
  const faces = {
    "happy": "yellow", 
    "angry": "red",
    "wacky": "orange",
    "sad": "blue",
    "lovey": "pink",
    "sick": "green",
    "tense": "grey",
  };
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
  const resolveMatches = function(grid, matches) {
    const newGrid = grid.map((row) => row.map(({ face }) => { return { face }; }));
    console.log({ grid, newGrid, matches });
    for(let col = 0; col < 8; col++) {
      let columnMatches = matches.filter(([_, c]) => col == c).map(([r, _]) => r);
      let max = columnMatches.sort().reverse()[0];
      let span = columnMatches.length;
      let offset = max - span;
      for(let row = offset; row >= 0; row--) {
        newGrid[row + span][col].face = newGrid[row][col].face;
        delete newGrid[row][col].face;
      }
      console.log({ column: Array(8).fill("").map((_,i) => newGrid[i][col]) });
      for(let row = 0; row < span; row++) {
        newGrid[row][col].face = getNewFace();
      }
    }
    console.log({ newGrid })
    return newGrid;
  }
  const getFirstMatches = function(grid) {
    for (let r = 7; r >= 0; r--) {
      for (let c = 0; c < 8; c++) {
        const matches = getMatches(grid, grid[r][c].face, r, c);
        if(matches.length > 0) return matches;
      }
    }
    return [];
  }
  const resolve = function(grid) {
    const firstMatches = getFirstMatches(grid);
    if (firstMatches.length == 0) return grid;
    return resolve(resolveMatches(grid, firstMatches));
  };
  const getNextStateFromGrid = function(grid) {
    const state = { grid, selected: undefined };
    const firstMatches = getFirstMatches(grid);
    if (firstMatches.length > 0) {
      state.firstMatches = firstMatches;
    }
    return state;
  }
  const buildInitState = function() {
    const grid = Array(8).fill(Array(8).fill({})).map((row) => {
      return row.map(($) => {
        return { face: getNewFace() };
      });
    });
    return getNextStateFromGrid(grid);
  };
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
      const { grid, firstMatches } = this.state;
      if (firstMatches) {
        setTimeout(() => {
          this.setState(getNextStateFromGrid(resolveMatches(grid, firstMatches)));
        }, 2000);
      }
    }
    areAdjacent([r1,c1],[r2,c2]) {
      const rDiff = Math.abs(r1 - r2);
      if(rDiff > 1) return false;
      const cDiff = Math.abs(c1 - c2);
      if(cDiff > 1) return false;
      if(rDiff == cDiff) return false;
      return true;
    }
    swapAndResolve([r1,c1],[r2,c2]) {
      const grid = this.state.grid;
      const face1 = grid[r1][c1].face;
      const face2 = grid[r2][c2].face;
      const matches = getMatches(grid, face1, r2, c2).concat(getMatches(grid, face2, r1, c1));
      if (matches.length > 0) {
        const temp = grid[r1][c1];
        grid[r1][c1] = grid[r2][c2];
        grid[r2][c2] = temp;
        const resolved = resolveMatches(grid, matches);
        this.setState(getNextStateFromGrid(resolved));
      }
    }
    click(r, c) {
      if(!this.state.firstMatches) {
        if((typeof this.state.selected) == "undefined") {
          this.setState({ selected: [r,c] });
        } else if (!this.areAdjacent(this.state.selected, [r,c])) {
          this.setState({ selected: undefined });
        } else {
          this.swapAndResolve(this.state.selected, [r,c]);
        }
      }
    }
    isSelected(r,c) {
      return Array.isArray(this.state.selected) && this.state.selected.length == 2 && this.state.selected[0] == r && this.state.selected[1] == c;
    }
    render() {
      if (this.state.grid) {
        return (<div className="d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary" onClick={() => { this.setState({ firstMatches: undefined })}}>Stop</button>
          </div>
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
                        className={`btn btn-dark border rounded ${ this.isSelected(r,c)?"border-info border-4":"border-dark border-1"}`}
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
        </div>)
      } else {
        return <></>;
      }
    }
  }
});