(function() {
  var data = {
    savegames: {
      SV1: {
        KN1:"SK1",
        D:"SD1",
        L:"SL1",
        HP:"SH1",
        MAGIK:"SM1",
        SPEED:"SS1",
        AP:"SA1"
      },
      SV2: {
        KN1:"SK2",
        D:"SD2",
        L:"SL2",
        HP:"SH2",
        MAGIK:"SM2",
        SPEED:"SS2",
        AP:"SA2"
      },
      SV3: {
        KN1:"SK3",
        D:"SD3",
        L:"SL3",
        HP:"SH3",
        MAGIK:"SM3",
        SPEED:"SS3",
        AP:"SA3"
      }
    },
    newgames: {
      "Arthur": {
        KN1: "King Arthur",
        MAGIK: 40,
        HP: 145,
        SPEED: 20,
        AP: 14
      },
      "Merlin": {
        KN1: "Merlin",
        MAGIK: 250,
        HP: 140,
        SPEED: 20,
        AP: 8
      },
      "Gawain": {
        KN1: "Gawain",
        MAGIK: 10,
        HP: 180,
        SPEED: 15,
        AP: 10
      },
      "Lancelot": {
        KN1: "Lancelot",
        MAGIK: 10,
        HP: 150,
        SPEED: 15,
        AP: 12
      }
    },
    monsters: {
      BLOB: {
        MONSTER: "Blob",
        MHP: 5,
        MMP: 0,
        MSP: 2,
        MAP: 3
      },
      GHOST: {
        MONSTER: "Ghost",
        MHP: 20,
        MMP: 10,
        MSP: 10,
        MAP: 15
      },
      GOBLIN: {
        MONSTER: "Goblin",
        MHP: 15,
        MMP: 0,
        MSP: 15,
        MAP: 10
      },
      ORC: {
        MONSTER: "Orc",
        MHP: 30,
        MMP: 20,
        MSP: 5,
        MAP: 10
      },
      SHA: {
        MONSTER: "Black Knight",
        MHP: 45,
        MMP: 20,
        MSP: 10,
        MAP: 30
      },
      SKU: {
        MONSTER: "Demon's head",
        MHP: 80,
        MMP: 25,
        MSP: 30,
        MAP: 50
      },
      SOR: {
        MONSTER: "Sorcerer",
        MHP: 100,
        MMP: 200,
        MSP: 25,
        MAP: 35
      },
      DRAG: {
        MONSTER: "Dragon",
        MHP: 90,
        MMP: 100,
        MSP: 35,
        MAP: 30
      }
    }
  }
  window.Game = function(ti85) {
    console.log("creating game.")
    var state = new Object();
    var init = function(){
      console.log("initializing game.")
      state.merge({
          IT1: " ",
          IT2: " ",
          IT3: " ",
          IT4: " ",
          DMAX: 40,
          L: 1
        });
      ti85.dimCanvas(-90,90,-90,90);
      ti85.AxesOff();
      ti85.ClDrw();
      ti85.RcPic("TITLE");
      ti85.Pause();
      console.log("Game initialized.");
      ti85.Menu(1, "New", CAS1, 3, "Load", LG1, 5, "Quit", END5)
    };
    var LG1 = function() {
      ti85.ClLCD();
      if (state.SV1 == " " && state.SV2 == " " && state.SV3 == " ") {
        ti85.Disp("No games to load.");
        ti85.Pause();
        CAS1();
      } else {
        ti85.Disp("LOADGAME");
        ti85.Disp(state.SV1);
        ti85.Disp(state.SV2);
        ti85.Disp(state.SV3);
        ti85.Menu(
          1, state.SV1, LG2(data.savegames.SV1),
          2, state.SV2, LG2(data.savegames.SV2),
          3, state.SV3, LG2(data.savegames.SV3)
        );
      }
    }
    var LG2 = function(loadData) {
      return function() {
        state.copyFields(loadData);
        CAS2();
      }
    }
    var CAS1 = function() {
      ti85.ClDrw();
      state.merge({
        D:1,
        RM:29
      });
      ti85.ClDrw();
      ti85.RcPic("KNIGHT1");
      ti85.Menu(
        1, "Arthur",
        CNEW({
          KN1: "King Arthur",
          MAGIK: 40,
          HP: 145,
          SPEED: 20,
          AP: 14
        }),
        2, "Merlin",
        CNEW({
          KN1: "Merlin",
          MAGIK: 250,
          HP: 140,
          SPEED: 20,
          AP: 8
        }),
        3, "Gawain",
        CNEW({
          KN1: "Gawain",
          MAGIK: 10,
          HP: 180,
          SPEED: 15,
          AP: 10
        }),
        4, "Lancelot",
        CNEW({
          KN1: "Lancelot",
          MAGIK: 10,
          HP: 150,
          SPEED: 15,
          AP: 12
        }));
    }
    var CNEW = function(newData) {
      return function() {
        state.merge(newData);
        CAS2();
      }
    }
    var CAS2 = function() {
      ti85.ClLCD();
      ti85.ClDrw();
      ti85.Line(-90, 90, 90, 90);
      ti85.Line(90, 90, 90, -90);
      ti85.Line(90, -90, -90, -90);
      ti85.Line(-90, -90, -90, 90);
      ti85.Line(-90, 90, -60, 60);
      ti85.Line(-60, 60, 60, 60);
      ti85.Line(90, 90, 60, 60);
      ti85.Line(60, 60, 60, -60);
      ti85.Line(90, -90, 60, -60);
      ti85.Line(60, -60, -60, -60);
      ti85.Line(-90, -90, -60, -60);
      ti85.Line(-60, -60, -60, 60);
      ti85.Line(-60, 60, -30, 30);
      ti85.Line(-60, 30, 60, 30);
      ti85.Line(60, 60, 30, 30);
      ti85.Line(30, 30, 30, -30);
      ti85.Line(60, -60, 30, -30);
      ti85.Line(60, -30, -60, -30);
      ti85.Line(-60, -60, -30, -30);
      ti85.Line(-30, -30, -30, 30);
      ti85.Line(-30, 30, -10, 10);
      ti85.Line(-10, 10, 10, 10);
      ti85.Line(30, 30, 10, 10);
      ti85.Line(10, 10, 10, -10);
      ti85.Line(30, -30, 10, -10);
      ti85.Line(10, -10, -10, -10);
      ti85.Line(-30, -30, -10, -10);
      ti85.Line(-10, -10, -10, 10);
      ti85.Line(-10, -10, 10, 10);
      ti85.Line(-10, 10, 10, -10);
      ti85.Line(10, 0, -10, 0);
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
      ti85.Menu(
        1, "Go", PRO1,
        2, "Stat", STATS,
        3, "Spells", SPELL,
        4, "Inventory", INVENT,
        5, "Quit", END2);
    }
    var PRO1 = function() {
      state.merge({
        ML: 0,
        D1:"&LT;",
        D2:"^",
        D3:"&GT;",
        D4: Math.floor(1 + 4 * Math.random())
      });
      if (state.D4 == 1) {state.D1 = " ";}
      if (state.D4 == 2) {state.D2 = " ";}
      if (state.D4 == 3) {state.D3 = " ";}
      ti85.Menu(2, state.D1, MONAD(2), 3, state.D2, MONAD(1), 4, state.D3, MONAD(3));
    };
    var MONAD = function(offset) {
      return function() {
        state.RDM = offset + 3 * Math.floor(Math.floor(Math.random() * state.RM) / 3);
        MON4();
      }
    }
    var MON4 = function() {
      if (state.RDM <= 3) {
        MON6();
      } else if (state.RDM <= 10) {
        MONI();
      } else {
        MONM();
      }
    };
    var MONI = function() {
      if (state.RDM >= 3 && state.RDM <= 5) { state.TXT1 = "Healing herb"; }
      if (state.RDM == 6 || state.RDM == 7) { state.TXT1 = "Magic Vial"; }
      if (state.RDM == 8 || state.RDM == 9) { state.TXT1 = "Healing potion"; }
      if (state.RDM == 10) { state.TXT1 = "Magic potion"; }
      if (state.RDM <= 7) {
        state.TXT2 = "You've found a " + state.TXT1 + ".";
      } else {
        state.TXT2 = "You've found " + state.TXT1 + ".";
      }
      INVENT4();
    };
    var INVENT4 = function() {
      ti85.ClLCD();
      ti85.Disp(state.TXT2);
      ti85.Menu(1, "Take", TAK, 2, "Inventory", INVENT, 5, "Go", MON6);
    };
    var TAK = function() {
      if (state.IT1 == " ") {
        state.IT1 = state.TXT1;
      } else if (state.IT2 == " ") {
        state.IT2 = state.TXT1;
      } else if (state.IT3 == " ") {
        state.IT3 = state.TXT1;
      } else if (state.IT4 == " ") {
        state.IT4 = state.TXT1;
      } else {
        ti85.ClLCD();
        ti85.Disp("You have no room.");
      }
      MON6();
    };
    var loadMonster = function(key) {
      ti85.RcPic(key);
      state.merge(data.monsters[key]);
    }
    var MONM = function() {
      state.M = 2;
      ti85.ClLCD();
      ti85.ClDrw();
      if (state.RDM >= 11 && state.RDM <= 17) {
        loadMonster("BLOB");
      } else if (state.RDM >= 18 && state.RDM <= 23) {
        loadMonster("GHOST");
      } else if (state.RDM >= 24 && state.RDM <= 29) {
        loadMonster("GOBLIN");
      } else if (state.RDM >= 30 && state.RDM <= 34) {
        loadMonster("ORC");
      } else if (state.RDM >= 35 && state.RDM <= 39) {
        loadMonster("SHA");
      } else if (state.RDM >= 40) {
        state.ML = 1;
        if (state.L == 1) {
          loadMonster("SKU");
        } else if (state.L == 3) {
          loadMonster("SOR");
        } else if (state.L == 2) {
          loadMonster("DRAG");
        }
      }
      state.merge({
        TXT1: "You encounter a " + state.MONSTER + ".",
        ODD3: 1 + Math.floor(Math.random() * 100)
      });
      ti85.Disp(state.TXT1);
      state.MM = 1 + Math.floor(Math.random() * 15);
      if (state.MM <= 10) {
        ti85.Pause();
        MONB();
      } else {
        ti85.ClLCD();
        ti85.Disp(state.MONSTER + " catches you off guard!");
        ti85.Pause();
        MONB();
      }
    };
    var MONB = function() {
      ti85.DispG();
      ti85.Menu(
        1, "Attack", MONA,
        2, "Run", MONR,
        3, "Inventory", INVENT,
        4, "Spells", SPELL,
        5, "Stat", STATS);
    };
    var MONA = function() {
      ti85.ClLCD();
      ti85.Disp("You Attack.");
      state.ODD1 = 1 + (state.SPEED / Math.floor(state.SPEED / 10));
      MONMA();
    };
    var MONR = function() {
      console.log("running away");
      ti85.ClLCD();
      ti85.Disp("Run away, coward!");
      ti85.Pause();
      console.log("calling MON6");
      MON6();
    };
    var MONMA = function() {
      state.ODD2 = 1 + (state.MSP / Math.floor(state.MSP / 10));
      if (state.ODD3 > 65) {
        if (state.ODD1 > state.ODD2) {
          ti85.Disp("Excellent shot!");
          state.merge({
            MHP: state.MHP - (state.AP * 2),
            AP2: 2 * state.AP,
            Y: 2
          });
          ti85.Disp(state.MONSTER + "'s HP down by " + state.AP2);
          ti85.Pause();
          MONMB();
        } else {
          ti85.Disp(state.MONSTER + " dodges.");
          ti85.Pause();
          MONMB();
        }
      } else {
        state.merge({
          MHP: state.MHP - state.AP,
          AP2: state.AP,
          Y: 2
        });
        ti85.Disp(state.MONSTER + "'s HP down by " + state.AP2);
        ti85.Pause();
        MONMB();
      }
    };
    var MONMAS = function() {
      ti85.ClLCD();
      ti85.Disp("You cast " + state.SPL + ".");
      if (state.SLP == 2) {
        ti85.Disp(state.MONSTER + "'s HP down by " + state.AP2);
      }
      ti85.Pause();
      MONMB();
    };
    var MONMB = function() {
      if (state.MHP <= 0) {
        MON5();
      } else {
        if (state.MMP <= 5) {
          state.MRA = 1 + Math.floor(15 * Math.random());
        } else {
          state.MRA = 1 + Math.floor(20 * Math.random());
        }
        if (state.MRA <= 15) {
          MONMBA();
        } else {
          MONMBS();
        }
      }
    };
    var MONMBA = function() {
      ti85.ClLCD();
      ti85.Disp(state.MONSTER + " attacks!");
      if (state.ODD3 < 25) {
        if (state.ODD2 > (state.ODD1 * 2 / 3)) {
          ti85.Disp("You're in trouble.")
          state.merge({
            HP: state.HP - (state.MAP * 2),
            MAP2: 2 * state.MAP,
            Y: 2
          });
          ti85.Disp("Your HP is down by " + state.MAP2 + ".");
        } else {
          ti85.Disp("You dodge.");
        }
      } else {
        state.merge({
          HP: state.HP - state.MAP,
          MAP2: state.MAP,
          Y: 2
        });
        ti85.Disp("Your HP is down by " + state.MAP2 + ".");
      }
      ti85.Pause();
      MONE();
    };
    var MONMBS = function() {
      ti85.ClLCD();
      if (state.MMP >= 20) {
        state.MS = 1 + Math.floor(40 * Math.random());
      } else {
        state.MS = 1 + Math.floor(15 * Math.random());
      }
      if (state.MS <= 5) {
        state.merge({
          MLP: "Heal",
          MHP: state.MHP + 5,
          MMP: state.MMP - 5
        })
      } else if (state.MS > 5 && state.MS <= 15) {
        state.merge({
          MLP: "Hurt",
          HP: state.HP - 5,
          MMP: state.MMP - 5
        })
      } else if (state.MS > 15 && state.MS <= 30) {
        state.merge({
          MLP: "Hurtmore",
          HP: state.HP - 20,
          MMP: state.MMP - 20
        })
      } else {
        state.merge({
          MLP: "Healmore",
          MHP: state.MHP + 20,
          MMP: state.MMP - 20
        })
      }
      ti85.Disp(state.MONSTER + " casts " + state.MLP);
      if (state.MS > 5 && state.MS <= 30) {
        ti85.Disp("Your HP is down by " + state.AP2 + ".");
      }
      ti85.Pause();
      MONE();
    };
    var MONE = function() {
      if (state.HP <= 0) {
        END4();
      } else {
        MONB();
      }
    };
    var MON5 = function() {
      ti85.ClLCD();
      ti85.Disp(state.MONSTER + " is dead.");
      ti85.Pause();
      state.merge({
        HP: state.HP + 1 + Math.floor(state.MAP / 3),
        MAGIK: state.MAGIK + 1 + Math.floor(state.MSP / 3)
      })
      MON6();
    };
    var MON6 = function() {
      console.log("next room");
      state.D++;
      if (state.ML == 1 && state.MHP <= 0) {
        END1();
      } else {
        CAS2();
      }
    };
    var STATS = function() {
      ti85.ClLCD();
      ti85.Disp(state.KN1);
      ti85.Disp("Hit points: " + state.HP);
      ti85.Disp("Magic: " + state.MAGIK);
      ti85.Disp("Speed: " + state.SPEED);
      ti85.Disp("Attack points: " + state.AP);
      ti85.Pause();
      console.log("M: " + state.M);
      if (state.M == 1) {
        CAS2();
      } else if (state.M == 2) {
        MONB();
      } else {
        SPELL();
      }
    };
    var SPELL = function() {
      ti85.ClLCD();
      state.SLL = 0;
      ti85.Disp("Magic: ");
      ti85.Disp(state.MAGIK);
      MA1();
    };
    var MA1 = function() {
      ti85.Disp("Heal: " + 5);
      ti85.Disp("Healmore: " + 5);
      ti85.Disp("Hurt: " + 20);
      ti85.Disp("Hurtmore: " + 20);
      ti85.Disp("Heal: " + 15);
      ti85.Menu(1, "Cast", MA1M, 5, "Exit", MA5);
    };
    var MA1M = function() {
      state.SLL = 1;
      ti85.Menu(
        1, "Heal", heal("Heal", 5),
        2, "Healmore", heal("Healmore", 20),
        3, "Hurt", hurt("Hurt", 5),
        4, "Hurtmore", hurt("Hurtmore", 20),
        5, "Teleport", TL);
    };
    var heal = function(label,mark) {
      return function() {
        state.SPL = label;
        state.SLP = 1;
        if (state.MAGIK < mark) {
          ti85.ClLCD();
          ti85.Disp("Not enough magic.");
          ti85.Pause();
        } else {
          state.HP = state.HP + mark;
          state.MAGIK = state.MAGIC - mark;
        }
        MA5();
      }
    }
    var hurt = function(label, mark) {
      return function() {
        state.SPL = label;
        state.SLP = 1;
        if (state.M == 2) {
          if (state.MAGIK < mark) {
            ti85.ClLCD();
            ti85.Disp("Not enough magic.");
            ti85.Pause();
            MONB();
          } else {
            state.merge({
              SLP: 2,
              AP2: mark,
              MHP: state.MHP - mark,
              MAGIK: state.MAGIK - mark
            })
            MA5();
          }
        } else {
          ti85.ClLCD();
          ti85.Disp("Nothing to hurt.");
          ti85.Pause();
          MA5();
        }
      }
    }
    var TL = function() {
      state.merge({
        SPL: "Teleport",
        SLP: 1
      })
      if (state.MAGIK < 15) {
        ti85.ClLCD();
        ti85.Disp("Not enough magic.");
        ti85.Pause();
      } else {
        state.merge({
          D: 1 + Math.floor(state.DMAX * Math.random()),
          MAGIK: state.MAGIK - 15
        })
      }
      CAS2();
    }
    var MA5 = function() {
      if (state.M == 1) {
        CAS2();
      } else if (state.SLL == 0) {
        MONB();
      } else {
        MONMAS();
      }
    }
    var INVENT = function() {
      ti85.ClLCD();
      ti85.Disp(state.KN1);
      ti85.Disp("");
      for (var it = 1; it <= 4; it++) {
        var label = "IT" + it;
        if (state[label] != " ") {
          ti85.Disp(state[label]);
        }
      }
      ti85.Menu(1, "Use", INVENT2, 5, "Return", INVENT3, 2, "Drop", DROP)
    };
    var DROP4 = function() {
      state.IT4 = " ";
      INVENT();
    };
    var DROP3 = function() {
      state.IT3 = state.IT4;
      DROP4();
    };
    var DROP2 = function() {
      state.IT2 = state.IT3;
      DROP3();
    };
    var DROP1 = function() {
      state.IT1 = state.IT2;
      DROP2();
    };
    var DROP = function() {
      ti85.Menu(
        1, state.IT1, DROP1,
        2, state.IT2, DROP2,
        3, state.IT3, DROP3,
        4, state.IT4, DROP4,
        5, "Exit", INVENT);
    };
    var ITB = function(field,func) {
      return function() {
        if (state[field] == "Magic vial") {state.MAGIK += 5;}
        if (state[field] == "Magic potion") {state.MAGIK += 20;}
        if (state[field] == "Healing herb") {state.HP += 5;}
        if (state[field] == "Healing potion") {state.HP += 20;}
        func();
      }
    }
    var INVENT2 = function() {
      ti85.Menu(
        1, state.IT1, ITB("IT1", DROP1),
        2, state.IT2, ITB("IT2", DROP2),
        3, state.IT3, ITB("IT3", DROP3),
        4, state.IT4, ITB("IT4", DROP4),
        5, "Exit", INVENT);
    };
    var INVENT3 = function() {
      if (state.I == 1 && state.M == 1) {
        CAS2();
      } else if (state.I == 2) {
        INVENT4();
      } else if (state.M == 2) {
        MONB();
      }
    };
    var END1 = function() {
      ti85.ClLCD();
      if (state.L == 3) {
        END3();
      } else {
        ti85.Disp("Wow! You defeated Level " + state.L + "!");
        state.L++;
        ti85.Disp("Now, onto Level " + state.L + ".");
        ti85.Pause();
        CAS1();
      }
    };
    var END2 = function() {
      ti85.ClLCD();
      ti85.Disp("SAVEGAME?");
      ti85.Menu(1, "Yes", SG1A, 2, "No", END5);
    };
    var dispSaveGame = function(id, label, defaultLabel) {
      state[label] = (state[id] == " ")?defaultLabel:state[id];
      ti85.Disp(state[label]);
    }
    var SG1A = function() {
      ti85.ClLCD();
      ti85.Disp("SAVEGAME");
      dispSaveGame("SV1","SV1A","Game1");
      dispSaveGame("SV2","SV2A","Game2");
      dispSaveGame("SV3","SV3A","Game3");
      ti85.Menu(
        1, state.SV1A, SG1B("SV1", {
          SD1: "D",
          SL1: "L",
          SH1: "HP",
          SS1: "SPEED",
          SM1: "MAGIK",
          SA1: "AP",
          SK1: "KN1"
        }),
        2, state.SV2A, SG1B("SV2", {
          SD2: "D",
          SL2: "L",
          SH2: "HP",
          SS2: "SPEED",
          SM2: "MAGIK",
          SA2: "AP",
          SK2: "KN1"
        }),
        3, state.SV3A, SG1B("SV3", {
          SD3: "D",
          SL3: "L",
          SH3: "HP",
          SS3: "SPEED",
          SM3: "MAGIK",
          SA3: "AP",
          SK3: "KN1"
        }));
    };
    var SG1B = function(savegame, savedata) {
      return function() {
        state.merge(ti85.InpST("Enter Filename", savegame));
        state.copyFields(savedata);
        END5();
      }
    }
    var END3 = function() {
      ti85.ClLCD();
      ti85.Disp(" ");
      ti85.Disp(" ");
      state.YDON = "...And the streets will flow with the blood of the non-believers!";
      ti85.Disp(state.YDON);
      END5();
    };
    var END4 = function() {
      ti85.ClLCD();
      ti85.Disp("You are dead.")
      END5();
    };
    var END5 = function() {
      ti85.Pause();
      ti85.ClDrw();
      ti85.ZStd();
      ti85.AxesOn();
      ti85.ClLCD();
      ti85.Disp("GAME OVER");
    };
    console.log("game created.");
    init();
  }
})()
