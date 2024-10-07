(function(){
  const DEFAULT_AXIS_THRESHOLD = 0.05;
  const gamepads = {};
  const dispatcher = function(buttonLabels, state, gamepadType, gamepadIndex, singular, getter) {
    return function(item, index) {
      const newValue = getter(item);
      const oldValue = state[index];
      const label = buttonLabels[index];
      if (oldValue != newValue) {
        if (!newValue) {
          window.dispatchEvent(new CustomEvent(`gamepad${singular}released`,{ detail: { gamepadIndex, gamepadType, index, label }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}released`, { detail: { gamepadType, index, label }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${label}released`, { detail: { gamepadType }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${index}released`, { detail: { gamepadType }}));
        } else if (!oldValue) {
          window.dispatchEvent(new CustomEvent(`gamepad${singular}triggered`,{ detail: { gamepadIndex, gamepadType, index, label, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}triggered`, { detail: { gamepadType, index, label }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${label}triggered`,{ detail: { gamepadType, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${index}triggered`,{ detail: { gamepadType, newValue }}));
        } else {
          window.dispatchEvent(new CustomEvent(`gamepad${singular}changed`,{ detail: { gamepadIndex, gamepadType, index, label, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}changed`, { detail: { gamepadType, index, label }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${label}changed`,{ detail: { gamepadType, newValue }}));
          window.dispatchEvent(new CustomEvent(`gamepad${gamepadIndex}${singular}${index}changed`,{ detail: { gamepadType, newValue }}));
        }
        state[index] = newValue;
      }
    };
  }
  const pollGamepad = function(buttonLabels, state, { id, axes, buttons, timestamp }, gamepadIndex, axisThreshold) {
    if (timestamp > state.timestamp) {
      state.timestamp = timestamp;
      buttonLabels = buttonLabels || { axes: [], buttons: [] };
      axes.forEach(dispatcher(buttonLabels.axes, state.axes, id, gamepadIndex, "axis", (a) => {
        const newValue = Math.round(a*100)/100;
        return (Math.abs(newValue) > axisThreshold)?newValue:undefined;
      }));
      buttons.forEach(dispatcher(buttonLabels.buttons, state.buttons, id, gamepadIndex, "button", (b) => (b.pressed || b.touched)?b.value:undefined));
    }
  }
  const clearGamepad = function(index) {
    clearInterval(gamepads[index]);
    delete gamepads[index];
  }
  window.initGamepad = function(buttonLabels, { axisThreshold, throwWhenGamepadNotFound }) {
    axisThreshold = isNaN(axisThreshold)?DEFAULT_AXIS_THRESHOLD:axisThreshold;
    buttonLabels = buttonLabels || {};
    window.addEventListener("gamepaddisconnected", (e) => {
      clearGamepad(e.gamepad.index);
    });
    window.addEventListener("gamepadconnected", (e) => {
      console.log({ gamepad: e.gamepad });
      const state = { axes: [], buttons: [], timestamp: e.gamepad.timestamp };
      gamepads[e.gamepad.index] = {
        state,
        interval: setInterval(() => {
          const gamepad = navigator.getGamepads()[e.gamepad.index];
          if (gamepad) {
            const labels = buttonLabels[gamepad.id];
            if (labels || !throwWhenGamepadNotFound) {
              pollGamepad(labels, state, gamepad, e.gamepad.index, axisThreshold);
            } else {
              throw {
                errorMessage: "Not configured for gamepad",
                type: gamepad.id,
                axesCount: gamepad.axes.length,
                buttonCount: gamepad.buttons.length
              };
            }
          } else {
            clearGamepad(e.gamepad.index);
          }
        },10)
      };
    });
  }
})()