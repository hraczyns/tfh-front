import {useEffect, useState} from "react";
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
                console.log(reservations);
                setReservations(reservations?._embedded?.reservationDtoList || []);
            } catch (e) {
            }
        })();
    }, [passengerId]);

    const prepareData = () => reservations.map(reservation => reservationsMapper.mapToTableData(reservation, history));

    return <article className={"reservation-table reservation-main"}>
        <Table columns={RESERVATIONS_WHEN_LOGGED} data={prepareData()}/>
    </article>
}

export default ReservationTable;