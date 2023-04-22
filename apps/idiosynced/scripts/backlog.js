namespace('v42.idiosynced.Backlog',{

}, ({  }) => {
  const cardClasses = "card bg-dark border border-5 rounded-3";
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        tasks: props.tasks 
      };
    }
    render() {
      return <div className="row h-100">
        <div className="col-12 h-100">
          <div className={`${cardClasses} border-light h-100`}>
            <div className="card-body h-100">
              <div className="d-flex flex-column h-100">
                <button className="btn btn-success">Add Task</button>
                { this.state.tasks.map((task) => {
                  return <div className={`${cardClasses} border-light`}>
                    <div className="card-body">
                      <span><strong>{task.title}</strong> - {task.description}</span>
                    </div>
                  </div>;
                })  }
              </div>
            </div>
          </div>
        </div>
      </div>;
    }
  }
});