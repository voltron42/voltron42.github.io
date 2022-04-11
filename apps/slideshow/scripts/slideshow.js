namespace("Slideshow",['Track','State'],function(ns){
  let slideTime = 4175;
  return function(canvas, audioList) {
    let indicies = {
      image: 0,
      song: 0
    };
    
    let images = JSON.parse(localStorage.getItem("images"));
    let songs = JSON.parse(localStorage.getItem("songs"));
    let songTime = songs.map((s) => s.end - (s.start || 0) - (s.fadeIn || 0)).reduce((a,b) => a + b, 0);
    let slideShowTime = slideTime * images.length;
    console.log({songTime: songTime, slideShowTime: slideShowTime});
    let songErrors = songs.filter((s) => {
      return isNaN(s.end) || ((typeof s.src) != "string");
    });
    if (songErrors.length > 0) {
      console.log(songErrors);
    } else {
      let next;
      while (songs.length > 0) {
        let song = songs.pop();
        let index = songs.length;
        next = new ns.Track(song,index,audioList,next);
      }
      let setCanvasImage = function(frame) {
        if (images[indicies.image]) {
          frame.backgroundImage = "url('./img/" + images[indicies.image++].src + "')";
          setTimeout(() => {
            setCanvasImage(frame);
          },slideTime);
        } else {
          ns.State.slideEndTime = (new Date()).getTime();
          ns.State.slideTime = (ns.State.slideEndTime - state.startTime)
          console.log(ns.State);
        }
      }
      this.start = function() {
        ns.State.startTime = (new Date()).getTime();
        setTimeout(() => {
          next.play();
          setCanvasImage(canvas.style);
        }, slideTime);
      }
    }
  }
});