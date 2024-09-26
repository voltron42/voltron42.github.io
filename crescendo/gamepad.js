(function(){
  const DEFAULT_AXIS_THRESHOLD = 0.05;
  const gamepads = {};
  const dispatcher = function(buttonLabels,state,gamepadIndex,singular,getter) {
    return function(item, index) {
      const newValue = getter(item);
      const oldValue = state[index];
      if (oldValue != newValue) {
        const label = buttonLabels[index];
        if (!newValue) {
          window.dispatchEvent(new CustomEvent(`gamepad${singular}released`,{ detail: { gamepadIndex, index, label }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${label}released`));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${index}released`));
        } else if (!oldValue) {
          window.dispatchEvent(new CustomEvent(`gamepad${singular}triggered`,{ detail: { gamepadIndex, index, label, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${label}triggered`,{ detail: newValue }));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${index}triggered`,{ detail: newValue }));
        } else {
          window.dispatchEvent(new CustomEvent(`gamepad${singular}changed`,{ detail: { gamepadIndex, index, label, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${label}changed`,{ detail: newValue }));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${index}changed`,{ detail: newValue }));
        }
        state[index] = newValue;
      }
    };
  }
  const pollGamepad = function(buttonLabels,state,{axes,buttons,timestamp},gamepadIndex,axisThreshold) {
    if (timestamp > state.timestamp) {
      axes.forEach(dispatcher(buttonLabels.axes, state.axes, gamepadIndex,"axis",(a) => {
        const newValue = Math.round(a*100)/100;
        return (Math.abs(newValue) > axisThreshold)?axisThreshold:undefined;
      }));
      buttons.forEach(dispatcher(buttonLabels.buttons, state.buttons, gamepadIndex, "button",(b) => (b.pressed || b.touched)?b.value:undefined));
    }
  }
  window.initGamepad = function(buttonLabels,axisThreshold) {
    axisThreshold = isNaN(axisThreshold)?DEFAULT_AXIS_THRESHOLD:axisThreshold;
    buttonLabels = buttonLabels || {};
    window.addEventListener("gamepaddisconnected", (e) => {
      clearInterval(gamepads[e.gamepad.index]);
      delete gamepads[e.gamepad.index];
    });
    window.addEventListener("gamepadconnected", (e) => {
      console.log({ gamepad: e.gamepad });
      const state = {axes:[],buttons:[]};
      gamepads[e.gamepad.index] = {
        state,
        interval: setInterval(() => {
          const gamepad = navigator.getGamepads()[e.gamepad.index]
          pollGamepad(buttonLabels[gamepad.id],state,gamepad,e.gamepad.index,axisThreshold);
        },50)
      };
    });
  }
})()