namespace("infinitic.Infinitic",{},() => {
  let colors = {
    dark: "#212529"
  };
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
      var spaces = Array.from(this.state.spaces);
      spaces.unshift(space);
      if (spaces.length > 6) {
        spaces.pop();
      }
      console.log(this.state)
      this.setState({ spaces, turn: !this.state.turn });
    }
    render() {
      return (<div className="d-flex justify-content-center align-items-center h-100">
        <table className="game-board w-75">
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