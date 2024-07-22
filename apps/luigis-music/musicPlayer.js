namespace("luigis-music.MusicPlayer",{
    "luigis-music.Hertz": "Hertz",
    "luigis-music.Player": "Player"
}, ({ Hertz, Player }) => {
    return function(config) {
        const player = new Player(config);
        this.play = function(tempoBPM, [beatsPerMeasure, beatSize], sequence) {
            const wholeNoteDuration = beatSize * 60 / tempoBPM;
            
            player.play(sequence.map((note) => {
                if (note.length < 3) {
                    const [ time ] = note;
                    return {
                        rest: time * wholeNoteDuration,
                    };
                } else {
                    const [ time, pitch, octave ] = note;
                    return {
                        duration: time * wholeNoteDuration,
                        frequency: Hertz.donut(pitch, octave)
                    };
                }
            }));
        };
    };
});