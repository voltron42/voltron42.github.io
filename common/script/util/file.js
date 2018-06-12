(function(){
  window.loadFile = function(input,onComplete) {
    var file = input.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      onComplete(e.target.result);
    };
    reader.readAsText(file);
  }
  window.makeDownloadLink = function(label,filename,type,encoding,data) {
    var link = document.createElement("a");
    link.innerHTML = label;
    link.setAttribute("download",filename);
    link.setAttribute("href","data:"+type+";"+encoding+","+encodeURI(data));
    return link;
  }
})()