namespace("todo-zone.TodoZone", {
  "todo-zone.BreakButton": "BreakButton",
  "todo-zone.NextButton": "NextButton"
}, ({ BreakButton, NextButton }) => {
  /*
  • alarm sound
  • break time
  • zone-out time
  • task list

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
  
  "Planning" screen



   */
  var states = [
    "Break",
    "Planning",
    "Working",
    "Settings",
    "Reviewing"
  ]
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
        history: [],
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
    render() {
      return <>
      { states[this.state.stateIndex] == "Working" &&
        <div className="d-flex justify-content-center w-100 h-100">
          <div className="d-flex flex-column justify-content-center w-100 h-100">
            <div className="d-flex justify-content-center w-100">
              <div className="w-50">
                <button className="w-100" onClick={() => this.onTask()}>
                  <h2>{this.state.tasks[this.state.selectedTaskIndex].name}</h2>
                </button>
              </div>
              <div>
                <button onClick={() => this.onSettings()}>
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
        <div className="d-flex justify-content-center">
          { /* planning table here */ }
        </div>}
      { states[this.state.stateIndex] == "Break" &&
        <div className="d-flex justify-content-center">
          { /* Break timer here */ }
        </div>}
      </>;
    }
  }
});