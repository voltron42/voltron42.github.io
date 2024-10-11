namespace("circle-words.CircleWords", {
  "gizmo-atheneum.namespaces.Ajax": "Ajax"
}, ({ Ajax }) => {
  const wordsURL = "https://raw.githubusercontent.com/dwyl/english-words/master/words.txt";
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        limit: 10,
        letters: "",
        pattern: "",
        list: []
      };
    }
    componentDidMount() {
      this.afterRender();
    }
    componentDidUpdate() {
      this.afterRender();
    }
    afterRender() {
      console.log({ state: this.state });
      if (!this.state.words) {
        Ajax.get(wordsURL, {
          success:(responseText) => {
            console.log({ responseText });
            this.setState({ words: responseText.split("\n") });
          },
          failure:(resp) => {
            console.log(resp);
            throw resp;
          }
        })
      }
    }
    generateList(limit, letters, pattern) {
      // todo - limit response per limit
      if (letters.length === 0) {
        this.setState({ limit, letters, pattern, list: [] });
      } else if (pattern.length === 0) {
        const list = this.state.words.filter(word => {
          return word.split("").reduce((pred,l) => pred && letters.indexOf(l) >= 0, true);
        });
        this.setState({ limit, letters, pattern, list });
      } else {
        const list = this.state.words.filter(word => {
          return pattern.split("").reduce((pred,l,i) => pred && ((l === "-")?(letters.indexOf(word.charAt(i)) >= 0):(word.charAt(i) === l)), true);
        });
        this.setState({ limit, letters, pattern, list });
      }
    }
    setLimit(limit) {
      this.generateList(limit, this.state.letters, this.state.pattern);
    }
    setLetters(letters) {
      this.generateList(this.state.limit, letters, this.state.pattern);
    }
    setPattern(pattern) {
      this.generateList(this.state.limit, this.state.letters, pattern);
    }
    render() {
      return <>
        { this.state.words && Array.isArray(this.state.words) && this.state.words.length > 0 && <>
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column justify-content-center">
              <h2>Circle Words Helper</h2>
              <p>Say how many words to return</p>
              <div className="input-group mb-3">
                <span className="input-group-text">Limit</span>
                <input type="number" className="form-control" value={this.state.limit} onChange={(e) => {
                  this.setLimit(parseInt(e.target.value));
                }}/>
              </div>
              <p>List the letters in question</p>
              <div className="input-group mb-3">
                <span className="input-group-text">Letters</span>
                <input type="text" className="form-control" value={this.state.letters} onChange={(e) => {
                  this.setLetters(e.target.value);
                }}/>
              </div>
              <p>To look for a particular word, enter the pattern of the word, using hyphens for blank spaces.</p>
              <div className="input-group mb-3">
                <span className="input-group-text">Pattern</span>
                <input type="text" className="form-control" value={this.state.pattern} onChange={(e) => {
                  this.setPattern(e.target.value);
                }}/>
              </div>
              <ul>
                { this.state.list.map((word,i) => <li key={`word${i}`}>{word}</li>) }
              </ul>
            </div>
          </div>
        </>}
      </>;
    }
  }
});