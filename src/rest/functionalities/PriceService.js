import restService from "../RestService";

const URL_ESTIMATION = "/api/payment/estimation";
const URL_CALC_WITH_DISCOUNT = "/api/payment/calculation_with_discount";

const PriceService = {
    getPriceWithDiscount: (price, discount, onSuccess) => {
        return restService.get(URL_CALC_WITH_DISCOUNT + '?price=' + price + "&discount=" + discount, onSuccess);
    },
    getEstimatedPrice: (params) => {
        return restService.get(URL_ESTIMATION + '?ids=' + params);
    }
}

export default PriceService;