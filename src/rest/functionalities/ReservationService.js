import restService from "../RestService";
import ReservationObjectCreator from "../../utils/ReservationObjectCreator";

const GET_ALL_DISCOUNTS = '/api/reservations/discounts/all';
const ADD_RESERVATION = '/api/reservations'

const ReservationService = {
    getPossibleDiscounts: (onSuccess) => {
        return restService.get(GET_ALL_DISCOUNTS, onSuccess);
    },
    prepareAndSaveReservation: object => {
        if (!object || !object.passengers || !object.route) {
            alert("Bad")
            throw new Error("");
        }
        const objectToSend = ReservationObjectCreator.prepare(object.route, object.passengers);

        restService.post(ADD_RESERVATION, json => alert('cool!'), e => alert('gnoj'), objectToSend);
    }
}

export default ReservationService;