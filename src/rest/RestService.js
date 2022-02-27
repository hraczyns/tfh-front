import constApi from "./ConstApi";
import RestServiceMode from "./RestServiceMode";

const POSITIVE_STATUSES = [200, 201, 204];

const restService = {
    get: async (url, mode = RestServiceMode.DEFAULT) => {
        try {
            const result = await fetch(constApi.apiUrl + url)
            checkErrors(result);
            return await getWithMode(result, mode);
        } catch (e) {
            handleError(e);
        }
    },
    delete: async (url, mode = RestServiceMode.DEFAULT) => {
        try {
            const result = await fetch(constApi.apiUrl + url, {
                method: 'DELETE'
            })
            checkErrors(result);
            return await getWithMode(result, mode);
        } catch (e) {
            handleError(e)
        }
    },
    put: async (url, body, mode = RestServiceMode.DEFAULT) => {
        return await sendWithBody(url, body, 'PUT', mode);
    },
    patch: async (url, body, mode = RestServiceMode.DEFAULT) => {
        return await sendWithBody(url, body, 'PATCH', mode);
    },
    post: async (url, body, mode = RestServiceMode.DEFAULT) => {
        return await sendWithBody(url, body, 'POST', mode);
    }
}

const sendWithBody = async (url, body, method, mode) => {
    try {
        const result = await fetch(constApi.apiUrl + url, {
            method: 'POST' || method,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        })
        // checkErrors(result);
        return await getWithMode(result, mode);
    } catch
        (e) {
        handleError(e)
    }
}

const getWithMode = (result, mode) => {
    switch (mode) {
        case RestServiceMode.TEXT:
            return result.text();
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