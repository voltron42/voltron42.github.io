(function(){
  var Sequence = function(prefix, init) {
    var step = init;
    this.getNextId = function() {
      var retval = step;
      step++;
      return prefix + retval;
    };
  }
  window.CascadeController = function(instanceName,ctrlId,srcCls,tgtCls,menuId,menuOptions) {
    var optSeq = new Sequence("opt-",0);
    var tgtSeq = new Sequence("tgt-",0);
    var tree = [];
    var stack = {};
    this.init = function() {
      var firstTargetId = tgtSeq.getNextId();
      tree.push(firstTargetId);
      var targetList = document.getElementsByClassName(tgtCls);
      if (targetList.length != 1) {
        console.log(targetList);
        var msg = "page not structured properly";
        alert(msg);
        throw msg;
      }
      targetList[0].id = firstTargetId;
      document.getElementById(menuId).innerHTML = "<ul>" + menuOptions.map(function(opt){
        return '<li><a id="' + optSeq.getNextId() + '" class="option" draggable="true" ondragstart="ctrl.drag(event)">' + opt + '</a></li>'
      }).join("") + "</ul>";
    }
    var getTarget = function(elem) {
      
      var tgt = elem;
      while (!tgt.classList.contains("tree") && tgt.nodeName.toLowerCase() != "body") {
        tgt = tgt.parentElement;
      }
      return tgt;
    }
    this.allowDrop = function(e) {
      var tgt = getTarget(e.target);
      if (!stack[tgt.id]) {
        console.log("over");
        console.log(tgt);
        stack[tgt.id] = true;  
        console.log(stack);
      }
      e.preventDefault();
    };
    this.disallowDrop = function(e) {
      console.log("and out");
      delete stack[e.target.id];
      e.preventDefault();
    };
    this.drag = function(e) {
      console.log("drag");
      console.log(e.target);
      e.dataTransfer.setData(ctrlId, e.target.id);
    };
    this.drop = function(e) {
      e.preventDefault();
      var data = e.dataTransfer.getData(ctrlId);
      var src = document.getElementById(data);
      var dest = getTarget(e.target);
      console.log("dropping " + data);
      console.log(src);
      console.log(dest);
      console.log(src.nodeName);
      console.log(stack);
      var keys = Object.keys(stack);
      var children = keys.map(function(id){
        return document.getElementById(id);
      }).filter(function(elem) {
        return elem.id != dest.id && dest.contains(elem);
      });
      console.log(children);
      if (keys.length > 0 && children.length == 0) {
        switch(src.nodeName) {
          case "A":
            var label = src.innerHTML;
            var tgtId = tgtSeq.getNextId();
            var optId = optSeq.getNextId();
            var html = '<li id="' + optId + 
            '" class="option" draggable="true" ondragstart="' + instanceName + 
            '.drag(event)"><ul id="' + tgtId + '" class="tree" ondragover="' + instanceName + 
            '.allowDrop(event)" ondrop="' + instanceName + '.drop(event)" ondragleave="' + 
            instanceName + '.disallowDrop(event)"><li><a>' + label + "</a></li></ul></li>";
            dest.innerHTML += html;
            break;
          case "LI":
            if (dest.nodeName.toUpperCase() == "BODY") {
              src.parentElement.removeChild(src);
            } else {
              dest.appendChild(src);
            }
            break;
          default:
            var msg = "not dropable";
            alert(msg);
            throw msg;
        }
      }
    };
  };
})()