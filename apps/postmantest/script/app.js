(function(){
    window[registryName].apply('PostmanApp',['ColorConstants'],function(ColorConstants){
      var median = function(values) {
        var sortable = Array.from(values);
        sortable.sort();
        return sortable[Math.floor(sortable.length / 2)];
      }
      var average = function(values) {
        return values.reduce((a,b) => a + parseInt(b), 0) / values.length;
      }
      var percentile = function(p, arr) {
        if (arr.length === 0) return 0;
        if (typeof p !== 'number') throw new TypeError('p must be a number');
        if (p <= 0) return arr[0];
        if (p >= 1) return arr[arr.length - 1];

        var index = arr.length * p,
            lower = Math.floor(index),
            upper = lower + 1,
            weight = index % 1;

        if (upper >= arr.length) return arr[lower];
        return arr[lower] * (1 - weight) + arr[upper] * weight;
      }
      var initColors = [
        'lightgrey',
        'blue',
        'green',
        'red',
        'darkgrey',
        'purple',
        'yellow',
        'orange',
        'pink',
        'tan',
        'brown'
      ].map(ColorConstants.get);
      var genInitColor = function(index) {
        return initColors[index];
      }
      var makeColorCtrl = function(label,index,initColor) {
        initColor = initColor || genInitColor(index);
        return '<li><input type="color" id="color' + index + '" value="' + initColor + '"> ' + label + ' Color:</input></li>';
      }
      var allSummaryKeys = {
        max: ["min","avg","median","max"],
        per99: ["min","avg99","median","per99"],
        per95: ["min","avg95","median","per95"]
      }
      var summaryFileNames = {
        max: "summary.csv",
        per99: "summary99.csv",
        per95: "summary95.csv"
      }
      
      var buildTable = function(data) {
        return '<table class="table">' +
        data.slice(0,1).map((r) => "<tr>" + r.map((c) => "<th>" + c + "</th>").join("") + "</tr>").join("") + 
        data.slice(1).map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") + 
        "</table>"
      }
      
      var buildVertBarChart = function(data) {
        var rowCount = data.length - 1;
        var maxHeight = Math.max.apply(null, data.slice(1).map((r) => r[r.length-1]));
        var labels = data.slice(1).map((r) => r[0]);
        return '<svg width="100%" height="100%" viewBox="0 0 8000 5000">' + 
          '<rect width="8000" height="5000" stroke-width="5" stroke="black" fill="white">' +
          '<text x="4000" y="10" text-anchor="middle" alignment-baseline="hanging">Summary</text>'
        "</svg>";
      }
      
      var buildLineChart = function(data) {
        return '<svg width="100%" height="100%" viewBox="0 0 8000 5000">' + 
          '<rect width="8000" height="5000" stroke-width="5" stroke="black" fill="white">' +
        "</svg>";
      }
      
      return function(inId,canvasId,downloadsId,summaryDisplayId,displayId,percentileRadioName,colorCtrlId) {

        var input = document.getElementById(inId);
        var buildspace = document.getElementById(canvasId);
        var downloads = document.getElementById(downloadsId);
        var summaryDisplay = document.getElementById(summaryDisplayId);
        var display = document.getElementById(displayId);
        var percentileRadio = Array.from(document.getElementsByName(percentileRadioName));
        var colorCtrl = document.getElementById(colorCtrlId);

        this.publishTestData = function() {
          var useForSummary = percentileRadio.filter((i) => i.checked).map((i) => i.value)[0];
          loadFile(input,function(dataByFileName){
            var data = Object.values(dataByFileName)
              .map(JSON.parse)
              .reduce(function(out, run) {
                run.results.forEach(function(result){
                  out[result.name] = (out[result.name] || []).concat(result.times);
                });
                return out;
              }, {});
            var data = Object.entries(data).reduce(function(out, entry) {
              var name = entry[0];
              var times = entry[1].map((time) => parseInt(time.toString()));
              var percentile99 = percentile(0.99, times);
              var percentile95 = percentile(0.95, times);
              out[name] = {
                times:times,
                count:times.length,
                min:Math.min.apply(null, times),
                max:Math.max.apply(null, times),
                per99:percentile99,
                per95:percentile95,
                avg:average(times),
                avg95:average(times.filter((a) => (a <= percentile95))),
                avg99:average(times.filter((a) => (a <= percentile99))),
                median:median(times)
              };
              return out;
            }, {})
            var rowCount = Object.values(data).map((v) => v.count).reduce((a,b) => Math.max(a,b),0);
            var maxmax = Object.values(data).map((v) => v.max).reduce((a,b) => Math.max(a,b),0);
            var per99max = Object.values(data).map((v) => v.per99).reduce((a,b) => Math.max(a,b),0);
            var per95max = Object.values(data).map((v) => v.per95).reduce((a,b) => Math.max(a,b),0);
            var headers = Object.keys(data);
            headers.sort();
            var testRuns = Number.range(rowCount).reduce(function(out,i) {
              out.push(headers.reduce(function(row,header) {
                row.push(data[header].times[i] || "");
                return row;
              }, [i+1]));
              return out;
            }, [["Run"].concat(headers)]);
            var summaryHeaders = ["Request","Minimum","Average","Median","Maximum"];
            var summaryKeys = allSummaryKeys[useForSummary];
            var summary = headers.reduce(function(out,header) {
              var entry = data[header];
              out.push(summaryKeys.reduce(function(row,key) {
                row.push(entry[key]);
                return row;
              }, [header]));
              return out;
            }, [summaryHeaders]);
            downloads.innerHTML = "<ul><li>" + 
            makeDownloadLink("Download Test Runs","testRuns.csv","text/json","charset=utf-8",
            testRuns.map((s) => s.join(",")).join("\n")).outerHTML +
            "</li><li>" +
            makeDownloadLink("Download Summary",summaryFileNames[useForSummary],"text/json","charset=utf-8",
            summary.map((s) => s.join(",")).join("\n")).outerHTML +
            "</li></ul>";
            
            colorCtrl.innerHTML = "<ul>" + headers.map((h,i) => makeColorCtrl(h,i)).join("") + "</ul>";
            
            summaryDisplay.innerHTML = 
            buildVertBarChart(summary) +
            buildTable(summary);
            
            display.innerHTML = 
            buildLineChart(testRuns) + 
            buildTable(testRuns);
          });
        }
      }
    });
})()