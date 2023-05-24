namespace("minesweeper.Settings",{},() => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = { 
                width: 0, 
                height: 0, 
                count: 0
            };
            this.onClose = props.onClose;
            props.setOnOpen(({ width, height, count }) => {
                this.setState({ width, height, count })
            });
        }
        input(label,field) {
            return <div className="input-group">
                <label htmlFor={field} className="input-group-text">{label}</label>
                <input
                    id={field}
                    type="number"
                    className="form-control"
                    min={1}
                    style={{width: "2em"}}
                    value={ this.state[field] }
                    onChange={(e) => {
                        const update = {};
                        update[field] = e.target.value;
                        this.setState(update);
                    }}
                />
            </div>;
        }
        render() {
            return <div className="d-flex flex-column">
                { this.input('width',"Width:") }
                { this.input('height',"Height:") }
                { this.input('count',"conunt:") }
                <div className="d-flex justify-content-end">
                    <button className="btn btn-success" onClick={() => { this.onClose(this.state); }}>Confirm</button>
                    <button className="btn btn-danger" onClick={() => { this.onClose(); }}>Cancel</button>
                </div>
            </div>;
        }
    }
})