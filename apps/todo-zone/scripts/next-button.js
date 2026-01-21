namespace("todo-zone.NextButton", {}, () => {
  return function(props) {
    return <svg width="100%" height="100%" viewBox="0 0 100 100">
      <a href="#" onClick={() => props.onClick() }>
        <g>
          <circle cx="50" cy="50" r="48" stroke="black" fill="green"/>
        </g>
      </a>
    </svg>;
  }
});