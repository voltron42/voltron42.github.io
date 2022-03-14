(function(){
	
	let keyEventFields = [ 
		"altKey", "code", "ctrlKey", "shiftKey", 
		"key", "keyCode", "target", "type"
	];

	let keyHolds = {};
	
	let eventMap = {
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

	let handleKeyEvent = ((e) => {
		let event = keyEventFields.reduce((out,field) => {
			out[field] = e[field];
			return out;
		},{});
		if (event.type in eventMap) {
			let mapped = eventMap[event.type]
			if (keyHolds[event.keyCode] != mapped.hold) {
				let keyEvent = event.code.toLowerCase() + mapped.suffix;
				document.dispatchEvent(new CustomEvent(mapped.event, { detail: event }));
				document.dispatchEvent(new CustomEvent(keyEvent, { detail: event }));
			}
			keyHolds[event.keyCode] = mapped.hold;
		}
	});

	window.initKeyEventWrapper = function() {
		document.addEventListener("keydown",handleKeyEvent);
		document.addEventListener("keyup",handleKeyEvent);
		document.addEventListener("keypress",handleKeyEvent);
	}

})();