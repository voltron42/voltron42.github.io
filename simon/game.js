(function(){
    let ceottk = [["D", 4], ["E", 4], ["C", 4], ["C", 3], ["G", 3]];
    let playBeeps = function(beeper,sequence,duration) {
        let args = {frequency:sequence[0],duration};
        if (sequence.length > 1) {
            args.callback = (() => {
                playBeeps(beeper,sequence.slice(1),duration);
            });
        }
        beeper.beep(args);
    };
    let config = {
        tones: { green:415, red:310, yellow:252, blue:209 },
        loserTone:{
            frequency: 42,
            duration: 1.5
        },
        inGameTimeOut:3,
        victoryTone: { // after each level is completed, use last color
            delay: 0.8,
            times: [ 0.02, 0.07, 0.07, 0.07, 0.07, 0.07 ],
            rest: 0.02
        },
        finalVictory:{ // after final level
            signalDuration: 0.1,
            order: [ "red", "yellow", "blue", "green" ],
            steps: [{
                tone: "${color}",
                count: 14,
            },{
                tone: "razz",
                count: 8
            }]
        },
        sequence: {
            maxLength: 31,
            difficulties: [
                {
                    minLength: 1,
                    maxLength: 5,
                    duration: 0.42,
                    rest: 0.05
                },
                {
                    minLength: 6,
                    maxLength: 13,
                    duration: 0.32,
                    rest: 0.05
                },
                {
                    minLength: 14,
                    maxLength: 31,
                    duration: 0.22,
                    rest: 0.05
                },
            ]
        }
    }
    window.init = function() {
        let beeper = new Beeper({type:"triangle",volume:1})
        let gameState = {
            status: "open",
            rects:{},
            links:{}
        };
        let pressColor = function(color) {
            gameState.stopBeep = beeper.startBeep({frequency:config.tones[color]});
            gameState.rects[color].classList.add("active");
        }
        let releaseColor = function(color) {
            gameState.rects[color].classList.remove("active");
            gameState.stopBeep();
        }
        let startNewGame = function() {
            console.log("start game");
            playBeeps(beeper,ceottk.map(note => HertzDonut.apply(null,note)),0.5);
        }
        let select = function(color) {
            if (gameState.status === "open") {
                pressColor(color);
            }
        }
        let deselect = function(color) {
            if (gameState.status === "open") {
                releaseColor(color);
            }
        }
        Object.keys(config.tones).forEach((colorName) => {
            let linkId = colorName + "Link";
            let linkElement = document.getElementById(linkId);
            gameState.links[colorName] = linkElement;
            gameState.rects[colorName] = document.getElementById(colorName);
            linkElement.addEventListener("mousedown", () => { select(colorName); });
            linkElement.addEventListener("mouseup", () => { deselect(colorName); });
        });
        document.getElementById("bgLink").addEventListener("dblclick", () => {
            if (gameState.status === "open" && confirm("Start New Game?")) {
                startNewGame();
            }
        });
    }
})()