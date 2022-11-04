namespace("Cribbage",["GameLogic"],({ GameLogic }) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = GameLogic.buildInitState();
        }
        deal() {
            const { dealerHand, otherHand, topCard } = GameLogic.dealHands(GameLogic.shuffle(GameLogic.buildDeck()));
            const [ playerHand, cpuHand ] = (this.state.isCPUDealer) ? [ otherHand, dealerHand ] : [ dealerHand, otherHand ];
            this.setState({
                hands: { playerHand, cpuHand, topCard },
                status: "Pull Crib",
                cribIndicies: [],

            });
        }
        startNewGame() {
            this.deal();
        }
        selectForCrib(index) {
            const cribIndicies = Array.from(this.state.cribIndicies);
            const indexIndex = cribIndicies.indexOf(index);
            if (indexIndex >= 0) {
                cribIndicies.splice(indexIndex,1);
            } else {
                cribIndicies.push(indexIndex);
            }
            this.setState({ cribIndicies });
        }
        submitCrib() {
            const { playerHand, cribIndicies } = this.state;
            let { playerScore, cpuScore } = this.state;
            const [ playerScoreLog, cpuScoreLog ] = [ "playerScoreLog", "cpuScoreLog" ].map(f => Array.from(this.state[f]));
            const { cpuHand, cpuCrib } = GameLogic.submitCpuCrib(this.state.cpuHand);
            const crib = [].concat(cpuCrib,cribIndicies.map(i => playerHand[i]));
            const played = [{src:"Top Card",card:this.state.topCard}];
            if (GameLogic.isJack(this.state.topCard)) {
                if (this.state.isCPUDealer) {
                    [ cpuScore, cpuScoreLog ] = GameLogic.applyScoringEvent(cpuScore, cpuScoreLog, 2, "Top Card Is Jack", this.state.topCard);
                } else {
                    [ playerScore, playerScoreLog ] = GameLogic.applyScoringEvent(playerScore, playerScoreLog, 2, "Top Card Is Jack", this.state.topCard);
                }
            }
            if (this.state.isCPUDealer) {
                let cpuCard = GameLogic.cpuSelectCardToPlay(this.state.topCard, played, cpuHand);
                [ cpuScore, cpuScoreLog ] = GameLogic.scorePlay(played,cpuCard);


                played.push({ src: "cpu", card: cpuCard });
            }
            this.setState({
                cribIndicies: undefined,
                status: "Play Of The Hands",
                playerHand: playerHand.filter(c => crib.indexOf(c) < 0),
                played, crib, cpuHand, playerScore, playerScoreLog, cpuScore, cpuScoreLog
            });
        }
        play(playerHandIndex) {
            const { playerHand, cpuHand } = this.state;
            const [] = [ "playerScoreLog", "cpuScoreLog", "played"].map(k => Array.from(this.state[k]));
            const played = Array.from(this.state.played);
            // todo - play player card
            // check played for scoring
            // loop on play cpu, check score
            // if no remaining cpu, finish play and update state to "Scoring"
            const update = { played };
            this.setState(update);
        }
        render() {
            switch(this.state.status) {
                case undefined:
                    return <button onClick={ () => this.startNewGame() }>Start New Game</button>;
                case "Pull Crib":
                    return <table>
                        <tbody>
                            <tr>
                                { this.state.playerHand.map((card, index) => {
                                    return <td>
                                        <button onClick={ () => { this.selectForCrib(index) }}>
                                            <span className={
                                                GameLogic.getCardColor(card) + (( this.state.cribIndicies.indexOf(index) >= 0 )?" selected":"")
                                            }>{ card }</span>
                                        </button>
                                    </td>
                                })}
                            </tr>
                            <tr>
                                <td colSpan="6"><button disabled={ this.state.cribIndicies.length !== 2 } onClick={ () => { this.submitCrib() }}>Submit Crib</button></td>
                            </tr>
                        </tbody>
                    </table>;
                case "Play Of The Hands":
                    return <table>
                        <tbody>
                        <tr><td colSpan="9">{ this.state.cpuScoreLog }</td></tr>
                            <tr>
                                { this.state.played.map((play) => {
                                    return <td>{(play.src === 'cpu') && <span className={ GameLogic.getCardColor(play.card) }>{ play.card }</span>}</td>;
                                })}
                            </tr>
                            <tr>
                                <td>{ this.state.topCard }</td>
                            </tr>
                            <tr>
                                { this.state.played.map((play) => {
                                    return <td>{(play.src === 'player') && <span className={ GameLogic.getCardColor(play.card) }>{ play.card }</span>}</td>;
                                })}
                            </tr>
                            <tr>
                                <td colSpan="9">
                                    { this.state.playerHand.map((card,index) => {
                                        return <button disabled={ this.state.played.map(p => p.card).indexOf(card) >= 0 } onClick={ () => { this.play(index) }}>
                                            <span className={ GameLogic.getCardColor(card) }>{ card }</span>
                                        </button>
                                    })}
                                </td>
                            </tr>
                            <tr><td colSpan="9">{ this.state.playerScoreLog }</td></tr>
                        </tbody>
                    </table>;
                case "Scoring Hands":
                    return <></>;
                default:
                    const badStatus = this.state.status;
                    this.setState(GameLogic.buildInitState());
                    throw `Status "${badStatus}" is invalid. Resetting game.`;
            }
        }
    }
});