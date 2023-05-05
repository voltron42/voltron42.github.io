namespace("tabs.TabsDemo",{
    "tabs.Tabs":"Tabs"
}, ({ Tabs }) => {
    const tabConfigs = {
        buttonGroupClass:"d-flex justify-content-center",
        buttonClass:"btn",
        activeButtonClass:"btn-secondary",
        inactiveButtonClass:"btn-primary",
    };
    const suits = "Hearts,Spades,Clubs,Diamonds".split(",");
    const SuitSelect = class extends React.Component {
        constructor(props) {
            super(props);
            this.state = props.onFocusGetter();
            props.setOnBlurGetter(() => this.state);
        }
        render() {
            return <div>
                <select value={this.state.rank}  onChange={(e) => this.setState({ suit: e.target.value })}>
                    { suits.map((suit) => {
                        return <option value={suit}>{suit}</option>
                    })}
                </select>
            </div>;
        }
    };
    const ranks = "Ace,Deuce,Three,Four,Five,Six,Seven,Eight,Nine,Ten,Jack,Queen,King".split(",");
    const RankSelect = class extends React.Component {
        constructor(props) {
            super(props);
            this.state = props.onFocusGetter();
            props.setOnBlurGetter(() => this.state);
        }
        render() {
            return <div>
                <select value={this.state.rank} onChange={(e) => this.setState({ rank: e.target.value })}>
                    { ranks.map((rank) => {
                        return <option value={rank}>{rank}</option>
                    })}
                </select>
            </div>;
        }
    };
    const CardDisplay = class extends React.Component {
        constructor(props) {
            super(props);
            this.state = props.onFocusGetter();
            props.setOnBlurGetter(() => this.state);
        }
        render() {
            return <div>
                <h1>{this.state.rank} of {this.state.suit}</h1>
            </div>;
        }
    };
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                rank: "Ace",
                suit: "Spades"
            };
            this.tabs = [{
                label: "Display Card",
                TemplateClass: CardDisplay
            },{
                label: "Select Suit",
                TemplateClass: SuitSelect
            },{
                label: "Select Rank",
                TemplateClass: RankSelect
            }]
        }
        render() {
            return <>
                <h1 className="text-center">Tab Demo</h1>
                <Tabs tabs={this.tabs} onFocusGetter={() => this.state} onBlur={(state) => { this.setState(state) }} configs={tabConfigs}></Tabs>
            </>;
        }
    }
});