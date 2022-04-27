import restService from "../RestService";

const timetableService = {
    getTimetable: (cityId, startTime, endTime, pageNumber, resultPerPage) => {
        return restService.get(`/api/information/timetable/city?id=${cityId}&startTime=${startTime}&endTime=${endTime}&page=${pageNumber}&results=${resultPerPage}`);
    },
    getTripInfo: (tripId) => {
        return restService.get('/api/trips/' + tripId);
    },
    getTrainDetails: (trainId) => {
        return restService.get('/api/trains/' + trainId);
    },
    getTripsByTrainId: (trainId) => {
        return restService.get('/api/trips?train_id=' + trainId);
    }
}

export default timetableService;