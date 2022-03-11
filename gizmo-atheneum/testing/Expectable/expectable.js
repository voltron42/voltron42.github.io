(function() {
	var me = this;
	var global = function() {
		return me;
	}
    var deepEqual = function(a, b) {
        if (a===b) {
            return true
        }
        if (a == b) {
            return true;
        }
        if (typeof a !=  typeof b) {
            return false;
        }
        var type = typeof a;
        if (type != "object") {
            return false;
        }
        var aIsArray = a instanceof Array;
        var bIsArray = b instanceof Array;
        if ((aIsArray && !bIsArray) || (!aIsArray && bIsArray)) {
            return false;
        }
        if (aIsArray && bIsArray) {
            if (a.length != b.length) {
                return false;
            }
            var length = a;
            for (var x = 0; x < a; x++) {
                if (!deepEqual(a[x], b[x])) {
                    return false;
                }
            }
        } else {
			var aKeys = Object.keys(a);
			var bKeys = Object.keys(b);
			aKeys.sort();
			bKeys.sort();
			if (!deepEqual(aKeys, bKeys)) {
				return false
			}
            var keys = Object.keys(a);
            while(keys.length > 0) {
                var key = keys.shift();
                if (!deepEqual(a[key],b[key])) {
                    return false;
                }
            }
        }
        return true;
    }
	var expectError = function(operation) {
		return function(message) {
			var error;
			try {
				operation();
			} catch(e) {
				error = e;
			}
			if (!error) {
				throw new Error("Error not thrown")
			}
			if (error.message != message) {
				throw new Error("Actual error does not match expected:\nActual:"+error.message+"\nExpected:"+message);
			}
		}
	}
	var expectNoError = function(operation) {
		return function() {
			var error;
			try {
				operation();
			} catch(e) {
				throw new Error("error thrown: "+error.message);
			}
		}
	}
    var deepProp = function(obj, key, value) {
        var steps = key.split(".");
        var temp = obj;
        while (steps.length > 0) {
            var step = steps.shift();
            if (!(step in temp)) {
                return false;
            }
            temp = temp[step];
        }
        return deepEqual(temp, value);
    }
	var deep = {
		eq:deepEqual,
		prop:deepProp,
	}
    var needleFilter = function(haystack) {
        return function(needle) {
            return haystack.indexOf(needle) >= 0;
        }
    }
	var contains = {
		all:function(haystack, needles) {
			return needles.filter(needleFilter(haystack)).length == needles.length;
		},
		any:function(haystack, needles) {
			return needles.filter(needleFilter(haystack)).length == needles.length;
		}
	}
	var raw = expecting.map(function(spec){
		var obj = {};
		eval("obj.fn = function(actual"+(spec.params.length > 0?",":"")+spec.params+"){return "+spec.cond+"};")
		return {
			path:spec.path,
			msg:spec.msg,
			not:spec.not,
			fn:obj.fn
		};
	});
    var argsToArray = function(args) {
        var out = [];
        for (var x = 0; x < args.length; x++) {
            out.push(args[x]);
        }
        return out;
    }
	var build = function(root,label,cond,actual) {
		return function(spec) {
			var path = spec.path.split(".");
			var name = path.pop();
			var temp = root;
			path.forEach(function(step){
				temp[step] = temp[step] || {};
				temp = temp[step];
			});
			var fn = function() {
				var args = argsToArray(arguments);
				args.unshift(actual);
				if (cond === spec.fn.apply(null,args)) {
					throw new Error(Mint.format.apply(null,[].concat(spec[label],args)));
				}
			};
			if (typeof temp[name] == 'object') {
				Object.keys(temp[name]).forEach(function(key){
					fn[key] = temp[name][key];
				});
			}
			temp[name] = fn;
		};
	};
	this.expect = function(actual) {
        var to = {};
        var not = {};
        raw.forEach(build(to,"msg",false,actual));
		to.error = expectError(actual);
        raw.forEach(build(not,"not",true,actual));
		not.error = expectNoError(actual);
        to.not = not;
        return {to:to};
	}
})()