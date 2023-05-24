namespace("minesweeper.Minesweeper",{
    "minesweeper.DigitalDisplay":"DigitalDisplay"
},({ DigitalDisplay }) => {
    const icons = {
        "explosion":<i class="fa-duotone fa-sun" style="--fa-secondary-color: #ff0000; --fa-secondary-opacity: 1;"></i>,
        "bomb":<i class="fa-regular fa-bomb" style="color: #ffffff;"></i>,
        "flag":<i class="fa-duotone fa-flag" style="--fa-secondary-color: #ff0000; --fa-secondary-opacity: 1;"></i>,
        "smile":<i class="fa-solid fa-face-smile" style="color: #ffff00;"></i>,
        "win":<i class="fa-solid fa-face-sunglasses" style="color: #ffff00;"></i>,
        "lose":<i class="fa-solid fa-face-swear" style="color: #ffff00;"></i>,
        "settings":<i class="fa-regular fa-gear-complex" style="color: #ffffff;"></i>
    };
    const levels = [{
        height: 10,
        width: 10,
        count: 10
    }]
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                level: 0
            }
        }
        getFlagCount() {}
        render() {
            return <>
                <h1 className="text-center">Minesweeper</h1>
                <table>
                    <thead>
                        <tr>
                            <td colspan={levels[this.state.level].width}>
                                <div className="d-flex justify-content-between">
                                    
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </>;
        }
    }
});