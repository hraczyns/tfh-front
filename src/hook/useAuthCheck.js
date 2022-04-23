import {useContext, useEffect, useState} from "react";
import userService from "../rest/functionalities/UserService";
import {UserContext} from "../context/UserContext";
import Cookies from "js-cookie";

const isPotentiallyLoggedIn = () => {
    return Cookies.get("cookieHeaderPayload");
}

export default function useAuthCheck(deps) {
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
                if (response && response.email && response.role) {
                    setUser(response.email);
                    setRole(response.role);
                    setUserFromContext(response.email);
                    localStorage.setItem("fastGetUser", response.email);
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
    }, [setUserFromContext, deps]);
    return {
        user,
        setUser,
        role
    }
}