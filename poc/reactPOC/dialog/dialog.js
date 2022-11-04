(function(){
    window.Dialog = function(dialogElem) {
        let setter, getter;
        this.setSetter = function(setterFn) {
            if (setter === undefined) {
                setter = setterFn;
            }
        }
        this.setGetter = function(getterFn) {
            if (getter === undefined) {
                getter = getterFn;
            }
        }
        this.open = function(value) {
            dialogElem.showModal();
            getter(value);
        }
        this.close = function(value) {
            if (value !== undefined) {
                setter(value);
            }
            dialogElem.close();
        }
    }
})();