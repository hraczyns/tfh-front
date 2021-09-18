import ReservationService from "../rest/functionalities/ReservationService";

const Payment = ({history}) => {
    const submit = () => {
        const parsed = JSON.parse(sessionStorage.getItem(history.location.state));
        ReservationService.prepareAndSaveReservation(parsed);
    }

    return <div>
        Nothing here yet
        <button onClick={submit}>Submit!</button>
    </div>
}

export default Payment;