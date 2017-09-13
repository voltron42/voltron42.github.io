var typemap = {
  "/pdf":"application/pdf",
  "/svg/png":"image/png",
  "/svg/jpeg":"image/jpeg"
}

function buildRequest() {
  var path = document.getElementById("path").value;
  var body = document.getElementById("body").value;
  var req = new XMLHttpRequest();
  req.onload = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var blob = new Blob([this.response], {type: typemap[path]});
        var objUrl = URL.createObjectURL(blob);
        window.open(objUrl);
      } else {
        alert(this.responseText);
      }
    }
  }
  req.open("POST", "https://scullery-plateau.herokuapp.com/api" + path, true);
  req.requestType = "blob";
  req.setRequestHeader("Content-Type", "application/edn");
  req.send(body);
}

function startup() {
  build(document.getElementsByTagName("body")[0],[{
    tag: "label",
    children: [" Path: "]
  },{
		tag: "input",
		attrs: {
			id: "path",
      type: "text"
		}
  },{ tag: "br" },{
    tag: "textarea",
    attrs: {
      id: "body"
    }
  },{ tag: "br" },{
    tag: "button",
    attrs: {
      onClick: "buildRequest()"
    },
    children: ["Submit"]
  }]);
}
