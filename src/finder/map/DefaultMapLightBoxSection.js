export const DefaultMapLightBoxSection = ({mainClassName, initStyle}) => (
    <section className={mainClassName} style={initStyle}>
        <div className={"findermap__results-element"}>
            <p>From: </p>
            <br/>
        </div>
        <div className={"findermap__results-element"}>
            <p>To:</p>
        </div>
        <div className={"findermap__results-element"}>
            <p>Date: </p>
            <input className="findermap__results-element-date" type={"datetime-local"}/>
        </div>
        <button className={"findermap__results-button"} disabled>Find route</button>
    </section>
);