namespace("calendar.Calendar",{},() => {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const buildStateFromDate = function(myDate) {
        const year = myDate.getFullYear();
        const month = myDate.getMonth();
        const day = myDate.getDate();
        const weekdayOfFirst = new Date(year, month, 1).getDay();
        const prevLast = new Date(year, month, 0).getDate();
        const lastDate = new Date(year, month+1, 0);
        const lastDay = lastDate.getDate();
        const weekdayOfLast = lastDate.getDay();
        const first = prevLast - weekdayOfFirst + 1;
        const finalWeekCount = 6 - weekdayOfLast;
        let days = [];
        for(let value = first; value <= prevLast; value++) {
            days.push({ value, isThisMonth: false });
        }
        for(let value = 1; value <= lastDay; value++) {
            days.push({ value, isThisMonth: true, isToday: (value === day) });
        }
        for(let value = 1; value <= finalWeekCount; value++) {
            days.push({ value, isThisMonth: false });
        }
        const calendar = [];
        while(days.length > 0) {
            calendar.push(days.slice(0,7));
            days = days.slice(7);
        }
        return { year, month, day, calendar };
    };
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = buildStateFromDate(new Date());
        }
        update(field,adder) {
            const newDate = {
                year: this.state.year,
                month: this.state.month,
                day: this.state.day,
            }
            newDate[field] += adder;
            const {year, month, day} = newDate;
            this.setState(buildStateFromDate(new Date(year, month, day)));
        }
        render() {
            return <div className="calendar-body d-flex flex-column w-100 h-100">
                <div className="d-flex justify-content-around m-2">
                    <div className="d-flex justify-content-center">
                        <div className="d-flex flex-column justify-content-around">
                            <button className="btn btn-primary arrow-button" onClick={() => this.update('year',-1)}>&lt;</button>
                        </div>
                        <h2 className="text-center">{ this.state.year }</h2>
                        <button className="btn btn-primary arrow-button" onClick={() => this.update('year',1)}>&gt;</button>
                    </div>
                    <div className="d-flex justify-content-around">
                        <button className="btn btn-primary arrow-button" onClick={() => this.update('month',-1)}>&lt;</button>
                        <h2 className="text-center">{ months[this.state.month] }</h2>
                        <button className="btn btn-primary arrow-button" onClick={() => this.update('month',1)}>&gt;</button>
                    </div>
                </div>
                <div className="d-flex justify-content-center w-100 h-75 m-2">
                    <table className="border w-100 h-100">
                        <tbody className="w-100 h-100">
                            <tr style={{ height: "1.5em" }}>
                                { weekdays.map((weekday) => {
                                    return <th className="text-center border" style={{ width: "14.28%" }}>{ weekday }</th>
                                }) }
                            </tr>
                            { this.state.calendar.map((week) => {
                                return <tr className="w-100" style={{ height: "12.5%" }}>
                                    { week.map((day) => {
                                        return <td 
                                            className={ `border align-top ${day.isThisMonth?(day.isToday?'today':'this-month'):'not-this-month'}`}
                                            style={{
                                                width: "14.28%",
                                                height: "14.28%"
                                            }}
                                        >{day.value}</td>;
                                    }) }
                                </tr>;
                            }) }
                        </tbody>
                    </table>
                </div>
            </div>;
        }
    }
});