import restService from "../RestService";

const PriceService = {
    getPriceWithDiscount: (price, discount, onSuccess) => {
        restService.get('api/payment/calculation_with_discount?price=' + price + "&discount=" + discount, onSuccess);
    }
}

export default PriceService;