namespace("Track",['State'],function(ns) {
  let overlap = 1;
  let Track = function(config,index,players,next) {
    ['start','fadeIn','fadeOut'].forEach((p) => {
      config[p] = config[p] || 0;
    });
    config.maxVolume = config.maxVolume || 99;
    //console.log(config);
    let player = players[index % players.length];
    
    let fadeIn = (config.fadeIn > 0) ? () => {
      let interval = setTimeout(() => {
        player.volume += 0.01;
        if (player.volume < config.maxVolume / 100) {
          fadeIn();
        }
      },config.fadeIn*10);
    } : () => {
      player.volume = config.maxVolume / 100;
    };
    
    let fadeOut = (config.fadeOut > 0) ? () => {
      setTimeout(() => {
        player.volume -= 0.01;
        if (player.volume >= 0.01) {
          fadeOut();
        } else {
          player.pause();
          player.dispatchEvent(new Event('fadedOut'));
        }
      },config.fadeOut*10);
    } : () => {
      player.volume = 0.01;
      player.pause();
    };
    let runtime = config.end - config.start;
    let timeToFadeOut = 1000 * (runtime - config.fadeOut);
    let awaitFadeOut = () => {
      setTimeout(() => {
        fadeOut();
      },timeToFadeOut);
    }
    let awaitNext = (function(){
      let nextFadeInTime = next?.getFadeInTime();
      if (!isNaN(nextFadeInTime)) {
        let timeToNext = 1000 * (runtime - nextFadeInTime - overlap);
        return () => {
          setTimeout(() => {
            next.play()
          }, timeToNext);
        }
      } else {
        return () => {
          let eventHandler = () => {
            player.removeEventListener('fadedOut',eventHandler);
            let musicEndTime = (new Date()).getTime();
            ns.State.musicTime = (musicEndTime - ns.State.startTime)
            console.log(ns.State);
          }
          player.addEventListener('fadedOut',eventHandler);
        };
      }
    })();
    
    this.getFadeInTime = (() => config.fadeIn);

    this.play = () => {
      player.pause();
      console.log(index + ": " + config.src);
      player.src = "./mp3/" + config.src;
      player.volume = 0;
      player.load();
      player.play().then(() => {
        player.pause();
        player.currentTime = config.start;
        player.play().then(() => {
          fadeIn();
          awaitFadeOut();
          awaitNext();
        });
      });
    }
  }
  Track.buildTracklist = function(songs,audioList) {
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
        next = new Track(song,index,audioList,next);
      }
      return next;
    }
  }
  return Track;
});