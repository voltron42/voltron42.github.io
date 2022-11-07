namespace("Modal",() => {
    return function(props) {
        const [label, setLabel] = React.useState("");
        props.setOnOpen(setLabel);
        return <>
            <input value={label} onChange={ (e) => setLabel(e.target.value) }/>
            <button onClick={ () => props.onClose(label) }>Confirm</button>
            <button onClick={ () => props.onClose() }>Cancel</button>
        </>;
    }
})