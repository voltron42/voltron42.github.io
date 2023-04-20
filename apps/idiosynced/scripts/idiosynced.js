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
                view: "taskboard"
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
                taskboard:() => {
                    return <TaskBoard/>;
                },
                backlog:() => {
                    return <Backlog/>
                },
                calendarMonth:() => {
                    return <MonthlyCalendar/>
                },
                calendarWeek:() => {
                    return <WeeklyCalendar/>
                },
                calendarWorkWeek:() => {
                    return <WorkWeekCalendar/>
                },
                projectList:() => {
                    return <ProjectList projects={this.state.projects} viewProject={viewProject}/>
                },
                routineList:() => {
                    return <RoutineList routines={this.state.habits} viewRoutine={viewRoutine}/>
                },
                habitList:() => {
                    return <HabitList habits={this.state.habits} viewHabit={viewHabit}/>
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
        }
    }
});