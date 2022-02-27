const ReservationAndPaymentUtil = {
    prepareReservationObject: (route, passengers) => {
        const object = {
            idPassengersWithDiscounts: [],
            passengerNotRegisteredList: [],
            reservedRoute: [],

        }
        passengers.forEach(pass => {
            object.passengerNotRegisteredList.push({
                discountCode: pass.discount ? pass.discount.charAt(0).toUpperCase() : "",
                name: pass.name,
                surname: pass.surname,
                email: pass.email,
            })
        });

        route.forEach(part => {
            object.reservedRoute.push(part.additionalData.localStartStopTimeId);
            object.reservedRoute.push(part.additionalData.localEndStopTimeId);
        })

        return object;

    },
    prepareRoute: route => {
        return prepareRoute(route);
    }
}
const prepareRoute = route => {
    const result = [];
    route.forEach(part => {
        result.push(part.additionalData.localStartStopTimeId);
        result.push(part.additionalData.localEndStopTimeId);
    })
    return result;
}


export default ReservationAndPaymentUtil;