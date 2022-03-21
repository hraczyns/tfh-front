import restService from "../RestService";
import RestServiceMode from "../RestServiceMode";


const paymentService = {
    createPaymentIntent: (body) => {
        return restService.post('/api/payment/create-payment-intent', body);
    },
    getContentIfPaymentSuccessful: (paymentId) => {
        return restService.get('/api/reservations/' + paymentId + '/content', RestServiceMode.PURE_RESPONSE);
    },
    getReservationIdentifierAndFirstMailByPaymentId: (paymentId) => {
        return restService.get('/api/payment/shortResponse/reservations?paymentId=' + paymentId);
    }
}

export default paymentService;