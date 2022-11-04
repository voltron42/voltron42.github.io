namespace("Core",() => {
    return function(props) {
        const [label, setLabel] = React.useState("");
        props.modals.myModal.setSetter(value => setLabel(value));
        return <>
            <h2>{label}</h2>
            <button onClick={ () => props.modals.myModal.open(label) }>Set Label</button>
        </>;
    }
})