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
      var percentile = function(p, list) {
        var arr = Array.from(list).map((a) => a);
        arr.sort();
        if (arr.length === 0) return 0;
        if (typeof p !== 'number') throw new TypeError('p must be a number');
        if (p <= 0) return arr[0];
        if (p >= 1) return arr[arr.length - 1];

        var index = arr.length * p,
            lower = Math.floor(index);

        return arr[lower];
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
      
      var calcIntervals = function(max) {
        var top = max * 2;
        var digits = top.toString().length - 1;
        var shift = Math.pow(10,digits);
        var maxInterval = Math.ceil(top / shift) * shift / 2;
        var steps = [];
        for (var init = [5,10,20]; steps.length <= 1 && init.filter(function(n) {return (n <= maxInterval)}).length >= 1; init = init.map((n) => n * 10)) {
          steps = steps.concat(init.map(function(n) { return {step:maxInterval,n:n,i:maxInterval / n};}).filter((e) => (e.i > 3 && e.i < 20 && e.i == Math.round(e.i))));
        }
        steps.sort((a,b) => a.i - b.i);
        var interval = steps[0].n;
        var out = [];
        for(var x = 0; x<=maxInterval; x += interval) {
          out.push(x);
        }
        return out;
      }
      
      var buildVertBarChart = function(data, barcolors) {
        var rowCount = data.length - 1;
        console.log("rowCount");
        console.log(rowCount);
        var maxHeight = Math.ceil(Math.max.apply(null, data.slice(1).map((r) => r[r.length-1])));
        console.log("maxHeight");
        console.log(maxHeight);
        var intervals = calcIntervals(maxHeight).reverse();
        var maxInterval = intervals[0];
        var lineInterval = 400 / (intervals.length - 1);
        var lines = intervals.map(function(x,i) {return {x:x,i:Math.round(i*lineInterval)+35};});
                
        var labels = data.slice(1).map((r) => r[0]);
        var blockWidth = 700 / labels.length;
        var offset = blockWidth / 2;
        var outer = 8;
        var inner = 5;
        var barwidth = (blockWidth - outer * 2 - inner * 3) / 4;
        var bars = "?".repeat(labels.length).split("").map(function(z,row){
          var c = String.fromCharCode(65 + row);
          var xStart = blockWidth * row;
          var off = Math.round(offset + xStart) + 80;
          var datarow = data[row + 1];
          return ["min","avg","med","max"].reduce(function(out,label,index) {
            var value = datarow[index + 1];
            var height = Math.round(value * 400 / maxInterval);
            var y = 400 - height + 35;
            var x = index * (inner + barwidth) + xStart + outer + 80;
            return out + '<rect x="' + x + '" y="' + y + '" width="' + barwidth + '" height="' + height + '" fill="' + barcolors[label + "Color"] + '" stroke="black"/>';
          }, '<text x="' + off + '" y="440" class="row-header" text-anchor="middle" alignment-baseline="hanging">' + c + '</text>')
        });
        
        return '<svg width="100%" height="100%" viewBox="0 0 800 500">' + 
          '<rect width="800" height="500" fill="white" stroke="black" stroke-width="1"/>' +
          '<text x="400" y="10" text-anchor="middle" alignment-baseline="hanging" class="title">Summary</text>' +
          '<text x="400" y="470" text-anchor="middle" alignment-baseline="baseline" class="axis-title">Summary By Request</text>' +
          '<text x="15" y="230" text-anchor="center" alignment-baseline="middle" class="axis-title" transform="rotate(-90,15,230)">Run Time (Millis)</text>' +
          '<rect x="291" y="483" width="6" height="6" fill="' + barcolors["minColor"] + '" stroke="none"/>' +
          '<text x="300" y="490" text-anchor="start" alignment-baseline="baseline" class="legend">Minimum</text>' +
          '<rect x="351" y="483" width="6" height="6" fill="' + barcolors["avgColor"] + '" stroke="none"/>' +
          '<text x="360" y="490" text-anchor="start" alignment-baseline="baseline" class="legend">Average</text>' +
          '<rect x="401" y="483" width="6" height="6" fill="' + barcolors["medColor"] + '" stroke="none"/>' +
          '<text x="410" y="490" text-anchor="start" alignment-baseline="baseline" class="legend">Median</text>' +
          '<rect x="451" y="483" width="6" height="6" fill="' + barcolors["maxColor"] + '" stroke="none"/>' +
          '<text x="460" y="490" text-anchor="start" alignment-baseline="baseline" class="legend">Maximum</text>' +
          lines.map((n) => '<line x1="80" y1="' + n.i + '" x2="780" y2="' + n.i + '" stroke="black" stroke-width="1"/><text x="75" y="' + n.i + '" text-anchor="end" alignment-baseline="middle" class="legend">' + n.x + '</text>').join("") + 
          bars +
        "</svg>" + 
        '<ul style="list-style-type: upper-alpha">' +
          labels.map((l) => "<li>" + l + "</li>").join("") + 
        "</ul>";
      }
      
      var buildLineChart = function(data) {
        return "";
      }
      
      return function(inId,canvasId,downloadsId,summaryDisplayId,displayId,percentileRadioName,colorCtrlClass) {

        var input = document.getElementById(inId);
        var buildspace = document.getElementById(canvasId);
        var downloads = document.getElementById(downloadsId);
        var summaryDisplay = document.getElementById(summaryDisplayId);
        var display = document.getElementById(displayId);
        var percentileRadio = Array.from(document.getElementsByName(percentileRadioName));
        var summaryColorCtrls = Array.from(document.getElementsByClassName(colorCtrlClass));

        this.publishTestData = function() {
          var useForSummary = percentileRadio.filter((i) => i.checked).map((i) => i.value)[0];
          var summaryColors = summaryColorCtrls.reduce(function(out, ctrl) {
            out[ctrl.id] = ctrl.value;
            return out;
          }, {});
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
            
            //colorCtrl.innerHTML = "<ul>" + headers.map((h,i) => makeColorCtrl(h,i)).join("") + "</ul>";
            
            summaryDisplay.innerHTML = 
            buildVertBarChart(summary,summaryColors) +
            buildTable(summary);
            
            display.innerHTML = 
            buildLineChart(testRuns) + 
            buildTable(testRuns);
          });
        }
      }
    });
})()