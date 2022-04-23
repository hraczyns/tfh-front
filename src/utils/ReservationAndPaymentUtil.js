const ReservationAndPaymentUtil = {
    prepareReservationObject: (route, passengers, existingUsers) => {
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

        existingUsers?.forEach(({userId, discount}) => object.idPassengersWithDiscounts.push({
            passengerId : userId,
            discountCode: discount ? discount.charAt(0).toUpperCase() : "",
        }));

        route.forEach(part => {
            object.reservedRoute.push(part.additionalData.localStartStopTimeId);
            object.reservedRoute.push(part.additionalData.localEndStopTimeId);
        })

        return object;
    }
}

export default ReservationAndPaymentUtil;