namespace("face-swap.FaceSwap", {}, () => {
  const fontSize = "2.5em";
  const size = "4em";
  const icons = {
    "happy":<i className="fas fa-face-grin color-yellow" style={{ fontSize }}></i>,
    "angry":<i className="fas fa-face-angry color-red" style={{ fontSize }}></i>,
    "wacky":<i className="fas fa-face-grin-tongue-wink color-purple" style={{ fontSize }}></i>,
    "sad":<i className="fas fa-face-sad-tear color-blue" style={{ fontSize }}></i>,
    "lovey":<i className="fas fa-face-grin-hearts color-pink" style={{ fontSize }}></i>,
    "sick":<i className="fas fa-face-dizzy color-green" style={{ fontSize }}></i>,
    "tense":<i className="fas fa-face-grimace color-orange" style={{ fontSize }}></i>,
    "atom":<i className="fas fa-atom color-white" style={{ fontSize }}></i>,
    "lightbulb":<i className="fas fa-lightbulb" style={{ fontSize }}></i>,
    "sun":<i className="fas fa-sun" style={{ fontSize }}></i>,
    "bolt":<i className="fas fa-bolt" style={{ fontSize }}></i>,
    "bomb":<i className="fas fa-bomb" style={{ fontSize }}></i>
  };
  const faces = {
    "happy": "yellow", 
    "angry": "red",
    "wacky": "purple",
    "sad": "blue",
    "lovey": "pink",
    "sick": "green",
    "tense": "orange",
  };
  const getMatches = function(grid, face, r, c) {
    // move out from point to get all adjacent matches, vertical then horizontal
    // return union of sets of size greater than 2
    return [];
  }
  const resolveMatches = function(grid, matches) {
    // remove faces from given matched spaces
    // shift all faces down the grid
  }
  const getFirstMatches = function(grid) {
    for (let r = 7; r >= 0; r--) {
      for (let c = 0; c < 8; c++) {
        const matches = getMatches(grid, grid[r][c], r, c);
        if(matches.length > 0) {
          return matches;
        } 
      }
    }
  }
  const resolve = function(grid) {
    const matches = getFirstMatches(grid);
    if (matches.length == 0) {
      return grid;
    }
    return resolve(resolveMatches(grid, matches));
  };
  const buildInitState = function() {
    const keys = Object.keys(faces);
    const grid = Array(8).fill(Array(8).fill({})).map((row) => {
      return row.map(($) => {
        return { face: keys[Math.floor(Math.random() * keys.length)] };
      });
    });
    return { grid: resolve(grid) };
  };
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = buildInitState();
      console.log({ state: this.state });
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
      const face1 = grid[r1][c1];
      const face2 = grid[r2][c2];
      const matches = getMatches(grid, face1, r2, c2).concat(getMatches(grid, face2, r1, c1));
      if (matches.length > 0) {
        const temp = grid[r1][c1];
        grid[r1][c1] = grid[r2][c2];
        grid[r2][c2] = temp;
        this.setState({ grid: resolve(resolveMatches(grid, matches)), selected: undefined });
      }
    }
    click(r, c) {
      if((typeof this.state.selected) == "undefined") {
        this.setState({ selected: [r,c] });
      } else if (!this.areAdjacent(this.state.selected, [r,c])) {
        this.setState({ selected: undefined });
      } else {
        this.swapAndResolve(this.state.selected, [r,c]);
      }
    }
    isSelected(r,c) {
      return Array.isArray(this.state.selected) && this.state.selected.length == 2 && this.state.selected[0] == r && this.state.selected[1] == c;
    }
    render() {
      if (this.state.grid) {
        return (<table>
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
        </table>);
      } else {
        return <></>;
      }
    }
  }
});