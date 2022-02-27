export const MapLightBoxSection = ({mainClassName, initStyle, route, chosen, onClick, onDateChange}) => (
    <section className={mainClassName} style={initStyle}>
        <div className={"findermap__results-element"}>
            <p>From: </p>
            <b>{route.filter(({id}) => id === chosen.from)[0].name}</b>
        </div>
        <div className={"findermap__results-element"}>
            <>To:</>
            <b>{route.filter(({id}) => id === chosen.to)[0].name}</b>
        </div>
        <div className={"findermap__results-element"}>
            <p>Date: </p>
            <input className="findermap__results-element-date" type={"datetime-local"}
                   onChange={e => onDateChange(e)}/>
        </div>
        <button className={"findermap__results-button"} onClick={onClick}>Find route</button>
    </section>
)