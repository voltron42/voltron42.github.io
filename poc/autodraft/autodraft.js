namespace("autodraft.AutoDraft",{
    "gizmo-atheneum.namespaces.LoadFile":"LoadFile",
    "autodraft.Diagrammer":"Diagrammer"
}, ({ LoadFile, Diagrammer }) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.canvas = document.getElementById(props.canvasId);
            this.state = {};
        }
        loadHealthCheck() {
            LoadFile(false, "text", (responseText, fileName) => {
                let json = JSON.parse(responseText);
                // todo
            }, (fileName, error) => {
                throw { fileName, error };
            });
        }
        render() {
            return <div className="d-flex flex-column">
                <div className="d-flex justify-content-center">
                    <button className="btn btn-success" onClick={() => this.loadHealthCheck()}>Load Health Check</button>
                </div>
                { this.state.healthCheck && <>
                    <div className="d-flex justify-content-center">
                        <div dangerouslySetInnerHTML={{ __html: this.state.svg }}>
                        </div>
                        <div >
                            <img alt="canvas image" src={this.state.canvasDataUrl}/>
                        </div>
                    </div>
                </>}
            </div>;
        }
    }
});