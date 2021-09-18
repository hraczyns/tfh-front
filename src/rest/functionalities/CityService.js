import restService from "../RestService";

const GET_ALL_URL = '/api/cities/all'

const CityService = {
    getAll: (onSuccess, onError) => {
        restService.get(GET_ALL_URL, onSuccess);
    }
}

export default CityService;