(function(){
  var Sequence = function(prefix, init) {
    var step = init;
    this.getNextId = function() {
      var retval = step;
      step++;
      return prefix + retval;
    };
  }
  window.CascadeController = function(instanceName,ctrlId,srcCls,tgtCls) {
    var optSeq = new Sequence("opt-",0);
    var tgtSeq = new Sequence("tgt-",0);
    var tree = [];
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
      Array.from(document.getElementsByClassName(srcCls)).map(function(srcElem){
        srcElem.id = optSeq.getNextId();
      });
    }
    this.allowDrop = function(e) {
      e.preventDefault();
    };
    this.drag = function(e) {
      console.log(e);
      e.dataTransfer.setData(ctrlId, e.target.id);
    };
    this.drop = function(e,id) {
      e.preventDefault();
      var data = e.dataTransfer.getData(ctrlId);
      var src = document.getElementById(data);
      var dest = e.target;
      console.log("dropping " + data);
      console.log(src);
      console.log(dest);
      console.log(src.nodeName);
      switch(src.nodeName) {
        case "A":
          var label = src.innerHTML;
          var node = document.createElement("ul");
          node.id = tgtSeq.getNextId();
          node.innerHTML = "<li><a>" + label + "</a></li>";
          node.classList.add(tgtCls);
          node.addEventListener("ondragover", this.allowDrop);
          node.addEventListener("ondrop", this.drop);
          var item = document.createElement("li");
          item.id = optSeq.getNextId();
          item.classList.add(srcCls);
          item.draggable = true;
          item.addEventListener("ondragstart", this.drag);
          item.appendChild(node);
          dest.appendChild(item);
          break;
        case "LI":
          dest.appendChild(src);
          break;
        default:
          var msg = "not dropable";
          alert(msg);
          throw msg;
      }
    };
  };
})()