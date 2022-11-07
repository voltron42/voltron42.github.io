namespace("Core", ["Modal","Dialog"],({Modal,Dialog}) => {
    return function() {
        const [label, setLabel] = React.useState("");
        const dialog = new Dialog("Modal",Modal,(value) => {
            if (value) {
                setLabel(value);
            }
        });
        return <>
            <h2>{label}</h2>
            <button onClick={ () => dialog.open(label) }>Set Label</button>
        </>;
    }
})