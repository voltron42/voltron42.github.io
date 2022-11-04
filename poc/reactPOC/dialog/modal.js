namespace("Modal",() => {
    return function(props) {
        const [label, setLabel] = React.useState("");
        props.dialog.setGetter(value => setLabel(value))
        return <>
            <input value={label} onChange={ (e) => setLabel(e.target.value) }/>
            <button onClick={ () => props.dialog.close(label) }>Confirm</button>
            <button onClick={ () => props.dialog.close() }>Cancel</button>
        </>;
    }
})