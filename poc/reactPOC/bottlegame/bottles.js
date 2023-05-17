namespace('bottles.BottleGame',{},() => {
    const colorIndicies = [0,1,2,3];
    const generateLevel = function(levelNum) {
        const out = [];
        out.push([]);
        out.push([]);
        return out;
    }
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                levelNum: 1,
                level: generateLevel(1)
            };
            console.log({ state: this.state });
        }
        clickBottle(index) {
            console.log({ index })
        }
        render() {
            return <>
                <h1 className="text-center">Bottle Game</h1>
                <div className="d-flex flex-column">
                    { this.state.level.map((bottle,index) => {
                        return <button className="btn btn-link" onClick={this.clickBottle(index)}>
                            <div className="row">
                                { colorIndicies.map((color) => {
                                    const style = {
                                        width: bottle[color] ? "100%" : "0%"
                                    }
                                    if (bottle[color]) {
                                        style.color = bottle[color];
                                    }
                                    return <div className="col-3 m-0 p-0">
                                        <div className="progress w-100">
                                            <div 
                                                className="progress-bar"
                                                id={ `${index}_${color}` }
                                                style={ style }
                                            ></div>
                                        </div>
                                    </div>;
                                }) }
                            </div>
                        </button>;
                    }) }
                </div>
            </>;
        }
    }
});