namespace("2181robotics.scouting.Scouting", () => {
  const Scouting = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    loadCsvData() {
      // write data load here
      // need file load from Scullery-Plateau
    }
    render() {
      return <>{
        this.state.data == undefined && <div classname="text-center">
          <button onclick={ () => loadCsvData() }>Load CSV File</button>
        </div>
      }{
        this.state.data && <div classname="text-center">
          <h3>Replace the following table with some other display of the processed data:</h3>
          <table>
            <thead>
              <tr>
                { this.state.data.headers.map( (header) => <th>{header}</th> ) }
              </tr>
            </thead>
            <tbody>
              { this.state.data.rows.map((row) => {
                return <tr>
                  { row.map(cell => {
                    return <td>{cell}</td>;
                  }) }
                </tr>;
              }) }
            </tbody>
          </table>
        </div>
      }</>
    }
  }
});