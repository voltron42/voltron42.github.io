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
    var LG1 = function() {
      ti85.ClLCD();
      if (state.SV1 == " " && state.SV2 == " " && state.SV3 == " ") {
        ti85.Disp("No games to load.");
        ti85.Pause();
        CAS1();
      } else {
        ti85.Outpt(1, 7, "LOADGAME");
        ti85.Outpt(4, 1, state.SV1);
        ti85.Outpt(5, 1, state.SV2);
        ti85.Outpt(6, 1, state.SV3);
        ti85.Menu(1, state.SV1, G1,2, state.SV2, G2, 3, state.SV3, G3);
      }
    }
    var G1 = function() {
      state.copyFields({
        KN1:"SK1",
        D:"SD1",
        L:"SL1",
        HP:"SH1",
        MAGIK:"SM1",
        SPEED:"SS1",
        AP:"SA1"
      });
      CAS2();
    }
    var G2 = function() {
      state.copyFields({
        KN1:"SK2",
        D:"SD2",
        L:"SL2",
        HP:"SH2",
        MAGIK:"SM2",
        SPEED:"SS2",
        AP:"SA2"
      });
      CAS2();
    }
    var G3 = function() {
      state.copyFields({
        KN1:"SK3",
        D:"SD3",
        L:"SL3",
        HP:"SH3",
        MAGIK:"SM3",
        SPEED:"SS3",
        AP:"SA3"
      });
      CAS2();
    }
    var CAS1 = function() {
      ti85.ClDrw();
      state.merge({
        D:1,
        RM:29
      });
      ti85.ClDrw();
      ti85.RcPic("KNIGHT1");
      ti85.Menu(1, "Arthur", CA, 2, "Merlin", CM, 3, "Gawain", CG, 4, "Lancelot", CL);
    }
    var CA = function() {
      state.merge({
        KN1: "King Arthur",
        MAGIK: 40,
        HP: 145,
        SPEED: 20,
        AP: 14
      });
      CAS2();
    }
    var CM = function() {
      state.merge({
        KN1: "Merlin",
        MAGIK: 250,
        HP: 140,
        SPEED: 20,
        AP: 8
      });
      CAS2();
    }
    var CG = function() {
      state.merge({
        KN1: "Gawain",
        MAGIK: 10,
        HP: 180,
        SPEED: 15,
        AP: 10
      });
      CAS2();
    }
    var CL = function() {
      state.merge({
        KN1: "Lancelot",
        MAGIK: 10,
        HP: 150,
        SPEED: 15,
        AP: 12
      });
      CAS2();
    }
    var CAS2 = function() {
      ti85.ClLCD();
      ti85.ClDrw();
      ti85.Line(-10, 10, 10, 10);
      ti85.Line(10, 10, 10, -10);
      ti85.Line(10, -10, -10, -10);
      ti85.Line(-10, -10, -10, 10);
      ti85.Line(-10, 10, -6, 6);
      ti85.Line(-6, 6, 6, 6);
      ti85.Line(10, 10, 6, 6);
      ti85.Line(6, 6, 6, -6);
      ti85.Line(10, -10, 6, -6);
      ti85.Line(6, -6, -6, -6);
      ti85.Line(-10, -10, -6, -6);
      ti85.Line(-6, -6, -6, 6);
      ti85.Line(-6, 6, -3, 3);
      ti85.Line(-6, 3, 6, 3);
      ti85.Line(6, 6, 3, 3);
      ti85.Line(3, 3, 3, -3);
      ti85.Line(6, -6, 3, -3);
      ti85.Line(6, -3, -6, -3);
      ti85.Line(-3, -3, -3, 3);
      ti85.Line(-3, 3, -1, 1);
      ti85.Line(-1, 1, 1, 1);
      ti85.Line(3, 3, 1, 1);
      ti85.Line(1, 1, 1, -1);
      ti85.Line(3, -3, 1, -1);
      ti85.Line(1, -1, -1, -1);
      ti85.Line(-3, -3, -1, -1);
      ti85.Line(-1, -1, -1, 1);
      ti85.Line(-1, -1, 1, 1);
      ti85.Line(-1, 1, 1, -1);
      ti85.Line(1, 0, -1, 0);
      if (state.D < Math.floor(1 + ((4 - state.L) * state.DMAX / 4))) {
        state.RM = 29;
      }
      if (state.D >= Math.floor(1 + ((4 - state.L) * state.DMAX / 4))) {
        state.RM = 39;
      }
      if (state.D < state.DMAX) {
        state.RM = 49;
      }
      state.M = 1;
      state.I = 1;
      ti85.Menu(1, "Go", PRO1, 2, "Stat", STATS, 3, "Spells", SPELL, 4, "Inventory", INVENT, 5, "Quit", END2);
    }
    var PRO1 = function() {
      state.merge({
        ML: 0,
        D1:"&LT;",
        D2:"^",
        D3:"&GT;",
        D4: Math.floor(1 + 4 * Math.random());
      })
    };
    var STATS = function() {};
    var SPELL = function() {};
    var INVENT = function() {};
    var END2 = function() {};
    var END5 = function() {};
    init();
  }
})()
