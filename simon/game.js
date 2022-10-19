(function(){
    let ceottk = [["D", 4], ["E", 4], ["C", 4], ["C", 3], ["G", 3]];
    let playBeeps = function(beeper,sequence,defaults) {
        let args = {};
        let first = sequence[0];
        let next = sequence.slice(1);
        if ((typeof first) === 'number') {
            first = { frequency: first };
        }
        Object.entries(first).forEach(([k,v]) => {
            args[k] = v;
        });
        Object.entries(defaults).forEach(([k,v]) => {
            args[k] = v;
        });
        if (sequence.length <= 1) {
            args.callback = callback;
        } else {
            args.callback = (() => {
                playBeeps(beeper,sequence.slice(1),duration);
            });
        }
        if (args.after) {
            let callback = args.callback;
            args.callback = (() => {
                args.after();
                callback();
            });
        }
        if ((typeof args.rest)=== 'number' && args.rest > 0) {
            let callback = args.callback;
            args.callback = (() => { setTimeout(callback,args.rest * 1000); });
        }
        if (args.before) { args.before(); }
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
            rest: 0.05,
            difficulties: [
                {
                    minLength: 1,
                    maxLength: 5,
                    duration: 0.42
                },
                {
                    minLength: 6,
                    maxLength: 13,
                    duration: 0.32
                },
                {
                    minLength: 14,
                    maxLength: 31,
                    duration: 0.22
                },
            ]
        }
    }
    config.difficulties = config.sequence.difficulties.reduce((out,{minLength,maxLength,duration}) => {
        for (let i = minLength; i <= maxLength; i++) {
            out[i] = duration;
        }
        return out;
    }, {});
    window.init = function() {
        let beeper = new Beeper({type:"triangle",volume:1})
        let gameState = {
            status: "open",
            rects:{},
            links:{}
        };
        let resetToOpen = function() {
            delete gameState.sequence;
            delete gameState.step;
            gameState.status = 'open';
        }
        let timeouter = new Timeouter(config.inGameTimeOut * 1000,() => {
            alert("Game has timed out! You lose!");
            resetToOpen();
        });
        let pressColor = function(color) {
            gameState.stopBeep = beeper.startBeep({frequency:config.tones[color]});
            gameState.rects[color].classList.add("active");
        }
        let releaseColor = function(color) {
            gameState.rects[color].classList.remove("active");
            gameState.stopBeep();
        }
        let victory = function() {
            // todo - build victory beeps, and set status to "open" on callback
        }
        let stepSequence = function() {
            if (gameState.sequence.length >= config.sequence.maxLength) {
                timeouter.clear();
                victory();
            } else {
                gameState.status = "show";
                gameState.sequence.push(Object.keys(config.tones)[Math.floor(4 * Math.random())]);
                playBeeps(beeper,gameState.sequence.map((color) => config.tones),config.difficulties[gameState.sequence.length],config.sequence.rest,() => {
                    timeouter.reset();
                    gameState.status = "play";
                    gameState.step = 0;
                });
            }
        }
        let validateChoice = function(color) {
            // todo - check color against place in sequence and either error out or inc step (call "stepSequence" if step at length)
        }
        let startNewGame = function() {
            console.log("start game");
            playBeeps(beeper,ceottk.map(note => HertzDonut.apply(null,note)),0.5,0,() => {
                gameState.sequence = [];
                stepSequence();
            });
        }
        let select = function(color) {
            if (gameState.status === "open" || gameState.status === "play") {
                pressColor(color);
            }
        }
        let deselect = function(color) {
            if (gameState.status === "open") {
                releaseColor(color);
            } else if (gameState.status === "play") {
                releaseColor(color);
                validateChoice(color);
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