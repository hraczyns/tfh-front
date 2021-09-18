const ReservationObjectCreator = {
    // for now the first passenger is that registered
    prepare: (route, passengers) => {
        const object = {
            idPassengersWithDiscounts: [],
            passengerNotRegisteredSet: [],
            reservedRoute: [],

        }
        //check if someone is logged in...

        //here another action
        passengers.forEach(pass => {
            object.passengerNotRegisteredSet.push({
                discountCode: pass.discount ? pass.discount.charAt(0).toUpperCase() : "",
                name: pass.name,
                surname: pass.surname,
            })
        });

        route.forEach(part => {
            object.reservedRoute.push(part.additionalData.localStartStopTimeId);
            object.reservedRoute.push(part.additionalData.localEndStopTimeId);
        })

        return object;

    }
}

export default ReservationObjectCreator;