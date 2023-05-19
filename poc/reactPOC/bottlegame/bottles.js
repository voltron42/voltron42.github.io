namespace('bottles.BottleGame',{},() => {
    const colorIndicies = [0,1,2,3];
    const colors = [
        "#f00",
        "#0f0",
        "#00f",
        "#ff0",
        "#0ff",
        "#f0f",
        "#fa0",
        "#0fa",
        "#f0a",
        "#af0",
        "#0af",
        "#a0f",
        "#ff5",
        "#5ff",
        "#f5f",
        "#fa5",
        "#5fa",
        "#f5a",
        "#af5",
        "#5af",
        "#a5f",
        "#f50",
        "#0f5",
        "#f05",
        "#5f0",
        "#05f",
        "#50f",
        "#ffa",
        "#aff",
        "#faf",
        "#faa",
        "#afa",
        "#faa",
        "#5f5",
        "#55f",
        "#55f",
    ]
    const levelColorCounts = [3,3];
    const getLevelColorCount = function(level) {
        while(levelColorCounts.length < level) {
            let count = levelColorCounts[levelColorCounts.level - 1];
            let newCount = count + 1
            for (let i = 0; i < count; i++) {
                levelColorCounts.push(newCount);
            }
        }
        return levelColorCounts[level-1];
    }
    const generateLevel = function(levelNum) {
        const levelColorCount = getLevelColorCount(levelNum);
        const levelColors = colors.slice(0,levelColorCount).reduce((out, color) => {
            colorIndicies.forEach(() => {
                out.push(color)
            })
            return out;
        }, []);
        const shuffle = [];
        while(levelColors.length > 0) {
            let rand = Math.floor(Math.random() * levelColors.length);
            shuffle.push(levelColors[rand]);
            levelColors.splice(rand,1);
        }
        const out = [];
        while(shuffle.length > 0) {
            out.push(shuffle.slice(0,4));
            shuffle.splice(0,4);
        }
        out.push([]);
        out.push([]);
        return out;
    }
    const frameSize = 5;
    const delay = 50;
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                levelNum: 1,
                level: generateLevel(1)
            };
        }
        animateMoveRecursive(color,moveStep,fromIndex,srcPos,toIndex,destPos,onComplete,percentComplete) {
            if (moveStep <= 0 || destPos >= 4) {
                console.log("on complete");
                onComplete();
            } else if (percentComplete > 100) {
                console.log("completed percent");
                this.animateMoveRecursive(color,moveStep-1,fromIndex,srcPos-1,toIndex,destPos+1,onComplete,0);
            } else {
                console.log("animating move");
                const fromId = `${fromIndex}_${srcPos}`;
                const toId = `${toIndex}_${destPos}`;
                const fromPercent = `${100 - percentComplete}%`;
                const toPercent  = `${percentComplete}%`;
                console.log({ fromId, toId, fromPercent, toPercent });
                const fromStyle = document.getElementById(fromId).style;
                fromStyle.width = fromPercent;
                fromStyle.color = color;
                fromStyle.backgroundColor = color;
                const toStyle = document.getElementById(toId).style
                toStyle.width = toPercent;
                toStyle.color = color;
                toStyle.backgroundColor = color;
                console.log("setting timeout");
                setTimeout(() => {
                    console.log({ percentComplete });
                    this.animateMoveRecursive(color,moveStep, fromIndex, srcPos, toIndex, destPos, onComplete, percentComplete + frameSize);
                }, delay);
            }
        }
        animateMove(color,moveCount,fromIndex,srcPos,toIndex,destPos,onComplete) {
            console.log("animate move recursive");
            this.animateMoveRecursive(color,moveCount,fromIndex,srcPos,toIndex,destPos,onComplete,0);
        }
        clickBottle(index) {
            const fromIndex = this.state.fromIndex;
            const level = Array.from(this.state.level);
            const src = level[fromIndex];
            const dest = level[index];
            console.log({ index, fromIndex, level, src, dest });
            if (!fromIndex && level[index].length > 0) {
                console.log("set from");
                this.setState({ fromIndex: index });
                console.log({ state: this.state });
            } else if (fromIndex && level[index].length < 4 && fromIndex != index) {
                console.log("move");
                console.log({ state: this.state });
                const srcColor = src[src.length-1];
                const destColor = dest[dest.length-1];
                if (srcColor !== destColor && dest.length > 0) {
                    console.log("unmatched - resetting");
                    this.setState({ fromIndex: undefined });
                } else {
                    console.log("matched - proceeding");
                    const destSpace = 4 - dest.length;
                    let srcColorCount = 1;
                    for (let i = src.length - 2; i >= 0; i--) {
                        if (src[i] !== srcColor) {
                            break;
                        }
                        srcColorCount++;
                    }
                    const moveCount = Math.min(destSpace,srcColorCount);
                    console.log("animate move");
                    this.animateMove(srcColor,moveCount,fromIndex,src.length - 1,index,dest.length,() => {
                        for (let i = 0; i < moveCount; i++) {
                            dest.push(src.pop());
                        }
                        this.setState({ level, fromIndex: undefined });
                    });
                }
            } else {
                console.log("error");
                console.log({ state: this.state });
                this.setState({ fromIndex: undefined });
            }
        }
        render() {
            return <>
                <h1 className="text-center">Bottle Game</h1>
                <div className="d-flex flex-column">
                    { this.state.level.map((bottle,index) => {
                        return <button className="btn btn-link" onClick={() => { this.clickBottle(index) }}>
                            <div className="row">
                                { colorIndicies.map((c,color) => {
                                    const style = {
                                        width: bottle[color] ? "100%" : "0%"
                                    }
                                    if (bottle[color]) {
                                        style.color = bottle[color];
                                        style.backgroundColor = bottle[color];
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