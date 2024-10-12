namespace("word-scapes.WordScapes", {
  "gizmo-atheneum.namespaces.Ajax": "Ajax"
}, ({ Ajax }) => {
  const wordsURL = "https://raw.githubusercontent.com/dwyl/english-words/master/words.txt";
  const buildPredicate = function(letters, pattern) {
    if (pattern.length === 0) {
      return function(word) {
        return word.split("").reduce((pred,l) => pred && letters.indexOf(l) >= 0, true);
      };
    } else {
      return function(word) {
        return word.length === pattern.length && pattern.split("").reduce((pred,l,i) => pred && ((l === "-")?(letters.indexOf(word.charAt(i)) >= 0):(word.charAt(i) === l)), true);
      };
    }
  };
  const getNext = function(first, words, predicate) {
    for (let i = first; i < words.length; i++) {
      if (predicate(words[i])) return i;
    }
  }
  const isValidIndex = function(i, list) {
    return !isNaN(i) && i < list.length;
  }
  const buildList = function(first, limit, words, letters, pattern) {
    const predicate = buildPredicate(letters, pattern);
    const list = [];
    let i = first;
    while (isValidIndex(i, words) && list.length < limit) {
      i = getNext(i, words, predicate);
      if (isValidIndex(i, words)) {
        list.push(i);
        i++;
      }
    }
    let next = undefined;
    if (list.length === limit) {
      next = getNext(i, words, predicate);
    }
    return { list, next };
  }
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
      if (letters.length === 0) {
        this.setState({ limit, letters, pattern, list: [], next: undefined });
      } else {
        const { list, next } = buildList(0, limit, this.state.words, letters, pattern);
        this.setState({ limit, letters, pattern, list, next });
      }
    }
    showMore() {
      const { list: list0, next: next0, limit, words, letters, pattern } = this.state;
      const { list: list1, next } = buildList(next0 + 1, limit - 1, words, letters, pattern);
      const list = list0.concat([next0].concat(list1));
      this.setState({ limit, letters, pattern, list, next });
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
              <h2 className="text-center">Word Scapes Helper</h2>
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
              <p>How many words to return at a time</p>
              <div className="input-group mb-3">
                <span className="input-group-text">Limit</span>
                <input type="number" className="form-control" value={this.state.limit} onChange={(e) => {
                  this.setLimit(parseInt(e.target.value));
                }}/>
              </div>
              <div className="border border-2 rounded m-3 p-2 text-center">
                <code className="text-light">{ this.state.list.map((index) => this.state.words[index]).join(", ") }</code>
              </div>
              { this.state.next && <div>
                  <button className="btn btn-primary" onClick={() => this.showMore()}>Show More</button>
                </div>}
            </div>
          </div>
        </>}
      </>;
    }
  }
});