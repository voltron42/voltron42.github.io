(function(){
  window[registryName].apply("SvgCanvas",[],function(){
    return function(inputId,outputId) {
      this.update = function(value) {
        document.getElementById(outputId).innerHTML = document.getElementById(inputId).value;
      }
    }
  })
})()