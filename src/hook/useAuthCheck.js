import {useContext, useEffect, useState} from "react";
import userService from "../rest/functionalities/UserService";
import {UserContext} from "../context/UserContext";
import Cookies from "js-cookie";

const isPotentiallyLoggedIn = () => {
    return Cookies.get("cookieHeaderPayload");
}

export default function useAuthCheck() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const {setUser: setUserFromContext} = useContext(UserContext);
    useEffect(() => {
        if (!isPotentiallyLoggedIn()) {
            localStorage.removeItem("fastGetUser");
            return;
        }
        (async () => {
            try {
                const response = await userService.authCheck();
                if (response && response.username && response.role) {
                    console.log(response);
                    setUser(response.username);
                    setRole(response.role);
                    setUserFromContext(response.username);
                    localStorage.setItem("fastGetUser", response.username);
                }
            } catch (e) {
                localStorage.removeItem("fastGetUser");
                setUser(null);
                setRole(null);
                setUserFromContext(null);
                Cookies.remove("cookieSignature");
                Cookies.remove("cookieHeaderPayload");
            }
        })();
    }, [setUserFromContext]);
    return {
        user,
        setUser,
        role
    }
}