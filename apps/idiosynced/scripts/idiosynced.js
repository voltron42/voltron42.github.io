namespace("v42.idiosynced.Idiosynced",{
    "v42.idiosynced.Backlog":"Backlog",
    "v42.idiosynced.Dialog":"Dialog",
    "v42.idiosynced.TaskBoard":"TaskBoard",
    "v42.idiosynced.TaskView":"TaskView",
    "v42.idiosynced.ViewError":"ViewError",
},({
    Backlog, Dialog, TaskBoard, TaskView, ViewError
}) => {
    const localStorageKey = "v42.idiosynced.Idiosynced.localData";
    return class extends React.Component {
        constructor(props) {
            super(props);
            const localData = localStorage.getItem(localStorageKey);
            this.state = localData ? JSON.parse(localData) : {
                view: "taskboard",
                tasks: [{
                    id:"task-1234",
                    title:"Pay xFinity",
                    description: "Pay $250 to xFinity prior to 12th of month",
                    stage: "ready"
                }]
            };
            this.modals = Dialog.factory({
                taskView: {
                    templateClass: TaskView,
                    attrs: { class: "bg-dark text-light border border-5 rounded-3" },
                    onClose: ({task,index}) => {
                        const tasks = Array.from(this.state.tasks);
                        if (index < 0) {
                            tasks.push(task);
                        } else {
                            tasks[index] = task;
                        }
                        this.setState({ tasks });
                    }
                }
            });
            const viewTask = (index) => {
                this.modals.taskView.open((index>=0)?{
                    index,task:this.state.tasks[index]
                }:{});
            }
            const me = this;
            this.updateState = (updates) => {
                localStorage.setItem(localStorageKey, JSON.stringify([this.state,updates].reduce((out,obj) => {
                    return Object.entries(obj).reduce((acc,[k,v]) => {
                        acc[k] = v;
                        return acc;
                    }, out);
                }, {})));
                me.setState(updates);
            }
            this.rendersByView = {
                backlog:{
                    label: "Backlog",
                    render:() => {
                        return <Backlog tasks={this.state.tasks} viewTask={viewTask} updateState={this.updateState}/>;
                    }
                },
                taskboard:{
                    label: "Taskboard",
                    render:() => {
                        return <TaskBoard tasks={this.state.tasks} viewTask={viewTask} updateState={this.updateState}/>;
                    }
                },
            }
        }
        render() {
            const renderer = this.rendersByView[this.state.view];
            return <>
                <h1 className="text-center">Idiosynced!</h1>
                <div className="m-2 d-flex justify-content-center">
                    { Object.entries(this.rendersByView).map(([view, { label }]) => {
                        return <button className={`btn ${ this.state.view === view ? 'btn-light' : 'btn-info' }`} disabled={this.state.view === view} onClick={() => {
                            this.updateState({ view });
                        }}>{ label }</button>;
                    })}
                </div>
                { renderer ? renderer.render() : <ViewError badView={this.state.view}/> }
            </>;
        }
    }
});