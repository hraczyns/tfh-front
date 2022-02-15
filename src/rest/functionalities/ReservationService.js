import restService from "../RestService";
import ReservationAndPaymentUtil from "../../utils/ReservationAndPaymentUtil";

const GET_ALL_DISCOUNTS = '/api/reservations/discounts/all';
const ADD_RESERVATION = '/api/reservations'

const ReservationService = {
    getPossibleDiscounts: (onSuccess) => {
        return restService.get(GET_ALL_DISCOUNTS, onSuccess);
    },
    prepareAndSaveReservation: object => {
        const objectToSend = prepareReservation(object)
        return restService.post(ADD_RESERVATION, objectToSend);
    },
    prepareReservation: object => {
        return prepareReservation(object);
    }
}

const prepareReservation = object => {
    if (!object || !object.passengers || !object.route) {
        alert("Bad")
        throw new Error("");
    }
    return ReservationAndPaymentUtil.prepareReservationObject(object.route, object.passengers);
}

export default ReservationService;