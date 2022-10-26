(function(){
  const register = {};
  const recurse = function(name, path) {
    if (!register[name]) {
      throw new Error("Namespace '" + name + "' does not exist.")
    }
    if (path.indexOf(name) >= 0) {
      throw new Error("Circular dependency: " + path.concat(name).join(" -> "))
    }
    const {factoryFn, dependencies, service} = register[name];
    if (service) {
      return service;
    }
    const imports = {};
    for (let namespace in dependencies) {
      const alias = dependencies[namespace];
      if (alias in imports) {
        throw new Error(`Cannot reuse alias: "${namespace}" as "${alias}"`);
      }
      imports[alias] = recurse(namespace, path.concat(name));
    }
    const newService = factoryFn(imports);
    if ((typeof newService) != "object" && (typeof newService) != "function") {
      throw new Error(`A namespace must be an object or function; it cannot be a primitive value: ${newService}`);
    }
    register[name] = { service: newService };
    return register[name].service;
  }
  window.importNamespace = function(name){
    return recurse(name, []);
  }
  window.namespace = function(name,dependencies,factoryFn) {
    if (!factoryFn) {
      factoryFn = dependencies;
      dependencies = {};
    }
    if (register[name]) {
      throw new Error("Namespace '" + name + "' has already been registered.");
    }
    if (Array.isArray(dependencies)) {
      dependencies = dependencies.reduce((out, dep) => { out[dep] = dep; return out; }, {});
    }
    register[name] = { dependencies, factoryFn };
  }
  window.imports = function(aliases) {
    if (Array.isArray(aliases)) {
      aliases = aliases.reduce((out, alias) => { out[alias] = alias; return out; }, {});
    }
    return Object.entries(aliases).reduce((out,[alias,ns]) => {
      out[alias] = importNamespace(ns);
      return out;
    }, {});
  }
})();