namespace("minesweeper.Minesweeper",{
    "minesweeper.DigitalDisplay":"DigitalDisplay",
    "minesweeper.TimeDisplay":"TimeDisplay",
    "minesweeper.Settings":"Settings",
    "gizmo-atheneum.namespaces.react.Dialog":"Dialog"
},({ DigitalDisplay, TimeDisplay, Settings, Dialog }) => {
    const icons = {
        "explosion":<i className="fa-duotone fa-sun" style={{"--fa-secondary-color": "#ff0000", "--fa-secondary-opacity": 1}}></i>,
        "bomb":<i className="fa-regular fa-bomb" style={{color: "#ffffff"}}></i>,
        "flag":<i className="fa-duotone fa-flag" style={{"--fa-secondary-color": "#ff0000", "--fa-secondary-opacity": 1}}></i>,
        "smile":<i className="fa-solid fa-face-smile" style={{color: "#ffff00"}}></i>,
        "win":<i className="fa-solid fa-face-sunglasses" style={{color: "#ffff00"}}></i>,
        "lose":<i className="fa-solid fa-face-swear" style={{color: "#ffff00"}}></i>,
        "settings":<i className="fa-regular fa-gear-complex" style={{color: "#ffffff"}}></i>
    };
    const colors = [
        "dark",
        "info",
        "primary",
        "success",
        "warning",
        "orange",
        "danger",
        "light",
        "secondary",
        "purple"
    ]
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
                    attrs: { class: 'bg-dark text-light border border-4 border-light' },
                    onClose: ({ width, height, count }) => {
                        this.setState({ width, height, count });
                    },
                }
            })
        }
        restart() {
            const board = [];
            this.setState({ board });
        }
        getFlagCount() {

        }
        getGameStateIcon() {}
        settings() {
            this.modals.settings.open(this.state);
        }
        toggleFlag() {
            this.setState({useFlag:!this.state.useFlag})
        }
        render() {
            return <>
                <h1 className="text-center ">MINESWEEPER</h1>
                <table>
                    <thead>
                        <tr>
                            <td colSpan={this.state.width}>
                                <div className="d-flex justify-content-between">
                                    { this.state.board && <DigitalDisplay value={this.getFlagCount()} digitCount={3}></DigitalDisplay>}
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-dark border border-light" onClick={() => this.settings()}>{icons.settings}</button>
                                        <button className="btn btn-dark border border-light" onClick={() => this.restart()}>{this.getGameStateIcon()}</button>
                                        <button className="btn btn-dark border border-light" onClick={() => this.toggleFlag()}>{this.state.useFlag?icons.flag:icons.bomb}</button>
                                    </div>
                                    { this.state.board && <TimeDisplay value={this.state.startTime} digitCount={4}></TimeDisplay> }
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </>;
        }
    }
});