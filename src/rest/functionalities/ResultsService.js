import restService from "../RestService";
import RestServiceMode from "../RestServiceMode";

const URL_RESULTS = "/api/search";
const URL_TRAIN_IMG = "/api/trains/images";

const resultsService = {
    findResults: (source, destination, startTime) => {
        return restService.get(`${URL_RESULTS}?source=${source}&destination=${destination}&startTime=${startTime}`);
    },
    findTrainImg: (trainId) => {
        return restService.get(`${URL_TRAIN_IMG}?train_id=${trainId}`, RestServiceMode.TEXT);
    }
}

export default resultsService;