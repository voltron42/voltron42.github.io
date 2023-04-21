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
    componentDidUpdate() {
      const me = this;
      $(".droppable").droppable({
        drop:(event,{ draggable, helper, position, offset }) => {
          Array.from(document.querySelectorAll(".droppable")).forEach((droppable) => {
            droppable.classList.remove("drop-target");
          });
          const tasks = Array.from(me.state.tasks);
          const dropId = event.target.id;
          const taskId = draggable[0].id;
          console.log({dropId,taskId});
          const taskIndex = tasks.map((task,index) => {
            return {task,index};
          }).filter(({task}) => {
            return task.id === taskId;
          })[0].index;
          tasks[taskIndex].stage = dropId;
          me.setState({ tasks });
        }
      });
      $(".draggable").draggable({ 
        helper: "clone",
        drag:(event, { helper, position, offset }) => {
          Array.from(document.querySelectorAll(".droppable")).forEach((droppable) => {
            droppable.classList.add("drop-target");
          });
        }
      });
    }
    render() {
      return <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-center">
            { columns.map(({label,stage}) => {
              return <div id={stage} className="card droppable">
                <div className="card-body">
                  <h2>{label}</h2>
                  <div className="d-flex flex-column">
                    { this.state.tasks.filter((task) => task.stage === stage).map((task) => {
                      return <div id={ task.id } className="card draggable">
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