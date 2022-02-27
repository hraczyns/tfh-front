import paymentSummarySectionMapper from "./PaymentSummarySectionMapper";

const PaymentSummarySection = ({reservation: {route, passengersInfo,price}}) => {
    if (!route || !passengersInfo || !price) return <div/>

    const {start, end, departureTime, arrivalTime} = paymentSummarySectionMapper.mapToRouteContent(route)

    const getPassengers = () => {
        return passengersInfo.map((p, index) => (
            <div className={"payment-info__passenger-list"} key={index}>
                <div>{p?.nameAndSurname}</div>
                <div>{p?.discount || "NORMAL"} ticket</div>
            </div>)
        )
    }
    return <main>
        <section>
            <div><b>{start} - {end}</b></div>
            <div className={"payment-info__date"}>{departureTime} - {arrivalTime}</div>
        </section>
        <section className={"payment-info__passengers"}>{getPassengers()}</section>
        <section className={"payment-info__summary-price"}>
            <div>SUMMARY PRICE</div>
            <div>{price} zl</div>
        </section>
    </main>
}

export default PaymentSummarySection;