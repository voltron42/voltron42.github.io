(function(){
  var buildDemoActionHandler = function(config) {
    window.DemoActionHandler = function(ui) {
      var map = new RogueLikeMap(ui,config);
      this.init = function() {
        ["Your adventure starts here....",
        "Type 'START' and hit 'ENTER' to begin."
        ].forEach(ui.console.println);
      }
      this.handle = function(action) {
        console.log(action);
        if (action == "START") {
          var attackRoll = Math.floor(Math.random() * 20) + 1;
          console.log(attackRoll);
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
          attackLine].forEach(ui.console.println);
          if (attackTotal > 18) {
            ["Vax hits Orc A",
            ""].forEach(ui.console.println);
          } else {
            ["Vax misses Orc A."].forEach(ui.console.println);
          }
        }
      }
    };
  };
  window.Game = function(outputId,consoleId,config) {
    var cli = new Interface(75,outputId,consoleId,buildDemoActionHandler(config));
    this.init = function() {
      cli.init();
    }
  }
})()