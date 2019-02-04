(function(){
  var delay = 50;
  var charByChar = function(console,chars) {
    return function() {
      if (chars.length > 0) {
        var c = chars.shift();
        console.innerHTML += c;
        if (c == "\n") {
          console.scrollTop = console.scrollHeight;
        }
      }
      setTimeout(charByChar(console,chars),delay);
    }
  }
  var buildPrinter = function(console) {
    var chars = [];
    setTimeout(charByChar(console,chars),delay);
    return function(str) {
      if (!str) {str = "";}
      chars.push("");
      str.split("").forEach(function(c){chars.push(c);});
      chars.push("\n");
    }
  }
  var log = console.log;
  var consoleInputAction = function(console,actionHandler) {
    var codes = {"9":"\t","10":"\n","32":" "};
    var keys = {"0":true,"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"!":true,"\"":true,"#":true,"$":true,"%":true,"&":true,"'":true,"(":true,")":true,"*":true,"+":true,",":true,"-":true,".":true,"/":true,":":true,";":true,"<":true,"=":true,">":true,"?":true,"@":true,"A":true,"B":true,"C":true,"D":true,"E":true,"F":true,"G":true,"H":true,"I":true,"J":true,"K":true,"L":true,"M":true,"N":true,"O":true,"P":true,"Q":true,"R":true,"S":true,"T":true,"U":true,"V":true,"W":true,"X":true,"Y":true,"Z":true,"[":true,"\\":true,"]":true,"^":true,"_":true,"`":true,"a":true,"b":true,"c":true,"d":true,"e":true,"f":true,"g":true,"h":true,"i":true,"j":true,"k":true,"l":true,"m":true,"n":true,"o":true,"p":true,"q":true,"r":true,"s":true,"t":true,"u":true,"v":true,"w":true,"x":true,"y":true,"z":true,"{":true,"|":true,"}":true,"~":true};
    var action = "";
    return function(e) {
      var code = e.keyCode;
      var key = e.key;
      if (code == 13 && e.shiftKey) {
        code = 10;
      }
      if (codes[code]) {
        console.innerHTML += String.fromCharCode(code);
        action += String.fromCharCode(code);
      } else if (keys[key]) {
        console.innerHTML += key;
        action += key;
      } else if (code == 13) {
        console.innerHTML += String.fromCharCode(10);
        actionHandler(action);
        action = "";
      } else if (code == 8 && action.length > 0) {
        console.innerHTML = console.innerHTML.slice(0,-1);
        action = action.slice(0,-1);
      }
      console.scrollTop = console.scrollHeight;
    }
  }
  var roll = function(size,count) {
    if (!count) {count = 1;}
    "?".repeat(count)
  }
  window.Game = function(outputId,consoleId,config){
    var ui = {}
    this.init = function() {
      ui.output = document.getElementById(outputId);
      ui.mapPrint = buildPrinter(ui.output);
      ui.clearMap = function() {
        ui.output.innerHTML = "";
      }
      ui.console = document.getElementById(consoleId);
      ui.println = buildPrinter(ui.console);
      var keyPressListener = consoleInputAction(ui.console,handleAction);
      document.getElementsByTagName("body")[0].onkeydown =keyPressListener;
      ui.output.onkeydown = keyPressListener;
      ui.console.onkeydown = keyPressListener;
      draw();
      ["Your adventure starts here....",
      "Type 'START' and hit 'ENTER' to begin."
      ].forEach(ui.println);
    }
    var draw = function() {
      log("start drawing here");
    }
    var handleAction = function(action){
      log(action);
      if (action == "START") {
        var attackRoll = Math.floor(Math.random() * 20) + 1;
        log(attackRoll);
        var attackTotal = attackRoll + 8
        var attackLine = attackRoll + " + 8 = " + attackTotal;
        ["You are in combat!",
        "It is Vax's turn!",
        "What do you wish to do?",
        "1 - Move",
        "2 - Attack",
        "1",
        "You have chosen to move.",
        "Where would you like to move?",
        "H3",
        "You have chosen to move to H3.",
        "What do you wish to do?",
        "1 - Move",
        "2 - Attack",
        "2",
        "You have chosen to attack.",
        "Choose a foe to attack.",
        "a",
        "You have chosen to attack Orc A.",
        "Rolling for attack...",
        attackLine].forEach(ui.println);
        if (attackTotal > 18) {
          ["Vax hits Orc A",
          ""].forEach(ui.println);
        } else {
          ["Vax misses Orc A."].forEach(ui.println);
        }
      }
    }
  };
})();