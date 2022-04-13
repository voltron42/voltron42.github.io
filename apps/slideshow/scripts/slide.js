namespace("Slide",["State"],function(ns) {
  let Slide = function(type,value,index,transitionTimeSec,waitTime,canvas1,canvas2,next) {
    let canvasIndex = index % 2;
    let canvases = [canvas1,canvas2];
    let canvasA = canvases[canvasIndex];
    let canvasB = canvases[1-canvasIndex];
    let clear = function() {
      canvasA.style.backgroundImage = "";
      canvasA.innerHTML = '';
    }
    let settersByType = {
      image: function() {
        canvasA.style.backgroundImage = "url('./img/" + value + "')";
      },
      text: function() {
        canvasA.innerHTML = `<span class="caption">${value}</span>`;
      },
      empty: function() {}
    }
    let transitionIn = function() {
      if (canvasA.style.opacity == 1 && canvasB.style.opacity == 0) {
        if (next) {
          next.preload();
          setTimeout(() => { next.transition(); }, waitTime);
        } else {
            let slideEndTime = (new Date()).getTime();
            ns.State.slideTime = (slideEndTime - ns.State.startTime);
            console.log(ns.State);
        }
      } else if (canvasA.style.opacity < 1 || canvasB.style.opacity > 0) {
        if (canvasA.style.opacity < 1) {
          canvasA.style.opacity = 0.01 + parseFloat(canvasA.style.opacity);
        } 
        if (canvasB.style.opacity > 0) {
          canvasB.style.opacity -= 0.01;
        }
        setTimeout(() => {
          transitionIn();
        }, transitionTimeSec * 10);
      }
    }
    this.preload = function() {
      clear();
      settersByType[type]();
    }
    this.transition = function() {
      transitionIn();
    }
  }
  Slide.buildSlideshow = function(slides,transitionTimeSec,waitTime,canvas1,canvas2,fadeLast) {
    let next;
    if (fadeLast) {
      next = new Slide("empty","",slides.length,transitionTimeSec,waitTime,canvas1,canvas2);
    }
    while (slides.length > 0) {
      let slide = slides.pop();
      let index = slides.length;
      next = new Slide(slide.type || "empty",slide.value || "",index,transitionTimeSec,waitTime,canvas1,canvas2,next);
    }
    return next;
  }
  return Slide;
});
