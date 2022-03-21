import TicketSection from "../../ticket/TicketSection";

const Reservation = ({identifier, routeMain, dateMain, routeTable, passengersTable, ticket: {ref, isDone}}) => {
    return <main className={"reservation-page-wrapper"}>
        <section className={"reservation-panel"}>
            <article className={"reservation-header"}>
                <header className={"reservation-header-identifier"}>Reservation <span>{identifier}</span></header>
                <div className={"reservation-header-route-main"}>
                    {routeMain?.source} - {routeMain?.destination}
                </div>
                <div className={"reservation-header-route-date"}>
                    {dateMain?.source} - {dateMain?.destination}
                </div>
            </article>
            <article className={"reservation-main"}>
                <section className={"reservation-main-routes"}>
                    {routeTable}
                </section>
                <section className={"reservation-main-passengers"}>
                    {passengersTable}
                </section>
                <TicketSection ref={ref} isDone={isDone}/>
            </article>
        </section>
    </main>
};

export default Reservation;