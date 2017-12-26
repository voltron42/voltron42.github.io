(function() {
  window.TI85 = function(drawId,lcdId,menuId) {
    var print = function(message) {
      var output = document.getElementById(lcdId);
      output.innerHTML = output.innerHTML + "<p>" + message + "</p>";
      output.scrollTop = output.scrollHeight;
    }
    this.AxesOff = function() {};
    this.AxesOn = function() {};
    var canvasDim = new Object();
    this.dimCanvas = function(xMin, xMax, yMin, yMax) {
      canvasDim.merge({
        xMin:xMin,
        xMax:xMax,
        yMin:yMin,
        yMax:yMax
      });
      document.getElementById(drawId).setAttribute("viewBox",[xMin, yMin, xMax - xMin, yMax - yMin].join(" "));
    };
    this.ClDrw = function() {
      document.getElementById(drawId).innerHTML = "";
    };
    this.ClLCD = function() {
      document.getElementById(lcdId).innerHTML = "";
    };
    this.RcPic = function(picName) {};
    this.Pause = function() {
      alert("paused");
    };
    var wrapFn = function(fn) {
      return function() {
        delete window.menu;
        document.getElementById(menuId).innerHTML = "";
        fn();
      }
    };
    var menufy = function(dest) {
      return function(index) {
        dest[index]();
      }
    }
    this.Menu = function() {
      console.log("creating menu");
      var opts = {};
      var dest = {};
      for (var i = 0; i < arguments.length; i += 3) {
        var opt = arguments[i + 1];
        if (opt != " ") {
          var index = arguments[i];
          opts[index] = opt;
          dest[index] = wrapFn(arguments[i + 2]);
        }
      }
      var menu = "";
      Object.keys(opts).forEach(function(key) {
        menu += '<button onClick="menu(' + key + ')">' + opts[key] + '</button>';
      });
      window.menu = menufy(dest);
      document.getElementById(menuId).innerHTML = menu;
      console.log("menu creating");
    };
    this.Disp = function(message) {
      print(message);
    };
    this.DispG = function() {
    };
    this.Outpt = function(row, column, message) {
      print(message);
    };
    this.Line = function(x1, y1, x2, y2) {
      var output = document.getElementById(drawId);
      output.innerHTML = output.innerHTML + '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" fill="none" stroke="black" stroke-width="1"/>';
    };
    this.ZStd = function() {};
    this.InpST = function(message, varname) {
      var out = {};
      out[varname] = prompt(message);
      return out;
    }
  };
})()
