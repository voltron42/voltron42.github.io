(function(){
	
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	
	AutoCal = function(args){
		
		this.init = function(){
			document.getElementById(args.yearFieldId).value = (new Date()).getFullYear();
			let monthMenu = document.getElementById(args.monthFieldId);
			months.forEach((m,i)=>{
				let month = document.createElement("Option");
				month.text = m;
				month.value = i;
				monthMenu.add(month);
			});
		}
		
		this.buildCalendar = function(){
			let year = parseInt(document.getElementById(args.yearFieldId).value);
			let month = parseInt(document.getElementById(args.monthFieldId).value);
			if (!isNaN(month)) {
				let monthName = months[month];
				let firstWeekdayOfMonth = new Date(year,month,1).getDay();
				if (firstWeekdayOfMonth == 0) firstWeekdayOfMonth = 7;
				let lastOfMonth = new Date(year,month+1,0);
				let nextMonthDayCount = 6 - lastOfMonth.getDay();
				if (nextMonthDayCount == 0) nextMonthDayCount = 7;
				let allDays = [].concat(Array.from(Array(firstWeekdayOfMonth).keys()).map((c) => c + new Date(year,month,1-firstWeekdayOfMonth).getDate()),
										Array.from(Array(lastOfMonth.getDate()).keys()).map((c) => c + 1),
										Array.from(Array(nextMonthDayCount).keys()).map((c) => c + 1));
				let rows = Array.from(Array(6).keys()).reduce((out,i) => {
					let start = i * 7;
					let end = (i + 1) * 7;
					out.push(allDays.slice(start,end).map((d) => "<td>" + d + "</td>").join(""));
					return out;
				},[]);
				let header = weekdays.map((w) => "<th>" + w + "</th>").join("");
				let tableContent = [header].concat(rows).map((r) => "<tr>" + r + "</tr>").join("");
				let output = "<h2>" + monthName + " " + year + "</h2><table>" + tableContent + "</table>";
				document.getElementById(args.outputId).innerHTML = output;
			} else {
				alert("select an actual month")
			}
		}
		
	}
	
})()