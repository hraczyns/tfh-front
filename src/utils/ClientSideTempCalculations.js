const ClientSideTempCalculations = () => {
    const parseDiscount = (discountName) => {
        if (discountName !== '') {
            if (discountName === 'student') {
                return 50;
            } else if (discountName === 'veteran') {
                return 90;
            }
        } else {
            return 0;
        }
        return 0;
    }

    return {
        getPriceAfterDiscount: (initPrice, discountName) => {
            const init = parseFloat(initPrice);
            let discount = parseDiscount(discountName);
            return (init * (100.0 - discount) / 100.0).toFixed(2);
        },
        getSumForPassenger: (prices, discountName) => {
            let discount = parseDiscount(discountName);
            let total = prices
                .map(price => parseFloat(price))
                .reduce((temp, price) => temp + price, 0);
            return (total * (100.0 - discount) / 100.0).toFixed(2);
        },
        sum: prices => prices
            .map(price => parseFloat(price))
            .reduce((temp, price) => temp + price, 0).toFixed(2)
    }
}

export default ClientSideTempCalculations;