namespace("todo-zone.TodoZone", {
  "todo-zone.BreakButton": "BreakButton",
  "todo-zone.NextButton": "NextButton"
}, ({ BreakButton, NextButton }) => {
  /*
  • alarm sound
  • break time
  • zone-out time
  • task list

  Task Schema
  * name
  * severity
  * due date 
  * history
  
  Task History Schema
  * start time
  * stop time

  "Working" screen:

    Big green button, big red button

    Green is finish task - prompts modal with list and resets timer
    * trigger "Stop" event on task
    * change state to "Planning"

    Red is "break"
    * trigger "Pause" event on task
    * change state to "Break"
    * start "break" alarm check

    "Task" button switches to "Planning"
    * trigger "Pause" event on task
    * change state to "Planning"

    "Settings" button switches to "Settings"
    * trigger "Pause" event on task
    * change state to "Settings"

  "Settings" screen
    * break duration
    * "check-in" alert duration

  "Planning" screen
    table listing tasks


   */
  var states = [
    "Break",
    "Planning",
    "Working",
    "Settings",
    "Reviewing"
  ];
  var severities = [
    "leisure",
    "minor",
    "major",
    "urgent"
  ];
  var severityIcons = {
    "leisure": "plus",
    "minor": "check",
    "major": "bolt",
    "urgent": "exclamation"
  };
  var severityIconPrefix = "fas fa-heart-circle-";
  var getStateIndex = function(stateName) {
    return states.indexOf(stateName)
  }
  return class extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        tasks: [{
          name: "Some Task"
        }],
        selectedTaskIndex: 0,
        breakHistory: [],
        reporting: {},
        lastActionTime: undefined,
        stateIndex: 2
      };
    }
    onTask() {

    }
    onSettings() {

    }
    onNext() {

    }
    onBreak() {

    }
    editTask(taskIndex) {

    }
    deleteTask(taskIndex) {

    }
    selectTask(taskIndex) {

    }
    viewTask(taskIndex) {

    }
    render() {
      return <>
      { states[this.state.stateIndex] == "Working" &&
        <div className="d-flex justify-content-center w-100 h-100">
          <div className="d-flex flex-column justify-content-center w-100 h-100">
            <div className="d-flex justify-content-center w-100">
              <div className="w-50">
                <button className="btn btn-secondary w-100" onClick={() => this.onTask()}>
                  <h2>{this.state.tasks[this.state.selectedTaskIndex].name}</h2>
                </button>
              </div>
              <div>
                <button className="btn btn-secondary" onClick={() => this.onSettings()}>
                  <h2><i className="fas fa-cogs"></i></h2>
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-center w-100">
              <div className="w-50">
                <NextButton onClick={() => this.onNext()}/>
              </div>
              <div className="w-50">
                <BreakButton onClick={() => this.onBreak()}/>
              </div>
            </div>
          </div>
        </div>}
      { states[this.state.stateIndex] == "Planning" &&
        <div className="d-flex justify-content-center w-100 h-100">
          <div className="d-flex flex-column justify-content-center w-100 h-100">
            <div className="d-flex justify-content-center w-100">
              <div className="w-50">
                <button className="btn btn-secondary w-100" onClick={() => this.addTask()}>
                  <h2>Add Task</h2>
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-center w-100">
              <table className="w-100">
                <tbody>
                  { this.state.tasks.map((task,taskIndex) => <tr>
                    <td>
                      <button className="btn btn-primary" onClick={ () => this.editTask(taskIndex) }>
                        <i className="fas fa-pencil"></i>
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-danger" onClick={ () => this.deleteTask(taskIndex) }>
                        <i className="fas fa-xmark"></i>
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-success" onClick={ () => this.selectTask(taskIndex) }>
                        <i className="fas fa-check"></i>
                      </button>
                    </td>
                    <td>
                      <button className={`btn btn-${taskIndex == this.state.selectedTaskIndex?'success':'secondary'} w-100`} onClick={ () => this.viewTask(taskIndex) }>{task.name}</button>
                    </td>
                    <td>
                      { ( task.severity > -1 ) && <i className={ severityIconPrefix + severityIcons[severities[task.severity]] }></i> }
                    </td>
                    <td>
                      { task.dueDate && <>
                        <span>{task.dueDate}</span>
                        <button className="btn btn-secondary" onClick={ () => this.editDueDate(taskIndex) }>
                          <i className="fa fa-calendar-days"></i>
                        </button>
                      </> }
                    </td>
                  </tr> )}
                </tbody>
              </table>
            </div>
          </div>
        </div>}
      { states[this.state.stateIndex] == "Break" &&
        <div className="d-flex justify-content-center w-100 h-100">
          <div className="d-flex flex-column justify-content-center w-100 h-100">
            <h1 className="align-content-middle">
              { /* Break timer here */ }
            </h1>
          </div>
        </div>}
      </>;
    }
  }
});