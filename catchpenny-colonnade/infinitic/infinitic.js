namespace("infinitic.Infinitic",{},() => {
  return class extends React.Component {
    constructor(props){
      super(props);
    }
    clickCell(row, cell) {
      console.log({row, cell});
      // todo
    }
    render() {
      return (<div>
        <table className="table table-sm game-board">
          <tbody>
            { [0,1,2].map(row => {
              return <tr key={`row${row}`}>
                { [0,1,2].map(cell => {
                  return <td  key={`cell${row}x${cell}`}><button onClick={this.clickCell(row, cell)} className="btn btn-dark game-space h-100 w-100"><span>_</span></button></td>;
                })}
              </tr>;
            })}
          </tbody>
        </table>
      </div>);
    }
  }
});