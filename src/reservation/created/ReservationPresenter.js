import {useEffect, useMemo, useRef, useState} from "react";
import reservationService from "../../rest/functionalities/ReservationService";
import Reservation from "./Reservation";
import Table from "../../table/Table";
import {PASSENGERS_COLUMNS, RESERVATION_COLUMNS} from "../../table/TableColumnsConst";
import {checkDate} from "../../utils/DateUtil";
import {addLinkToRef} from "../../utils/ResponseToFileConverter";
import NotFound from "../../utils/NotFound";

const getRouteMain = (reservedRoute) => ({
    source: reservedRoute[0].start.cityDto.name,
    destination: reservedRoute[reservedRoute.length - 1].end.cityDto.name
});

const getDateMain = (reservedRoute) => ({
    source: checkDate(reservedRoute[0].start.departureTime),
    destination: checkDate(reservedRoute[reservedRoute.length - 1].end.arrivalTime)
});

const getRouteTable = (reservedRoute) => {
    const data = [];
    for (let {start, end, train} of reservedRoute) {
        data.push({
            start: start.cityDto.name,
            end: end.cityDto.name,
            departureTime: checkDate(start.departureTime),
            arrivalTime: checkDate(end.arrivalTime),
            train: train.name,
            trainModel: train.model
        })
    }
    return <Table columns={RESERVATION_COLUMNS} data={data}/>
}

const getPassengersTable = (passengers, passengersNotRegistered, prices) => {
    const data = [];
    for (const {passenger: {name, surname}} of passengers) {
        const priceArray = prices.filter(price => price.name === name && price.surname === surname);
        if (priceArray.length > 0) {
            const {price, discount} = priceArray[0];
            data.push({
                name: name,
                surname: surname,
                price: price.toFixed(2),
                discount: discount || "-"
            });
        }
    }
    for (const {name, surname} of passengersNotRegistered) {
        const priceArray = prices.filter(price => price.name === name && price.surname === surname);
        if (priceArray.length > 0) {
            const {price, discount} = priceArray[0];
            data.push({
                name: name,
                surname: surname,
                price: price.toFixed(2),
                discount: discount || "-"
            });
        }
    }

    return <Table columns={PASSENGERS_COLUMNS} data={data}/>
}

const prepareParams = (reservation) => {
    const params = {
        identifier: "",
        routeMain: "",
        dateMain: "",
        routeTable: "",
        passengersTable: ""
    };

    if (!reservation) {
        return params;
    }
    params.identifier = reservation.identifier;
    params.routeMain = getRouteMain(reservation.reservedRoute);
    params.dateMain = getDateMain(reservation.reservedRoute);
    params.routeTable = getRouteTable(reservation.reservedRoute);
    params.passengersTable = getPassengersTable(reservation.passengers, reservation.passengerNotRegisteredList, reservation.pricesInDetails);
    return params;
}

const ReservationPresenter = ({history}) => {
    const [isDone, setDone] = useState(false);
    const [reservation, setReservation] = useState("");
    const anchorRef = useRef();

    const state = history?.location?.state;
    const identifierFromParams = state?.identifier;
    const emailFromParams = state?.email;

    useEffect(() => {
        let lookingForReservationFunction;
        (async () => {
            if (!identifierFromParams || !emailFromParams) {
                return;
            }
            try {
                const reservationResponse = await reservationService.getReservationByIdentifierAndEmail(identifierFromParams, emailFromParams);
                setReservation(reservationResponse);

                if (reservationResponse) {
                    lookingForReservationFunction = setInterval(() => {
                        (async () => {
                            try {
                                const response = await reservationService.getContentByReservationIdentifierAndEmail(identifierFromParams, emailFromParams);
                                const filename = response?.headers.get('Content-Disposition')?.split('filename=')[1];
                                if (!filename) {
                                    return;
                                } else {
                                    clearInterval(lookingForReservationFunction);
                                    setDone(true);
                                }
                                addLinkToRef(response, filename, anchorRef);
                            } catch (e) {
                            }
                        })();
                    }, 1000);
                    setTimeout(() => {
                        clearInterval(lookingForReservationFunction);
                    }, 6000);
                }
            } catch (e) {
            }
        })();
        return () => clearInterval(lookingForReservationFunction);

    }, [identifierFromParams, emailFromParams]);

    const {
        identifier,
        routeMain,
        dateMain,
        routeTable,
        passengersTable
    } = useMemo(() => prepareParams(reservation), [reservation]);

    const getReservation = () => {
        if (!identifier) {
            return <NotFound/>
        }
        return <Reservation identifier={identifier} routeMain={routeMain} dateMain={dateMain}
                            routeTable={routeTable}
                            passengersTable={passengersTable}
                            ticket={
                                {
                                    ref: anchorRef,
                                    isDone: isDone
                                }
                            }/>
    }

    return getReservation();
}

export default ReservationPresenter;
