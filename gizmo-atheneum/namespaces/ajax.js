namespace("gizmo-atheneum.namespaces.Ajax",{},() => {
    const callbackEvents = {
      success: 'AjaxSuccess',
      failure: 'AjaxFailure',
      stateChange: 'AjaxStateChanged',
    };
    const defaultCallbacks = Object.entries(callbackEvents).reduce(
      (out, [k, v]) => {
        out[k] = (arg) => {
          document.dispatchEvent(new CustomEvent(v, { detail: arg }));
        };
        return out;
      },
      {}
    );
    const request = function(method, filepath, payload, callbacks) {
        [payload, callbacks] = callbacks?[payload,callbacks]:[undefined,payload];
        if (typeof callbacks == 'function') {
            callbacks = {
            success: callbacks,
            };
        }
        callbacks = Object.entries(callbacks).reduce((out, [k, v]) => {
            out[k] = v;
            return out;
        }, defaultCallbacks);
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
            if (this.status === 200) {
                callbacks.success(this.responseText);
            } else {
                if (callbacks.failure) {
                    callbacks.failure({
                        requestedFile: filepath,
                        status: this.status,
                        statusText: this.statusText,
                        responseText: this.responseText,
                    });
                }
            }
            } else {
                if (callbacks.stateChange) {
                    callbacks.stateChange({
                        state: this.readyState,
                        min: 0,
                        max: 4,
                    });
                }
            }
        };
        xhttp.open(method, filepath, true);
        if (payload) {
            xhttp.send(payload);
        } else {
            xhttp.send();
        }
    };
    const poll = function(method, filepath, interval, payload, callbacks) {
        const polling = setInterval(() => {
            request(method, filepath, payload, callbacks);
        },interval);
        return () => {
            clearInterval(polling);
        }
    }
    const methods = ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTION'];
    const retval = methods.reduce(( out, method ) => {
        out[method.toLowerCase()] = ((filepath, payload, callbacks) => {
            return request(method, filepath, payload, callbacks);
        });
    }, { request, poll });
    return retval;
  });