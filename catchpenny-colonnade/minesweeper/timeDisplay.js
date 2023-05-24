namespace('minesweeper.TimeDisplay',{
    "minesweeper.DigitalDisplay":"DigitalDisplay"
},({ DigitalDisplay }) => {
    const interval = 700;
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                digitCount: props.digitCount,
                startTime: Math.floor(props.startTime/1000),
                timeDiff: 0,
            }
        }
        componentDidUpdate() {
          this.afterRender();
        }
        componentDidMount(){
          this.afterRender();
        }
        afterRender() {
            setTimeout(() => {
                this.setState({ timeDiff: Math.floor(Date.now()/1000) - this.state.startTime });
            }, interval);
        }
        render() {
            return <DigitalDisplay value={this.state.timeDiff} digitCount={this.state.digitCount}></DigitalDisplay>;
        }
    }
});