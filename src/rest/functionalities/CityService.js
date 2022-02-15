import restService from "../RestService";

const GET_ALL_URL = '/api/cities/all'

const CityService = {
    getAll: () => {
        return restService.get(GET_ALL_URL);
    }
}

export default CityService;