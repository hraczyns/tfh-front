import restService from "../RestService";

const paymentService = {
    createPaymentIntent: (body) => {
        return restService.post('/api/payment/create-payment-intent', body);
    },
    getContentIfPaymentSuccessful: (paymentIntentId) => {
        return restService.get('/api/reservations/' + paymentIntentId + '/content');
    }
}

export default paymentService;