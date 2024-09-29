namespace("2181robotics.scouting.Scouting", {
  "gizmo-atheneum.namespaces.LoadFile": "LoadFile",
  "gizmo-atheneum.namespaces.CSV": "CSV",
  "2181robotics.scouting.Analyze": "Analyze",
  "2181robotics.scouting.TableComponent": "TableComponent"
}, ({ LoadFile, CSV, Analyze, TableComponent }) => {
  const Scouting = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    loadCsvData() {
      LoadFile(false, "text", (fileContents, fileName) => {
        const tableData = TableComponent.parseDataFromCSV(CSV.parse(fileContents, ",").filter(row => !CSV.isRowEmpty(row)));
        this.setState({ 
          data: tableData,
          analyze: Analyze.calcTotalsWinsLosses(tableData)
        });
      }, (fileName, error) => {
        alert(`An error occurred loading file "${fileName}.\nSee console for details."`);
        console.log({ fileName, error });
        throw error;
      });
    }
    render() {
      return <>{
        this.state.data == undefined && <div className="h-100 d-flex flex-column justify-content-center align-content-center">
          <button className="btn btn-primary" onClick={ () => this.loadCsvData() }>Load CSV File</button>
        </div>
      }{
        this.state.data && <div className="d-flex flex-column justify-content-center">
          <h3 className="text-center">Replace the following table with some other display of the processed data:</h3>
          <TableComponent headers={this.state.data.headers} records={this.state.data.records}/>
          <hr className="text-center"/>
          <h3 className="text-center">Sample Data Analysis by Totals</h3>
          <TableComponent headers={this.state.analyze.headers} records={Analyze.rankTotals(this.state.analyze.records)}/>
          <h3 className="text-center">Sample Data Analysis by Wins then Totals</h3>
          <TableComponent headers={this.state.analyze.headers} records={Analyze.rankWinsThenTotals(this.state.analyze.records)}/>
        </div>
      }</>
    }
  }
  return Scouting;
});