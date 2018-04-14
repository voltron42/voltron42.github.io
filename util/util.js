if (!Array.prototype.last){
  Array.prototype.last = function(){
    return this[this.length - 1];
  };
};
if (!Array.repeat){
  Array.repeat = function(n,x){
    return Array.from(Array(n), () => x);
  };
};
if (!Array.prototype.groupBy) {
  Array.prototype.groupBy = function(key) {
    return this.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
}
if (!Array.range) {
  Array.range = function(low, high, step) {
    step = step || 1;
    if (!high) {
      high = low;
      low = 0;
    }
    var out = [];
    for (var x = low; x < high; x += step) {
      out.push(x);
    }
    return out;
  }
}
if (!Object.prototype.merge) {
  Object.prototype.merge = function(myMap) {
    var me = this;
    Object.entries(myMap).forEach(function(entry){
      me[entry[0]] = entry[1];
    });
    return me;
  }
}
if (!Object.map) {
  Object.map = function() {
    var args = Array.from(arguments);
    var out = {};
    while (args.length > 0) {
      out[args.shift()] = args.shift();
    }
    return out;
  }
}

function toggleDisplay(checkbox,target) {
  document.getElementById(target).style.display = checkbox.checked?"block":"none";
}

function buildXML(xmljson) {
  if ((typeof xmljson) == "string") {
    return xmljson;
  } else {
    xmljson.attrs = xmljson.attrs || {};
    xmljson.content = xmljson.content || [];
    var attrs = Object.entries(xmljson.attrs).map(function(attr){
      return " " + attr[0] + '="' + attr[1] + '"';
    });
    var out = "<" + xmljson.tag + attrs;
    if (xmljson.content.length > 0) {
      out += ">" + xmljson.content.map(buildXML).join("") + "</" + xmljson.tag + ">";
    } else {
      out += "/>"
    }
    return out;
  }
}
