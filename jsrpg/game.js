(function() {
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
      ti85.dimCanvas(-10,10,-12,10);
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
      ti85.Menu(2, state.D1, MON1, 3, state.D2, MON2, 4, state.D3, MON3);
    };
    var MON1 = function() {
      state.RDM = 2 + 3 * Math.floor(Math.floor(Math.random() * state.RM) / 3);
      MON4();
    }
    var MON2 = function() {
      state.RDM = 1 + 3 * Math.floor(Math.floor(Math.random() * state.RM) / 3);
      MON4();
    }
    var MON3 = function() {
      state.RDM = 3 + 3 * Math.floor(Math.floor(Math.random() * state.RM) / 3);
      MON4();
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
      ti85.Outpt(1, 1, state.TXT2);
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
        ti85.Outpt(1, 1, "You have no room.");
      }
      MON6();
    };
    var MONM = function() {
      state.M = 2;
      ti85.ClLCD();
      ti85.ClDrw();
      if (state.RDM >= 11 && state.RDM <= 17) {
        ti85.RcPic("BLOB");
        state.merge({
          MONSTER: "Blob",
          MHP: 5,
          MMP: 0,
          MSP: 2,
          MAP: 3
        });
      } else if (state.RDM >= 18 && state.RDM <= 23) {
        ti85.RcPic("GHOST");
        state.merge({
          MONSTER: "Ghost",
          MHP: 20,
          MMP: 10,
          MSP: 10,
          MAP: 15
        });
      } else if (state.RDM >= 24 && state.RDM <= 29) {
        ti85.RcPic("GOBLIN");
        state.merge({
          MONSTER: "Goblin",
          MHP: 15,
          MMP: 0,
          MSP: 15,
          MAP: 10
        });
      } else if (state.RDM >= 30 && state.RDM <= 34) {
        ti85.RcPic("ORC");
        state.merge({
          MONSTER: "Orc",
          MHP: 30,
          MMP: 20,
          MSP: 5,
          MAP: 10
        });
      } else if (state.RDM >= 35 && state.RDM <= 39) {
        ti85.RcPic("SHA");
        state.merge({
          MONSTER: "Black Knight",
          MHP: 45,
          MMP: 20,
          MSP: 10,
          MAP: 30
        });
      } else if (state.RDM >= 40) {
        state.ML = 1;
        if (state.L == 1) {
          ti85.RcPic("SKU");
          state.merge({
            MONSTER: "Demon's head",
            MHP: 80,
            MMP: 25,
            MSP: 30,
            MAP: 50
          });
        } else if (state.L == 1) {
          ti85.RcPic("SOR");
          state.merge({
            MONSTER: "Sorcerer",
            MHP: 100,
            MMP: 200,
            MSP: 25,
            MAP: 35
          });
        } else if (state.L == 1) {
          ti85.RcPic("DRAG");
          state.merge({
            MONSTER: "Dragon",
            MHP: 90,
            MMP: 100,
            MSP: 35,
            MAP: 30
          });
        }
      }
      state.merge({
        TXT1: "You encounter a " + state.MONSTER + ".",
        ODD3: 1 + Math.floor(Math.random() * 100)
      });
      ti85.Outpt(2, 2, state.TXT1);
      state.MM = 1 + Math.floor(Math.random() * 15);
      if (state.MM <= 10) {
        ti85.Pause();
        MONB();
      } else {
        ti85.ClLCD();
        ti85.Outpt(1, 1, state.MONSTER + " catches you off guard!");
        ti85.Pause();
        MONB();
      }
    };
    var MONB = function() {
      ti85.DispG();
      ti85.Menu(1, "Attack", MONA, 2, "Run", MONR, 3, "Inventory", INVENT, 4, "Spells", SPELL, 5, "Stat", STATS);
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
          ti85.Outpt(state.Y, 1, state.MONSTER + "'s HP down by " + state.AP2);
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
        ti85.Outpt(state.Y, 1, state.MONSTER + "'s HP down by " + state.AP2);
        ti85.Pause();
        MONMB();
      }
    };
    var MONMAS = function() {
      ti85.ClLCD();
      ti85.Disp("You cast " + state.SPL + ".");
      if (state.SLP == 2) {
        ti85.Outpt(2, 1, state.MONSTER + "'s HP down by " + state.AP2);
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
          ti85.Outpt(state.Y, 1, "Your HP is down by " + state.MAP2 + ".");
        } else {
          ti85.Disp("You dodge.");
        }
      } else {
        state.merge({
          HP: state.HP - state.MAP,
          MAP2: state.MAP,
          Y: 2
        });
        ti85.Outpt(state.Y, 1, "Your HP is down by " + state.MAP2 + ".");
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
      ti85.Outpt(1, 1, state.MONSTER + " casts " + state.MLP);
      if (state.MS > 5 && state.MS <= 30) {
        ti85.Outpt(2, 1, "Your HP is down by " + state.AP2 + ".");
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
      ti85.Outpt(1, 1, state.KN1);
      ti85.Outpt(3, 1, "Hit points: ");
      ti85.Outpt(3, 12, state.HP);
      ti85.Outpt(4, 1, "Magic: ");
      ti85.Outpt(4, 7, state.MAGIK);
      ti85.Outpt(5, 1, "Speed: ");
      ti85.Outpt(5, 7, state.SPEED);
      ti85.Outpt(6, 1, "Attack points: ");
      ti85.Outpt(6, 15, state.AP);
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
      ti85.Outpt(1, 13, "Magic: ");
      ti85.Outpt(1, 19, state.MAGIK);
      MA1();
    };
    var MA1 = function() {
      ti85.Outpt(3, 1, "Heal");
      ti85.Outpt(3, 19, 5);
      ti85.Outpt(4, 1, "Healmore");
      ti85.Outpt(4, 19, 5);
      ti85.Outpt(5, 1, "Hurt");
      ti85.Outpt(5, 19, 20);
      ti85.Outpt(6, 1, "Hurtmore");
      ti85.Outpt(6, 19, 20);
      ti85.Outpt(7, 1, "Heal");
      ti85.Outpt(7, 19, 15);
      ti85.Menu(1, "Cast", MA1M, 5, "Exit", MA5);
    };
    var MA1M = function() {
      state.SLL = 1;
      ti85.Menu(1, "Heal", HL, 2, "Healmore", HT, 3, "Hurt", HT, 4, "Hurtmore", TM, 5, "Teleport", TL);
    };
    var HL = function() {
      state.SPL = "Heal";
      state.SLP = 1;
      if (state.MAGIK < 5) {
        ti85.ClLCD();
        ti85.Disp("Not enough magic.");
        ti85.Pause();
      } else {
        state.HP = state.HP + 5;
        state.MAGIK = state.MAGIC - 5;
      }
      MA5();
    };
    var lm = function() {
      state.SPL = "Healmore";
      state.SLP = 1;
      if (state.MAGIK < 20) {
        ti85.ClLCD();
        ti85.Disp("Not enough magic.");
        ti85.Pause();
      } else {
        state.HP = state.HP + 20;
        state.MAGIK = state.MAGIC - 20;
      }
      MA5();
    };
    var HT = function() {
      state.SPL = "Hurt";
      state.SLP = 1;
      if (state.M == 2) {
        if (state.MAGIK < 5) {
          ti85.ClLCD();
          ti85.Disp("Not enough magic.");
          ti85.Pause();
          MONB();
        } else {
          state.merge({
            SLP: 2,
            AP2: 5,
            MHP: state.MHP - state.AP2,
            MAGIK: state.MAGIK - 5
          })
          MA5();
        }
      } else {
        ti85.ClLCD();
        ti85.Disp("Not enough magic.");
        ti85.Pause();
        MA5();
      }
    };
    var TM = function() {
      state.SPL = "HurtMORE";
      state.SLP = 1;
      if (state.M == 2) {
        if (state.MAGIK < 20) {
          ti85.ClLCD();
          ti85.Disp("Not enough magic.");
          ti85.Pause();
          MONB();
        } else {
          state.merge({
            SLP: 2,
            AP2: 20,
            MHP: state.MHP - state.AP2,
            MAGIK: state.MAGIK - 20
          })
          MA5();
        }
      } else {
        ti85.ClLCD();
        ti85.Disp("Not enough magic.");
        ti85.Pause();
        MA5();
      }
    };
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
      ti85.Disp(state.IT1);
      ti85.Disp(state.IT2);
      ti85.Disp(state.IT3);
      ti85.Disp(state.IT4);
      ti85.Menu(1, "Use", INVENT2, 5, "Return", INVENT3, 2, "Drop", DROP)
    };
    var DROP = function() {
      ti85.Menu(1, state.IT1, DROP1, 2, state.IT2, DROP2, 3, state.IT3, DROP3, 4, state.IT4, DROP4, 5, "Exit", INVENT);
    };
    var DROP1 = function() {
      state.IT1 = state.IT2;
      state.IT2 = state.IT3;
      state.IT3 = state.IT4;
      state.IT4 = " ";
      INVENT();
    };
    var DROP2 = function() {
      state.IT2 = state.IT3;
      state.IT3 = state.IT4;
      state.IT4 = " ";
      INVENT();
    };
    var DROP3 = function() {
      state.IT3 = state.IT4;
      state.IT4 = " ";
      INVENT();
    };
    var DROP4 = function() {
      state.IT4 = " ";
      INVENT();
    };
    var INVENT2 = function() {
      ti85.Menu(1, state.IT1, IT1B, 2, state.IT2, IT2B, 3, state.IT3, IT3B, 4, state.IT4, IT4B, 5, "Exit", INVENT);
    };
    var IT1B = function() {
      if (state.IT1 == "Magic vial") {state.MAGIK += 5;}
      if (state.IT1 == "Magic potion") {state.MAGIK += 20;}
      if (state.IT1 == "Healing herb") {state.HP += 5;}
      if (state.IT1 == "Healing potion") {state.HP += 20;}
      DROP1();
    };
    var IT2B = function() {
      if (state.IT2 == "Magic vial") {state.MAGIK += 5;}
      if (state.IT2 == "Magic potion") {state.MAGIK += 20;}
      if (state.IT2 == "Healing herb") {state.HP += 5;}
      if (state.IT2 == "Healing potion") {state.HP += 20;}
      DROP2();
    };
    var IT3B = function() {
      if (state.IT3 == "Magic vial") {state.MAGIK += 5;}
      if (state.IT3 == "Magic potion") {state.MAGIK += 20;}
      if (state.IT3 == "Healing herb") {state.HP += 5;}
      if (state.IT3 == "Healing potion") {state.HP += 20;}
      DROP3();
    };
    var IT4B = function() {
      if (state.IT4 == "Magic vial") {state.MAGIK += 5;}
      if (state.IT4 == "Magic potion") {state.MAGIK += 20;}
      if (state.IT4 == "Healing herb") {state.HP += 5;}
      if (state.IT4 == "Healing potion") {state.HP += 20;}
      DROP4();
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
        ti85.Outpt(2, 1, "Wow! You defeated Level " + state.L + "!");
        state.L++;
        ti85.Outpt(5, 1, "Now, onto Level " + state.L + ".");
        ti85.Pause();
        CAS1();
      }
    };
    var END2 = function() {
      ti85.ClLCD();
      ti85.Disp("SAVEGAME?");
      ti85.Menu(1, "Yes", SG1A, 2, "No", END5);
    };
    var SG1A = function() {
      ti85.ClLCD();
      ti85.Outpt(1, 7, "SAVEGAME");
      if (state.SV1 == " ") {
        state.SV1A = "Game1";
      } else {
        state.SV1A = state.SV1;
      }
      if (state.SV2 == " ") {
        state.SV2A = "Game2";
      } else {
        state.SV2A = state.SV2;
      }
      if (state.SV3 == " ") {
        state.SV3A = "Game3";
      } else {
        state.SV3A = state.SV3;
      }
      ti85.Outpt(3, 1, state.SV1A);
      ti85.Outpt(4, 1, state.SV2A);
      ti85.Outpt(5, 1, state.SV3A);
      ti85.Menu(1, state.SV1A, SG1, 2, state.SV2A, SG2, 3, state.SV3A, SG3);
    };
    var SG1 = function() {
      state.merge(ti85.InpST("Enter Filename", "SV1"));
      state.copyFields({
        SD1: "D",
        SL1: "L",
        SH1: "HP",
        SS1: "SPEED",
        SM1: "MAGIK",
        SA1: "AP",
        SK1: "KN1"
      });
      END5();
    };
    var SG2 = function() {
      state.merge(ti85.InpST("Enter Filename", "SV2"));
      state.copyFields({
        SD2: "D",
        SL2: "L",
        SH2: "HP",
        SS2: "SPEED",
        SM2: "MAGIK",
        SA2: "AP",
        SK2: "KN1"
      });
      END5();
    };
    var SG2 = function() {
      state.merge(ti85.InpST("Enter Filename", "SV2"));
      state.copyFields({
        SD2: "D",
        SL2: "L",
        SH2: "HP",
        SS2: "SPEED",
        SM2: "MAGIK",
        SA2: "AP",
        SK2: "KN1"
      });
      END5();
    };
    var END3 = function() {
      ti85.ClLCD();
      ti85.Disp(" ");
      ti85.Disp(" ");
      state.YDON = "...And the streets will flow with the blood of the non-believers!";
      ti85.Outpt(1, 1, state.YDON);
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
      ti85.Outpt(4, 7, "GAME OVER");
    };
    console.log("game created.");
    init();
  }
})()
