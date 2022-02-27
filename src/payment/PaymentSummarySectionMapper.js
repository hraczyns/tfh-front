const paymentSummarySectionMapper = {
    mapToRouteContent: route => {
        if (Array.isArray(route) && route.length === 2) {
            const start = route[0].cityDto.name;
            const end = route[1].cityDto.name;
            const departureTime = route[0].departureTime;
            const arrivalTime = route[1].arrivalTime;
            return {
                start: start,
                end: end,
                departureTime: departureTime,
                arrivalTime: arrivalTime
            }
        }
    }
}

export default paymentSummarySectionMapper;