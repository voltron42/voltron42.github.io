(function(){
  if (!XMLDocument.prototype.toSimpleJSON) {
    var toSimple = function(element) {
      if ((typeof element) == "string") {
        return element;
      }
      return {
        tag:element.tagName,
        attrs:element.getAttributeNames().reduce(function(out,name){
          out[name] = element.getAttribute(name);
          return out;
        },{}),
        content:Array.from(element.childNodes).map(toSimple)
      };
    }
    XMLDocument.prototype.toSimpleJSON = function() {
      return toSimple(this.documentElement);
    }
  }
  if (!XMLDocument.prototype.toObjectJSON) {
    var toObject = function(element) {
      
    }
    XMLDocument.prototype.toObjectJSON = function() {
      var retval = toObject(this.documentElement);
      return retval[this.documentElement.tagName];
    }
  }
})()
