import './ticket.css';
import React from "react";

const getTicketStatusText = isDone => {
    return isDone ? 'AVAILABLE' : 'PROCESSING';
}

const TicketSection = React.forwardRef(({isDone}, ref) => {
    return <section className={"ticket-wrapper"}>
        <div className={"ticket-text"}>Click below to download your ticket. Your ticket is
            now {getTicketStatusText(isDone )}</div>
        <button onClick={() => ref?.current?.click()}
                className={"ticket"} disabled={!isDone}>Download
        </button>
    </section>
});

export default TicketSection;