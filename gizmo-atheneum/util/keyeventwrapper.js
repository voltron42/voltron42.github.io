(function(){
  
  const keyEventFields = [ 
    "altKey", "code", "ctrlKey", "shiftKey", 
    "key", "keyCode", "target", "type"
  ];

  const keyHolds = {};
  
  const eventMap = {
    "keyup": {
      "hold": false,
      "event": "keyrelease",
      "suffix": "release"
    },
    "keydown": {
      "hold": true,
      "event": "keyhold",
      "suffix": "hold"
    }
  };

  const getKeyState = ((detail) => {
    return detail.altKey?"alt":"" + detail.ctrlKey?"ctrl":"" + detail.shiftKey?"shift":"";
  });

  const handleKeyEvent = ((e) => {
    const detail = keyEventFields.reduce((out,field) => {
      out[field] = e[field];
      return out;
    },{});
    if (detail.type in eventMap) {
      const mapped = eventMap[detail.type]
      if (keyHolds[detail.keyCode] != mapped.hold) {
        const keyState = getKeyState(detail);
        const keyEvent = detail.code.toLowerCase() + mapped.suffix;
        document.dispatchEvent(new CustomEvent(mapped.event, { detail }));
        document.dispatchEvent(new CustomEvent(keyEvent, { detail }));
        if (keyState.length > 0 && keyState != detail.key.toLowerCase() && !(keyState == "ctrl" && detail.key == "Control")) {
          document.dispatchEvent(new CustomEvent(mapped.event + keyState, { detail }));
          document.dispatchEvent(new CustomEvent(keyEvent + keyState, { detail }));
        }
      }
      keyHolds[detail.keyCode] = mapped.hold;
    }
  });

  window.initKeyEventWrapper = function() {
    document.addEventListener("keydown",handleKeyEvent);
    document.addEventListener("keyup",handleKeyEvent);
    document.addEventListener("keypress",handleKeyEvent);
  }

})();