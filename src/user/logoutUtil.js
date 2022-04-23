import userService from "../rest/functionalities/UserService";
import Cookies from "js-cookie";

export const logout = async () => {
    try {
        await userService.logout();
        Cookies.remove("cookieSignature");
        Cookies.remove("cookieHeaderPayload");
        localStorage.removeItem("fastGetUser");
    } catch (e) {
        console.log(e);
    }
}