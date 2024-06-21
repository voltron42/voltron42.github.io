namespace("infinitic.Infinitic",{},() => {
  let colors = {
    dark: "#212529"
  };
  let winners = [
    "012",
    "345",
    "678",
    "036",
    "147",
    "258",
    "246",
    "048"
  ]
  let hasWinner = function(spaces, turn) {
    let places = spaces.filter((_,i) => i % 2 === 0);
    if (places.length < 3) {
      return ;
    }
    places.sort();
    let possibles = [];
    if (places.length === 3) {
      possibles.push(places.join(""));
    } else {
      possibles = places.map(p => places.join("").replaceAll(p.toString(), ""));
    }
    let wins = possibles.map(p => winners.indexOf(p)).filter(w => w > 0);
    if (wins.length > 0) {
      return winners[wins[0]];
    }
  }
  return class extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        turn: true,
        spaces: []
      }
    }
    getIcon(space) {
      let index = this.state.spaces.indexOf(space);
      return (index < 0)?"":(((index % 2 == 0) == this.state.turn)?"X":"O");
    }
    clickCell(space) {
      let icon = this.getIcon(space);
      if (icon != "") {
        let spaces = Array.from(this.state.spaces);
        spaces.unshift(space);
        let winner = getWinner(spaces);
        if (spaces.length > 6) {
          spaces.pop();
        }
        console.log(this.state);
        let update = { spaces, turn: !this.state.turn };
        if (winner) {
          update.winner = winner;
        }
        this.setState();
      }
    }
    render() {
      return (<div className="d-flex justify-content-center align-items-center">
        <table className="game-board">
          <tbody>
            { [0,1,2].map(row => {
              return <tr key={`row${row}`}>
                { [0,1,2].map(cell => {
                  let space = row * 3 + cell;
                  let icon = this.getIcon(space);
                  return <td key={`cell${space}`} id={`cell${space}`}>
                    <button onClick={() => { this.clickCell(space) }} className="btn btn-dark game-space h-100 w-100">
                      <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill={colors.dark}/>
                        { icon=="O" && <circle cx="50" cy="50" r="40" strokeWidth="10" stroke="blue" fill="none"/> }
                        { icon=="X" && <g>
                          <line x1="10" y1="10" x2="90" y2="90" strokeWidth="10" stroke="red"/>
                          <line x1="10" y1="90" x2="90" y2="10" strokeWidth="10" stroke="red"/>
                        </g> }
                      </svg>
                    </button>
                  </td>;
                })}
              </tr>;
            })}
          </tbody>
        </table>
      </div>);
    }
  }
});