namespace("v42.idiosynced.Idiosynced",{
    "v42.idiosynced.Backlog":"Backlog",
    "v42.idiosynced.Dialog":"Dialog",
    "v42.idiosynced.FrequencyView":"FrequencyView",
    "v42.idiosynced.HabitView":"HabitView",
    "v42.idiosynced.MonthlyCalendar":"MonthlyCalendar",
    "v42.idiosynced.ProjectList":"ProjectList",
    "v42.idiosynced.ProjectView":"ProjectView",
    "v42.idiosynced.RoutineList":"RoutineList",
    "v42.idiosynced.RoutineView":"RoutineView",
    "v42.idiosynced.TaskBoard":"TaskBoard",
    "v42.idiosynced.TaskTemplateView":"TaskTemplateView",
    "v42.idiosynced.TaskView":"TaskView",
    "v42.idiosynced.ViewError":"ViewError",
    "v42.idiosynced.WeeklyCalendar":"WeeklyCalendar",
    "v42.idiosynced.WorkWeekCalendar":"WorkWeekCalendar",
},({
    Backlog, Dialog, FrequencyView, HabitView, MonthlyCalendar, ProjectList,
    ProjectView, RoutineList, RoutineView, TaskBoard, TaskTemplateView,
    TaskView, ViewError, WeeklyCalendar, WorkWeekCalendar
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
                    attrs: { class: "" },
                    onClose: () => {}
                },
                taskTemplateView: {
                    templateClass: TaskTemplateView,
                    attrs: { class: "" },
                    onClose: () => {}
                },
                projectView: {
                    templateClass: ProjectView,
                    attrs: { class: "" },
                    onClose: () => {}
                },
                routineView: {
                    templateClass: RoutineView,
                    attrs: { class: "" },
                    onClose: () => {}
                },
                habitView: {
                    templateClass: HabitView,
                    attrs: { class: "" },
                    onClose: () => {}
                },
                frequencyView: {
                    templateClass: FrequencyView,
                    attrs: { class: "" },
                    onClose: () => {}
                }
            });
            const viewTask = (taskIndex) => {
                this.modals.taskView.open((taskIndex>=0)?{
                    taskIndex,task:this.state.tasks[taskIndex]
                }:{
                    taskIndex:-1,task:{}
                });
            }
            const viewProject = (projectIndex) => {
                this.modals.projectView.open({
                    projectIndex,project:this.state.projects[projectIndex]
                });
            }
            const viewRoutine = (routineIndex) => {
                this.modals.routineView.open({
                    routineIndex,routine:this.state.routines[routineIndex]
                });
            }
            const viewHabit = (habitIndex) => {
                this.modals.habitView.open({
                    habitIndex,habit:this.state.habits[habitIndex]
                })
            }
            this.rendersByView = {
                taskboard:{
                    label: "Taskboard",
                    render:() => {
                        return <TaskBoard tasks={this.state.tasks} viewTask={viewTask} updateState={(updates) => {
                            this.setState(updates);
                        }}/>;
                    }
                },
                backlog:{
                    label: "Backlog",
                    render:() => {
                        return <Backlog tasks={this.state.tasks} viewTask={viewTask}/>;
                    }
                    /*
                },
                calendarMonth:{
                    label: "Taskboard",
                    render:() => {
                        return <MonthlyCalendar/>;
                    }
                },
                calendarWeek:{
                    render:() => {
                        return <WeeklyCalendar/>;
                    }
                },
                calendarWorkWeek:{
                    render:() => {
                        return <WorkWeekCalendar/>;
                    }
                },
                projectList:{
                    render:() => {
                        return <ProjectList projects={this.state.projects} viewProject={viewProject}/>;
                    }
                },
                routineList:{
                    render:() => {
                        return <RoutineList routines={this.state.habits} viewRoutine={viewRoutine}/>;
                    }
                },
                habitList:{
                    render:() => {
                        return <HabitList habits={this.state.habits} viewHabit={viewHabit}/>;
                    }
                    */
                }
            }
        }
        render() {
            const renderer = this.rendersByView[this.state.view];
            if (renderer) {
                return renderer();
            } else {
                return <ViewError badView={this.state.view}/>;
            }
            return <>
                <h1 className="text-center">Idiosynced!</h1>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-success" onClick={() => {

                    }}>Taskboard</button>
                </div>
            </>;
        }
    }
});