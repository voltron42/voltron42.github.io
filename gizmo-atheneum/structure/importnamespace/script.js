(function(){
	global = global || window;
	let register = {};
	var recurse = function(name, path) {
		if (!register[name]) {
			throw new Error("Namespace '" + name + "' does not exist.")
		}
		if (path.indexOf(name) >= 0) {
			throw new Error("Circular dependency: " + path.concat(name).join(" -> "))
		}
		service = register[name]
		if (service.service) {
			return service.service
		}
		register[name] = {
			service:service.nsBuilder(Object.entries(service.required).reduce(function(out,entry) {
				out[entry[1]] = recurse(entry[0], path.concat(name));
				return out;
			}, {}))
		};
		return register[name].service;
	}
	global.import = function(namespace){
		return recurse(name, []);
	}
	global.namespace = function(name,required,nsBuilder) {
		if (register[name]) {
			throw new Error("Namespace '" + name + "' has already been registered.");
		}
		try {
			service = import(name)
			register[name] = {
				service:service
			};
		} catch(e) {
			register[name] = {
				required:required,
				nsBuilder:nsBuilder
			};
		}
	}
})();