namespace("v42.idiosynced.Idiosynced",{
    "v42.idiosynced.Backlog":"Backlog",
    "v42.idiosynced.Dialog":"Dialog",
    "v42.idiosynced.FileDownload":"FileDownload",
    "v42.idiosynced.LoadFile":"LoadFile",
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
                tasks: []
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
                const data = JSON.stringify([this.state,updates].reduce((out,obj) => {
                    return Object.entries(obj).reduce((acc,[k,v]) => {
                        acc[k] = v;
                        return acc;
                    }, out);
                }, {}));
                console.log(`javascript:localStorage.setItem("${localStorageKey}", \`${data}\`)`);
                localStorage.setItem(localStorageKey, data);
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
        download() {
            FileDownload.triggerJSONDownload("idiosynced","idiosynced",this.state);
        }
        upload() {
            LoadFile(
                false,
                'text',
                (fileContent) => {
                  const jsonData = JSON.parse(fileContent);
                  const error = Schema.validate(jsonData);
                  if (error) {
                    throw error;
                  }
                  this.setState(jsonData);
                },
                (fileName, error) => {
                  console.log({ fileName, error });
                  alert(fileName + ' failed to load. See console for error.');
                }
            );
        }
        render() {
            const renderer = this.rendersByView[this.state.view];
            return <>
                <h1 className="text-center">
                    <a href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                        }} 
                        onDoubleClick={(e) => {
                            e.preventDefault();
                            this.download();
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            this.upload();
                        }}
                    >Idiosynced!</a>
                </h1>
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