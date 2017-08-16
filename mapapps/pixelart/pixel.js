(function(){
try {
global.ctrl = {
addColor: function(paletteId){
},
init:function() {
    build(document.getElementsByTagName("body")[0], [{
	       tag: "div",
	       attrs:{
	           id: "ctrls"
	       },
	       children: [{
	       tag: "button",
        attrs: { onClick: "ctrl.addColor('palette')" },
        children: ["Add Color"]
    },{
        tag: "ol",
        attrs: {
            id: "palette"
        },
        children: []
        },{
        tag: "br"
        },{
        tag: "label",
	       attrs:{
	           for: "width"
	       },
	       children: [" Width: "]
	       },{
	       tag: "input",
	       attrs:{
	           id: "widthfield",
	           name: "width",
	           type: "number",
	           value: 1,
	           style: "width: 5em;",
	           onChange: "resize('widthfield','heightfield')"
	       }
	       },{
        tag: "label",
	       attrs:{
	           for: "height"
	       },
	       children: [" Height: "]
	       },{
	       tag: "input",
	       attrs:{
	           id: "heightfield",
	           name: "height",
	           type: "number",
	           value: 1,
	           style: "width: 5em;"
	       }
	       }]
    },{
        tag: "br"
    },{
        tag: "div",
        attrs: { id: "canvas" }
    }])
}
};
} catch (e) {
alert(e);
}
)()




