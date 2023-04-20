namespace('v42.idiosynced.TaskBoard',{

}, ({  }) => {
  const columns = [{
    label: "Ready",
    stage: "ready"
  },{
    label: "In Progress",
    stage: "inProgress"
  },{
    label: "Done",
    stage: "done"
  }];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        tasks: props.tasks
      };
    }
    render() {
      return <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-center">
            { columns.map(({label,stage}) => {
              return <div className="card">
                <div className="card-body">
                  <h2>{label}</h2>
                  <div className="d-flex flex-column">
                    { this.state.tasks.filter((task) => task.stage === stage).map((task) => {
                      return <div className="card">
                        <div className="card-body">
                        <h3 className="card-title">{task.title}</h3>
                        <p className="card-text">{task.description}</p>
                        </div>
                      </div>;
                    }) }
                  </div>
                </div>      
              </div>;
            }) }
          </div>;
        </div>      
      </div>
    }
  }
});