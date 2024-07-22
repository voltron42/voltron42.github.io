namespace("luigis-music.LuigisMusic",{
    "luigis-music.MusicPlayer": "MusicPlayer"
},({ MusicPlayer }) => {
    const music = [
        [1/8],
        [1/8, "E", 4],
        [1/8, "E", 4],
        [1/8, "E", 4],
        [1/4, "E", 4],
        [1/8, "C", 4],
        [1/8, "E", 4],
        [1/4, "Eb", 4],
        [1/4, "B", 3],
        [1/4],
        [1/4],
        [1/8],
        [1/8, "D", 4],
        [1/8, "D", 4],
        [1/8, "D", 4],
        [1/4, "D", 4],
        [1/8, "B", 3],
        [1/8, "D", 4],
        [3/8, "C", 4],
        [1/8, "Bb", 3],
        [1/4, "B", 3],
        [1/4],
        [1/8],
        [1/8, "E", 4],
        [1/8, "E", 4],
        [1/8, "E", 4],
        [1/4, "E", 4],
        [1/8, "C", 4],
        [1/8, "E", 4],
        [1/4, "Eb", 4],
        [1/4, "B", 3],
        [1/4],
        [1/4],
        [1/8],
        [1/8, "D", 4],
        [1/8, "D", 4],
        [1/8, "D", 4],
        [1/4, "D", 4],
        [1/8, "B", 3],
        [1/8, "D", 4],
        [1/8, "E", 4],
        [1/8, "D", 4],
        [1/8, "C", 4],
        [1/8, "B", 3],
        [1/2, "A", 3],
        [1, "G", 4],
    ];
    return function() {
        const player = new MusicPlayer({type:"sawtooth", volume:1})
        this.play = function() {
            player.play(80, [4, 4], music);
        };
    };
});