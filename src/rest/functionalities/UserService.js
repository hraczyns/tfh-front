import restService from "../RestService";
import RestServiceMode from "../RestServiceMode";

const userService = {
    sendSignUpRequest: (name, surname, username, password) => {
        const object = {
            name: name,
            surname: surname,
            username: username,
            password: password
        }
        return restService.post('/api/register', object, RestServiceMode.TEXT);
    },
    verifyAccount: (token) => {
        return restService.post('/api/verification-token?token=' + token);
    },
    login: (username, password) => {
        const object = {
            username: username,
            password: password,
        };
        return restService.post('/api/login', object, RestServiceMode.TEXT, true);
    },
    authCheck: () => {
        return restService.get("/api/auth/check");
    },
    logout: () => {
        return restService.get("/api/logout", RestServiceMode.TEXT);
    },
}

export default userService;