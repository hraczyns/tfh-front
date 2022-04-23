import restService from "../RestService";
import ReservationAndPaymentUtil from "../../utils/ReservationAndPaymentUtil";
import RestServiceMode from "../RestServiceMode";

const GET_ALL_DISCOUNTS = '/api/reservations/discounts/all';
const ADD_RESERVATION = '/api/reservations';
const GET_RESERVATION = '/api/reservations';
const GET_RESERVATION_TICKET = '/api/reservations/content';
const GET_RESERVATION_PASSENGER_ID = '/api/reservations';

const reservationService = {
    getPossibleDiscounts: (onSuccess) => {
        return restService.get(GET_ALL_DISCOUNTS, onSuccess);
    },
    prepareAndSaveReservation: object => {
        const objectToSend = prepareReservation(object);
        return restService.post(ADD_RESERVATION, objectToSend);
    },
    prepareReservation: object => {
        return prepareReservation(object);
    },
    getReservationByIdentifierAndEmail: (identifier, email) => {
        return restService.get(GET_RESERVATION + "?identifier=" + identifier + "&email=" + email);
    },
    getContentByReservationIdentifierAndEmail: (identifier, email) => {
        return restService.get(GET_RESERVATION_TICKET + "?identifier=" + identifier + "&email=" + email, RestServiceMode.PURE_RESPONSE);
    },
    getReservationsById: (passId) => {
        return restService.get(GET_RESERVATION_PASSENGER_ID + "/passengers/" + passId);
    }
}

const prepareReservation = object => {
    if (!object || !object.passengers || !object.route) {
        throw new Error("Internal error");
    }
    return ReservationAndPaymentUtil.prepareReservationObject(object.route, object.passengers, object.existingUsers);
}

export default reservationService;