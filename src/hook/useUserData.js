import {useMemo} from "react";
import Cookies from 'js-cookie';

export const useUserData = () => {
    return useMemo(() => {
        const cookieHeaderPayloadValue = Cookies.get("cookieHeaderPayload");
        if (!cookieHeaderPayloadValue) {
            return {
                id: "",
                name: "",
                surname: "",
                email: "",
            };
        }
        const decoded = JSON.parse(Buffer.from(cookieHeaderPayloadValue?.split(".")[1], 'base64').toString())?.basicInfo;
        return {
            id: decoded?.id,
            name: decoded?.name,
            surname: decoded?.surname,
            email: decoded?.email,
        }
    }, []);
}