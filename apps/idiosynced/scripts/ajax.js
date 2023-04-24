namespace("v42.idiosynced.Ajax",{},() => {
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
    const methods = ['GET','POST','PUT','PATCH'];
    const retval = methods.reduce(( out, method ) => {
        out[method.toLowerCase()] = ((filepath, payload, callbacks) => {
            return request(method, filepath, payload, callbacks);
        });
    }, { request });
    return retval;
  });