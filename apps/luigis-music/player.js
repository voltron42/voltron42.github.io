namespace("luigis-music.Player", {
    "luigis-music.Beeper": "Beeper"
}, ({ Beeper }) => {
    let applyProperties = function(from,to) {
        Object.entries(from).forEach(([k,v]) => {
            to[k] = v;
        });
        return to;
    }
    let playBeeps = function(beeper,sequence,defaults) {
        let args = {};
        let first = sequence[0];
        let next = sequence.slice(1);
        if ((typeof first) === 'number') {
            first = { frequency: first };
        }
        applyProperties(first,args);
        applyProperties(defaults,args);
        if (sequence.length > 1) {
            args.callback = (() => {
                playBeeps(beeper,next,defaults);
            });
        }
        if (args.after) {
            let callback = args.callback;
            args.callback = (() => {
                args.after();
                callback();
            });
        }
        if (sequence.length > 1 && (typeof args.rest)=== 'number' && args.rest > 0) {
            let callback = args.callback;
            args.callback = (() => { setTimeout(callback,args.rest * 1000); });
        }
        if (args.before) { args.before(); }
        beeper.beep(args);
    };
    return function(config){
        const {type, volume} = config;
        const beeper = new Beeper(type, volume);
        this.play = function(sequence) {
            playBeeps(beeper,sequence,config);
        };
    };
});