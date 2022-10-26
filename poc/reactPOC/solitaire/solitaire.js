namespace("Solitaire",["GameLogic"],({GameLogic}) => {
    return class Solitaire extends React.Component {
        constructor(props) {
            super(props);
            this.state = GameLogic.buildInitState(props.drawCount);
        }
        deal() {
            const initState = GameLogic.buildInitState(this.state.drawCount);
            initState.playing = !this.state.playing;
            initState.drawPile = GameLogic.shuffle(GameLogic.buildDeck());
            for(let r = 0; r<7; r++){
                for(let c = r; c<7; c++){
                    initState.columns[c].stack.push(initState.drawPile.shift());
                }
            }
            initState.columns.forEach((col) => {
                col.chain.push(col.stack.pop())
            });
            this.setState(initState)
        }
        draw() {
            const temp = ['drawPile','hand','discard'].reduce((out,k) => {
                out[k] = Array.from(this.state[k]);
                return out;
            }, { drawCount: this.state.drawCount });
            if (temp.drawPile.length === 0) {
                temp.drawPile = temp.discard.concat(temp.hand);
                temp.discard = [];
                temp.hand = [];
            }
            let drawCount = Math.min(temp.drawCount,temp.drawPile.length);
            temp.discard = temp.discard.concat(temp.hand);
            temp.hand = temp.drawPile.splice(0,drawCount);
            this.setState(temp);
        }
        selectOrMove(selection) {
            if ((typeof this.state.from) === "number" || (typeof this.state.from) === "string") {
                try {
                    if (this.state.from !== selection) {
                        this.setState(GameLogic.move(GameLogic.cloneState(this.state),selection));
                    } else {
                        this.setState({from: undefined});
                    }
                } catch (e) {
                    alert("Illegal Move!")
                } finally {
                    this.setState({from: undefined});
                }
            } else {
                this.setState({ from: selection });
            }
            if (this.state.winState) {
                alert(`You've ${this.state.winState}!`);
                this.setState({ playing: !this.state.playing });
            }
        }
        getStackCount(index) {
            return this.state.columns[index].stack.length > 0 && this.state.columns[index].stack.length;
        }
        buildChainCard(c) {
            return <span className={GameLogic.getCardColor(c)}>{c}</span>;
        }
        reduceChain([first,...rest]) {
            return rest.reduce((chain,card) => {
                return <>{chain}, { this.buildChainCard(card) }</>
            },this.buildChainCard(first));
        }
        buildStackButton(index) {
            const { stack, chain } = this.state.columns[index];
            return <button className={(this.state.from === index) ? "from" : undefined} onClick={ () => {
                this.selectOrMove(index);
            } }>{ (chain.length>0)?this.reduceChain(chain):((stack.length>0)?"DRAW":"X") }</button>;
        }
        buildGoalButton(suit) {
            const rankIndex = this.state.goals[suit];
            return <button className={(this.state.from === suit) ? `from ${GameLogic.suits[suit]}` : GameLogic.suits[suit]} onClick={ () => { this.selectOrMove(suit); } }>{ `${rankIndex<0?"X":GameLogic.ranks[rankIndex]}${suit}` }</button>;
        }
        render() {
            return <>
                { !this.state.playing && <button onClick={ () => { this.deal() } }>New Game</button> }
                <table>
                    <tbody>
                        <tr>
                            <td>{ this.getStackCount(0) }</td>
                            <td>{ this.buildStackButton(0) }</td>
                            <td><button onClick={ () => { this.draw() } }>{ (this.state.drawPile.length === 0)?"X":"DRAW" }</button></td>
                        </tr>
                        <tr>
                            <td>{ this.getStackCount(1) }</td>
                            <td>{ this.buildStackButton(1) }</td>
                            <td>
                                <button className={(this.state.from === -1) ? "from" : undefined} onClick={() => {
                                    this.selectOrMove(-1);
                                }}>{(this.state.hand.length > 0)?this.reduceChain(this.state.hand):((this.state.discard.length > 0)?this.state.discard[this.state.discard.length - 1]:"X")}</button>
                            </td>
                        </tr>
                        <tr>
                            <td>{ this.getStackCount(2) }</td>
                            <td>{ this.buildStackButton(2) }</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{ this.getStackCount(3) }</td>
                            <td>{ this.buildStackButton(3) }</td>
                            <td>{ this.buildGoalButton('S') }</td>
                        </tr>
                        <tr>
                            <td>{ this.getStackCount(4) }</td>
                            <td>{ this.buildStackButton(4) }</td>
                            <td>{ this.buildGoalButton('H') }</td>
                        </tr>
                        <tr>
                            <td>{ this.getStackCount(5) }</td>
                            <td>{ this.buildStackButton(5) }</td>
                            <td>{ this.buildGoalButton('C') }</td>
                        </tr>
                        <tr>
                            <td>{ this.getStackCount(6) }</td>
                            <td>{ this.buildStackButton(6) }</td>
                            <td>{ this.buildGoalButton('D') }</td>
                        </tr>
                    </tbody>
                </table>
            </>;
        }
    }
});