namespace("todo-zone.BreakButton", {}, () => {
  return function(props) {
    return <svg width="100%" height="100%" viewBox="0 0 100 100">
      <a href="#" onClick={() => props.onClick() }>
        <g>
          <circle cx="50" cy="50" r="48" stroke="black" fill="red" stroke-width="1"/>
          <rect x="20" y="20" height="60" width="25" fill="black"/>
          <rect x="60" y="20" height="60" width="25" fill="black"/>
        </g>
      </a>
    </svg>;
  }
});