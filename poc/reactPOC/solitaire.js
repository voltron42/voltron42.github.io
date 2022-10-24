namespace("Solitaire",() => {
    const suits = { "C": "black", "D": "red", "H": "red", "S": "black" };
    const ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
    const oppositeColors = { "black": "red", "red": "black" };
    return class Solitaire extends ReactComponent {
        constructor(props) {
            super(props);
            this.state = {
                playing:false,
                drawPile:[],
                hand:[],
                goals:Object.keys(suits).reduce((out,suit) => {
                    out[suit] = -1;
                    return out;
                }, {}),
                columns:Array(7).fill({
                    stack:[],
                    chain:[]
                })
            }
        }
        deal() {

        }
        draw() {
            
        }
        selectOrMove(index) {

        }
        render() {
            return <>
                { !this.state.playing && <button onClick={ () => { this.deal() } }>New Game</button> }
                <table>
                    <tr>
                        <td><button onClick={ () => { this.draw() } }>{ (this.state.drawPile.length === 0)?"X":"DRAW" }</button></td>
                        <td colspan="2"><button onClick={ () => { this.selectOrMove(-1); } }>{ this.state.hand.join(", ") }</button></td>
                        {Object.entries(this.state.goals).map(([suit,rankIndex]) => {
                            return <td><button onClick={ () => { this.selectOrMove(suit); } }>{ `${rankIndex<0?"X":ranks[rankIndex]}${suit}` }</button></td>;
                        })}
                    </tr>
                    <tr>
                        {this.columns.map(({stack,chain},index) => {
                            return <td><button onClick={ () => { 
                                this.selectOrMove(index); 
                            } }>{ `${chain.length>0?chain.join(", "):(stack.length>0?"DRAW":"X")}${suit}` }</button></td>;
                        })}
                    </tr>
                </table>
            </>;
        }
    }
});