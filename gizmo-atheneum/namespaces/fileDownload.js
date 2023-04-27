namespace('gizmo-atheneum.namespaces.FileDownload',{
}, ({ }) => {
    const normalizeFilename = function (filename, ext, defaultFilename) {
        filename = filename || defaultFilename;
        if (filename.endsWith(ext)) {
            filename = filename.replace(ext, '');
        }
        filename = encodeURIComponent(filename);
        if (filename.length === 0) {
            return defaultFilename;
        }
        return filename + ext;
    };
    const triggerJSONDownload = function (fileName, defaultFilename, jsonData) {
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(jsonData));
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('href', dataStr);
        link.setAttribute(
            'download',
            normalizeFilename(fileName, '.json', defaultFilename)
        );
        link.click();
        document.body.removeChild(link);
    };
    const triggerPNGDownload = function (fileName, defaultFilename, imageURL) {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('href', imageURL);
        link.setAttribute(
            'download',
            normalizeFilename(fileName, '.png', defaultFilename));
        link.click();
        document.body.removeChild(link);
    };
    const FileDownload = class extends React.Component {
        constructor(props) {
          super(props);
          this.onClose = props.onClose;
          this.state = {};
          props.setOnOpen((state) => {
            this.setState(state);
          });
        }
        render() {
          return (
            <>
              <p>Feel free to enter a filename</p>
              <div className="form-group">
                <label className="text-light" htmlFor={this.state.fieldId}>
                  Filename
                </label>
                <input
                  type="text"
                  className="form-control rpg-textbox"
                  id={this.state.fieldId}
                  placeholder={this.state.placeholder}
                  value={this.state.filename}
                  onChange={(e) => this.setState({ filename: e.target.value })}
                />
              </div>
              { this.state.isImage && <img src={this.state.imageURL}/> }
              <div className="justify-content-end">
                <button
                  className="btn btn-info"
                  onClick={() => {
                    if (this.state.isImage) {
                      triggerPNGDownload(this.state.filename,this.state.defaultFilename,this.state.imageURL);
                    } else {
                      triggerJSONDownload(this.state.filename,this.state.defaultFilename,this.state.jsonData);
                    }
                    this.onClose();
                  }}>Download & Close</button>
                <button className="btn btn-danger" onClick={() => { this.onClose(); }}>Close</button>
              </div>
            </>
          );
        }
      };
      FileDownload.triggerJSONDownload = triggerJSONDownload;
      FileDownload.triggerPNGDownload = triggerPNGDownload;
      return FileDownload
    }
  );