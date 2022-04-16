namespace("Slideshow",['Track','State','Slide'],function(ns){

  let slideTime = 1961;

  let imageFadeOutSeconds = 0.4;

  let Slideshow = function(canvas1, canvas2, audioList) {
    let images = JSON.parse(localStorage.getItem("images"));
    let slideShowTime = (slideTime + (imageFadeOutSeconds * 1000)) * (images.length + 1);
    let firstSlide = ns.Slide.buildSlideshow(images,imageFadeOutSeconds,slideTime,canvas1,canvas2)
    let songs = JSON.parse(localStorage.getItem("songs"));
    let songTime = songs.map((s) => s.end - (s.start || 0) - (s.fadeIn || 0)).reduce((a,b) => a + b, 0);
    console.log({songTime: songTime, slideShowTime: slideShowTime});
    let firstTrack = ns.Track.buildTracklist(songs,audioList);
    if (firstTrack) {
      canvas1.style.opacity = 0;
      canvas2.style.opacity = 1;
      this.start = function() {
        ns.State.startTime = (new Date()).getTime();
        setTimeout(() => {
          firstSlide.preload();
          firstTrack.play();
          firstSlide.transition();
        }, slideTime);
      }
    }
  }
  return Slideshow;
});