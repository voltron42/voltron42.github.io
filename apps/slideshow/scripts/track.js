namespace("Track",['State'],function(ns) {
  let overlap = 2;
  return function(config,index,players,next) {
    ['start','fadeIn','fadeOut'].forEach((p) => {
      config[p] = config[p] || 0;
    });
    //console.log(config);
    let player = players[index % players.length];
    
    let fadeIn = (config.fadeIn > 0) ? () => {
      let interval = setTimeout(() => {
        player.volume += 0.01;
        if (player.volume < 0.99) {
          fadeIn();
        }
      },config.fadeIn*10);
    } : () => {
      player.volume = 0.99;
    };
    
    let fadeOut = (config.fadeOut > 0) ? () => {
      let interval = setTimeout(() => {
        player.volume -= 0.01;
        if (player.volume > 0.01) {
          fadeOut();
        } else {
          player.pause();
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
        fadeOut(() => {});
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
          ns.State.musicEndTime = (new Date()).getTime();
          ns.State.musicTime = (ns.State.musicEndTime - state.startTime)
          console.log(ns.State);
        };
      }
    })();
    
    this.getFadeInTime = (() => config.fadeIn);

    this.play = () => {
      player.pause();
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
});