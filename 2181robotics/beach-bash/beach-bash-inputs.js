namespace("2181robotics.beach-bash.BeachBashInputs", () => {
  const buttonLabels = {
    "Xbox 360 Controller (XInput STANDARD GAMEPAD)": {
      axes: "Lx,Ly,Rx,Ry".split(","),
      buttons: "A,B,X,Y,Ls,Rs,Lt,Rt,Select,Start,L3,R3,DPadUp,DPadDown,DPadLeft,DPadRight,Menu".split(",")
    },
    "Generic   USB  Joystick   (Vendor: 0079 Product: 0006)": {
      axes: ["joystickX", "joystickY"],
      buttons: "red1,yellow1,green1,blue1,red2,yellow2,green2,blue2,coin,player1".split(",")
    }
  };
  const eventTypes = "triggered,changed".split(",");
  const actionTypes = "axis,button".split(",");
  const events = eventTypes.reduce((outVal, eventType) => {
    return outVal.concat(actionTypes.map(actionType => `gamepad${actionType}${eventType}`));
  }, []);
  const init = function(initStates, actionMapping, keyboardValueMapping, defaultKeyboardValue) {
    initGamepad(buttonLabels);
    events.forEach((eventName) => {
      window.addEventListener(eventName, ({ detail }) => {
        var { gamepadIndex, gamepadType, newValue, label, index } = detail;
        window.dispatchEvent(new CustomEvent("beachBashInputEngaged", { 
          detail: {  
            source: `gamepad${gamepadIndex}`,
            sourceType: gamepadType,
            action: label || index,
            value: newValue
          } 
        }));
      });
    });
    document.addEventListener("keyhold",({ detail }) => {
      window.dispatchEvent(new CustomEvent("beachBashInputEngaged", { 
        detail: { 
          source: "keyboard",
          sourceType: "keyboard",
          action: detail.code
        } 
      }))
    })
    actionTypes.forEach((actionType) => {
      const eventName = `gamepad${actionType}released`;
      window.addEventListener(eventName, ({ detail }) => {
        var { gamepadIndex, gamepadType, label, index } = detail;
        window.dispatchEvent(new CustomEvent("beachBashInputDisengaged", { 
          detail: {
            source: `gamepad${gamepadIndex}`,
            sourceType: gamepadType,
            action: label || index,
          }
        }))
      });
    });
    document.addEventListener("keyrelease",({ detail }) => {
      window.dispatchEvent(new CustomEvent("beachBashInputDisengaged", { 
        detail: {  
          source: "keyboard",
          sourceType: "keyboard",
          action: detail.code
        } 
      }));
    });
  }
  return { init };
});