import constApi from "./ConstApi";
import RestServiceMode from "./RestServiceMode";
import Cookies from 'js-cookie'

const POSITIVE_STATUSES = [200, 201, 204];

const restService = {
    get: async (url, mode = RestServiceMode.DEFAULT) => {
        const result = await fetch(constApi.apiUrl + url, {
            // credentials: "same-origin",
            credentials: "include",
            headers: {
                "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
            },
        })
        checkErrors(result);
        return getWithMode(result, mode);
    },
    delete: async (url, mode = RestServiceMode.DEFAULT) => {
        const result = await fetch(constApi.apiUrl + url, {
            method: "DELETE",
            // credentials: "same-origin",
            credentials: "include",
            headers: {
                "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
            },
        })
        checkErrors(result);
        return getWithMode(result, mode);
    },
    put: async (url, body, mode = RestServiceMode.DEFAULT) => {
        return await sendWithBody(url, body, "PUT", mode);
    },
    patch: async (url, body, mode = RestServiceMode.DEFAULT) => {
        return await sendWithBody(url, body, "PATCH", mode);
    },
    post: async (url, body, mode = RestServiceMode.DEFAULT, isXwwwEncoded = false) => {
        return await sendWithBody(url, body, "POST", mode, isXwwwEncoded);
    }
}

const sendWithBody = async (url, body, method, mode, isXwwwEncoded) => {
    let contentType = "application/json";
    if (isXwwwEncoded) {
        body = Object.keys(body).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&');
        contentType = "application/x-www-form-urlencoded;charset=UTF-8";
    } else {
        body = JSON.stringify(body);
    }
    const result = await fetch(constApi.apiUrl + url, {
        method: "POST" || method,
        // credentials: "same-origin",
        credentials: "include",
        body: body,
        headers: {
            "Content-Type": contentType,
            "Accept": "*/*",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        }
    });
    checkErrors(result);
    return getWithMode(result, mode);
}

const getWithMode = (result, mode) => {
    switch (mode) {
        case RestServiceMode.TEXT:
            return result.text();
        case RestServiceMode.PURE_RESPONSE:
            return result;
        case RestServiceMode.DEFAULT:
        case RestServiceMode.JSON:
        default:
            return result.json();
    }
}

const handleError = ({err}) => {
    console.log("error happened")
    console.log(err)
    // window.location.replace('server-error.html')
}

const checkErrors = (data) => {
    if (!data.ok || !POSITIVE_STATUSES.includes(data.status)) {
        throw new Error(data.status);
    }
}

export default restService;