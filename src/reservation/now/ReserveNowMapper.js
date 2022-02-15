export const reserveNowMapper = {
    mapToRouteContent: (fragmentOfTableContent) => {
        return {
            startCity: fragmentOfTableContent.result.start,
            endCity: fragmentOfTableContent.result.end,
            arrivalTime: fragmentOfTableContent.result.arrivalTime,
            departureTime: fragmentOfTableContent.result.departureTime,
            trainName: fragmentOfTableContent.additionalData.trainName,
            trainModel: fragmentOfTableContent.additionalData.trainModel,
            price: fragmentOfTableContent.price
        }
    }
}