let indicies = {
  image: 0,
  song: 0
};
let state = {};
let slideTime = 3000;
function playNext(audio) {
  if (songs[indicies.song]) {
    console.log(songs[indicies.song].src);
    audio.src = "./mp3/" + songs[indicies.song++].src;
    audio.pause();
    audio.load();
    audio.play().then(() => {
      console.log(audio.duration);
      console.log(audio.currentTime);
      setTimeout(() => {
        console.log(audio.duration);
        console.log(audio.currentTime);
        
      }, 15000);
    });
  }
}
function setCanvasImage(frame) {
  if (images[indicies.image]) {
    frame.backgroundImage = "url('./img/" + images[indicies.image++].src + "')";
    setTimeout(() => {
      setCanvasImage(frame);
    },slideTime);
  } else {
    state.endTime = (new Date()).getTime();
    console.log({elapsedTime:(state.endTime - state.startTime)});
  }
}
function start(button,canvasId,jukeboxId) {
  state.startTime = (new Date()).getTime();
  button.parentElement.removeChild(button);
  setTimeout(() => {
    playNext(document.getElementById(jukeboxId));
    setCanvasImage(document.getElementById(canvasId).style);
  }, slideTime);
}
