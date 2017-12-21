(function() {
  window.Game = function(ti85) {
    var state = new Object();
    var init = function(){
      state.merge({
          IT1: " ",
          IT2: " ",
          IT3: " ",
          IT4: " ",
          DMAX: 40,
          L: 1
        });
      ti85.dimCanvas(-10,10,-12,10);
      ti85.AxesOff();
      ti85.ClDrw();
      ti85.RcPic("TITLE");
      ti85.Pause();
      ti85.Menu(1, "New", CAS1, 3, "Load", LG1, 5, "Quit", END5)
    };
    var LG1 = function() {}
    var CAS1 = function() {}
    var END5 = function() {};
    init();
  }
})()
