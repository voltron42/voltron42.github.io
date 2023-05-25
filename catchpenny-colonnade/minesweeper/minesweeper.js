namespace("minesweeper.Minesweeper",{
    "minesweeper.DigitalDisplay":"DigitalDisplay",
    "minesweeper.TimeDisplay":"TimeDisplay",
    "minesweeper.Settings":"Settings",
    "gizmo-atheneum.namespaces.react.Dialog":"Dialog"
},({ DigitalDisplay, TimeDisplay, Settings, Dialog }) => {
    const icons = {
        "explosion":<i className="fas fa-sun"></i>,
        "bomb":<i className="fas fa-bomb text-info"></i>,
        "flag":<i className="fas fa-flag text-danger"></i>,
        "smile":<i className="fas fa-grin text-warning"></i>,
        "win":<i className="fas fa-grin-stars text-warning"></i>,
        "lose":<i className="fas fa-dizzy text-warning"></i>,
        "settings":<i className="fas fa-cogs"></i>
    };
    const colors = [
        "dark",
        "info",
        "primary",
        "success",
        "warning",
        "danger",
        "light",
        "secondary"
    ];
    const neighbors = [
        [ -1, -1 ],
        [ 0, -1 ],
        [ 1, -1 ],
        [ 1, 0 ],
        [ 1, 1 ],
        [ 0, 1 ],
        [ -1, 1 ],
        [ -1, 0 ]
    ];
    const getNeighbors = function(x,y,width,height) {
        return neighbors.map(([xOff, yOff]) => {
            return [ x + xOff, y + yOff ];
        }).filter(([x1, y1]) => {
            return x1 >= 0 && x1 < width && y1 >= 0 && y1 < height;
        });
    }
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                height: 10,
                width: 10,
                count: 10
            }
            this.modals = Dialog.factory({
                settings:{
                    templateClass: Settings,
                    attrs: { class: 'bg-dark text-light border border-4 border-light rounded p-3' },
                    onClose: ({ width, height, count }) => {
                        this.setState({ width, height, count });
                    },
                }
            });
        }
        restart() {
            const { height, width, count } = this.state;
            const board = [];
            const deck = [];
            for (let y = 0; y < height; y++) {
                const row = [];
                for (let x = 0; x < width; x++) {
                    row.push({});
                    deck.push([ x, y ]);
                }
                board.push(row);
            }
            const hand = [];
            for (let i = 0; i < count; i++) {
                const card = Math.floor(Math.random() * deck.length);
                hand.push(deck[card]);
                deck.splice(card,1);
            }
            hand.forEach(([x,y]) => {
                board[y][x].bomb = true;
            });
            board.forEach(( row, y ) => {
                row.forEach((cell, x ) => {
                    console.log({ cell, y, x });
                    if (!cell.bomb) {
                        const myNeighbors = getNeighbors(x,y,width,height);
                        const neighborCount = myNeighbors.reduce((sum, [ x1, y1 ]) => {
                            return sum + ((board[y1][x1].bomb)?1:0);
                        }, 0);
                        console.log({ myNeighbors, actualNeighbors, neighborCount });
                        board[y][x].neighborCount = neighborCount;
                    }
                });
            });
            this.setState({ board, winState: undefined, startTime: Date.now() });
        }
        getFlagCount() {
            if (this.state.board) {
                return this.state.board.reduce((out,row) => {
                    return row.reduce((sum, { clickState }) => {
                        return sum + ((clickState === "flag") ? 1 : 0);
                    }, out);
                }, 0);
            }
            return 0;
        }
        getGameStateIcon() {
            if ( this.state.winState === true ) {
                return icons.win;
            } else if ( this.state.winState === false ) {
                return icons.lose;
            } else {
                return icons.smile;
            }
        }
        settings() {
            this.modals.settings.open(this.state);
        }
        toggleFlag() {
            this.setState({useFlag:!this.state.useFlag});
        }
        click( x, y ) {
            let winState = this.state.winState;
            if (winState === undefined) {
                const board = this.state.board.map((row) => {
                    return row.map((cell) => {
                        return Object.entries(cell).reduce((out, [ k, v ]) => {
                            out[k] = v;
                            return out;
                        }, {});
                    });
                });
                if (this.state.useFlag) {
                    const flagCount = this.getFlagCount();
                    let clickState = "flag";
                    if ( flagCount < this.state.count ) {
                        switch(board[y][x].clickState) {
                            case "flag":
                                clickState = "question";
                                break;
                            case "question":
                                clickState = undefined;
                                break;
                        }
                        if (clickState) {
                            board[y][x].clickState = clickState;
                        } else {
                            delete board[y][x].clickState;
                        }
                        if (checkFlags(board)) {
                            winState = true;
                        }
                    }
                } else {
                    if (board[y][x].bomb) {
                        winState = false;
                        board[y][x].clickState = "boom";
                    } else {
                        board[y][x].clickState = "show";
                        // todo - recurse outward
                    }
                }
                this.setState({ board, winState });
            }
        }
        getNeighborCountIcon(neighborCount) {
            return <span className={`text-${colors[neighborCount]}`}>{neighborCount > 0 ? neighborCount : "_"}</span>;
        }
        render() {
            return <>
                <h1 className="text-center ">MINESWEEPER</h1>
                <div className="d-flex justify-content-center">
                    <table>
                        <thead>
                            <tr>
                                <td colSpan={this.state.width} className="w-100">
                                    <div className="d-flex justify-content-between">
                                        <DigitalDisplay value={this.getFlagCount() || 0} digitCount={3}></DigitalDisplay>
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-dark border border-light" onClick={() => this.settings()}>{icons.settings}</button>
                                            <button className="btn btn-dark border border-light" onClick={() => this.restart()}>{this.getGameStateIcon()}</button>
                                            <button className="btn btn-dark border border-light" onClick={() => this.toggleFlag()}>{this.state.useFlag?icons.flag:icons.bomb}</button>
                                        </div>
                                        { this.state.board ? <TimeDisplay startTime={this.state.startTime} digitCount={3}></TimeDisplay> : <DigitalDisplay value={0} digitCount={3}></DigitalDisplay>}
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.board && this.state.board.map((row, y) => {
                                return <tr>
                                    { row.map(({ bomb, clickState, neighborCount }, x) => {
                                        let cell = <></>;
                                        if (clickState === "show") {
                                            cell = this.getNeighborCountIcon(neighborCount);
                                        } else if (clickState === "boom") {
                                            cell = icons.explosion;
                                        } else {
                                            if (this.state.winState === false) {
                                                if (bomb) {
                                                    cell = icons.bomb;
                                                } else {
                                                    cell = this.getNeighborCountIcon(neighborCount);
                                                }
                                            } else {
                                                const icon = <span className="text-dark">_</span>;
                                                switch (clickState) {
                                                    case "flag":
                                                        icon = icons.flag;
                                                        break;
                                                    case "question":
                                                        icon = <span>?</span>;
                                                        break;
                                                }
                                                cell = <button className="btn btn-dark border border-light border-1 rounded" onClick={() => { this.click(x,y) }}>{ icon }</button>;
                                            }
                                        }
                                        return <td className="text-center" style={{
                                            width: "2em",
                                            height: "2em"
                                        }}>{ cell }</td>;
                                    }) }
                                </tr>;
                            }) }
                        </tbody>
                    </table>

                </div>
            </>;
        }
    }
});