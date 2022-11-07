namespace("Core",["Menu"],({ Menu }) => {
    return function() {
        const [size, setSize] = React.useState(16);
        const transform = function(type) {
            console.log(`transform ${type}`);
        }
        const menuItems = [{
            id: "fileMenu",
            label: "File",
            items:[{
                id: "loadFile",
                label: "Load File",
                callback: () => console.log("Load File")
            },{
                id: "download",
                label: "Download",
                callback: () => console.log("Download")
            }]
        }, {
            id: "sizeMenu",
            label: "Size",
            groupClassName: "size-picker",
            getter: (() => size),
            setter: (value) => {
                console.log(`set size to ${value}`);
                setSize(value);
            },
            options: [16, 32, 48].map(value => {
                return {label: `${value} X ${value}`, value};
            })
        }, {
            id: "transformMenu",
            label: "Transform",
            items: [
                ['turnLeft','Turn Left'],
                ['turnRight','Turn Right'],
                ['flipOver','Flip Over'],
                ['flipDown','Flip Down'],
                ['shiftLeft','Shift Left'],
                ['shiftRight','Shift Right'],
                ['shiftUp','Shift Up'],
                ['shiftDown','Shift Down'],
            ].map(([id,label]) => {
                return {
                    id: `transform-${id}`,
                    label,
                    callback: () => { transform(id); }
                }
            })
        }, {
            id: "about",
            label: "About",
            callback: () => console.log("About")
        }];
        return <div className="container">
            <div className="navbar d-flex justify-content-start">
                <Menu items={ menuItems }/>
                <a href="#" className="navbar-brand text-light" onClick={(e) => { e.preventDefault(); }}>Main Title:</a>
                <span className="navbar-brand">Subtitle</span>
            </div>
            <div className="d-flex justify-content-center rpg-box m-3">
                <p>Some more stuff for the page.</p>
            </div>
        </div>;
    }
});