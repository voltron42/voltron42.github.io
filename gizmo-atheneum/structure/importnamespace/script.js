(function(){
  let register = {};
  var recurse = function(name, path) {
    if (!register[name]) {
      throw new Error("Namespace '" + name + "' does not exist.")
    }
    if (path.indexOf(name) >= 0) {
      throw new Error("Circular dependency: " + path.concat(name).join(" -> "))
    }
    let service = register[name];
    if (service.service) {
      return service.service
    }
    let imports = Object.entries(service.dependencies).reduce(function(out,entry) {
      if ((typeof out) == "string") {
        return out;
      }
      if (entry[1] in out) {
        return "Cannot re-use alias: " + entry[1] + ": " + entry[0];
      }
      out[entry[1]] = recurse(entry[0], path.concat(name));
      return out;
    }, {});
    if ((typeof imports) == "string") {
      throw new Error(imports);
    }
    service = service.nsBuilder(imports);
    if ((typeof service) != "object" && (typeof service) != "function") {
      throw new Error("A namespace must be an object or function; it cannot be a primitive value: " + service);
    }
    register[name] = { service:service };
    return register[name].service;
  }
  window.importNamespace = function(name){
    return recurse(name, []);
  }
  window.namespace = function(name,dependencies,nsBuilder) {
    if (!nsBuilder) {
      nsBuilder = dependencies;
      dependencies = {};
    }
    if (register[name]) {
      throw new Error("Namespace '" + name + "' has already been registered.");
    }
    if (Array.isArray(dependencies)) {
      dependencies = dependencies.reduce((out, dep) => { out[dep] = dep; return out; }, {});
    }
    register[name] = {
      dependencies:dependencies,
      nsBuilder:nsBuilder
    };
  }
  window.imports = function(aliases) {
    if (Array.isArray(aliases)) {
      aliases = aliases.reduce((out, alias) => { out[alias] = alias; return alias; }, {});
    }
    return Object.entries(aliases).reduce((out,[alias,ns]) => {
      out[alias] = importNamespace(ns);
      return out;
    }, {});
  }
})();