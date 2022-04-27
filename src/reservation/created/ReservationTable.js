import {useEffect, useMemo, useState} from "react";
import reservationService from "../../rest/functionalities/ReservationService";
import Table from "../../table/Table";
import {RESERVATIONS_WHEN_LOGGED} from "../../table/TableColumnsConst";
import reservationsMapper from "./ReservationsMapper";
import './reservation.css';
import {useHistory} from "react-router-dom";

const ReservationTable = ({passengerId}) => {
    const history = useHistory();
    const [reservations, setReservations] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const reservations = await reservationService.getReservationsById(passengerId);
                setReservations(reservations?._embedded?.reservationDtoList || []);
            } catch (e) {
            }
        })();
    }, [passengerId]);

    const preparedData = useMemo(() => reservations.map(reservation => reservationsMapper.mapToTableData(reservation, history)), [history, reservations]);

    return <article className={"reservation-table reservation-main"}>
        <Table columns={RESERVATIONS_WHEN_LOGGED} data={preparedData}/>
    </article>
}

export default ReservationTable;