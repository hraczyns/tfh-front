import './routekeeper.css'
import ClientSideTempCalculations from '../utils/ClientSideTempCalculations'

const RouteResultsElement = ({
                                 startCity,
                                 endCity,
                                 trainModel,
                                 trainName,
                                 trainUnique,
                                 price,
                                 arrivalTime,
                                 departureTime,
                                 setNonBottomFromLast,
                                 passengers
                             }) => {
    let className = "routekeeper__details";
    if (setNonBottomFromLast) {
        className = "routekeeper__details routekeeper__details-not-line"
    }
    let time = '';
    if (arrivalTime && departureTime) {
        time = (
            <>
                <div className={"routekeeper__details-element"}>
                    <div>{'Arrival time: '}</div>
                    <div>{' ' + arrivalTime}</div>
                </div>
                <div className={"routekeeper__details-element"}>
                    <div>{'Departure time: '}</div>
                    <div>{' ' + departureTime}</div>
                </div>
            </>
        )
        ;
    }

    const getDiscountedPriceDiv = passenger => {
        return <div>
            <span className={"routekeeper__crossed-line"}>{price} zl </span>
            {ClientSideTempCalculations().getPriceAfterDiscount(price, passenger?.discount?.value)} zl
        </div>
    }

    let priceLabel = 'Price: ';
    let prices = <div className={"routekeeper__details-element"}>
        <div>{priceLabel}</div>
        <div>
            {passengers && passengers[0]?.discount?.value !== '' ? getDiscountedPriceDiv(passengers[0]) : `${price} zl`}
        </div>
    </div>;

    if (passengers && passengers.length > 1) {

        prices = [<div className={"routekeeper__details-element"} key={Math.random()}>
            <div>{priceLabel}</div>
            <div/>
        </div>];
        for (let i = 0; i < passengers.length; i++) {
            const passenger = passengers[i];
            let person = passenger.name?.value + ' ' + passenger.surname?.value;
            if (!person.trim()) {
                person = 'Person n.' + (i + 1);
            }
            const element = <div key={i}
                                 className={"routekeeper__details-element routekeeper__details-element--priceElement"}>
                <div>{person}</div>
                <div>
                    {passenger.discount?.value !== '' ? getDiscountedPriceDiv(passenger) : `${price} zl`}
                </div>
            </div>
            prices.push(element);
        }
    }

    return <article className={className} key={`${startCity} - ${endCity} `}>
        <div className={"routekeeper__details-element"}>
            {`${startCity} - ${endCity} `}
        </div>
        {time}
        <div className={"routekeeper__details-element"}>
            <div>{'Train: '}</div>
            <div>{' ' + trainName}</div>
        </div>
        <div className={"routekeeper__details-element"}>
            <div>{'Train unique name: '}</div>
            <div>{' ' + trainUnique}</div>
        </div>
        <div className={"routekeeper__details-element"}>
            <div>{'Train class: '}</div>
            <div>{' ' + trainModel}</div>
        </div>
        {prices}
        <div/>
    </article>
}

export default RouteResultsElement;