import constApi from "./ConstApi";

const POSITIVE_STATUSES = [200,201,204];

const restService = {
    get: (url, onSuccess, onError) => {
        fetch(constApi.apiUrl + url)
            .then(data => {
                if (data.ok && POSITIVE_STATUSES.includes(data.status)) {
                    return data.json();
                } else {
                    throw new Error();
                }
            })
            .then(onSuccess)
            .catch(err => onError || handleError(err))
    },
    delete: (url, onSuccess, onError) => {
        fetch(constApi.apiUrl + url, {
            method: 'DELETE'
        })
            .then(data => {
                if (data.ok && POSITIVE_STATUSES.includes(data.status)) {
                    return data.json();
                }
            })
            .then(onSuccess)
            .catch(err => onError || handleError(err))
    },
    put: (url, onSuccess, onError, body) => {
        sendWithBody(url, onSuccess, onError, body, 'PUT');
    },
    patch: (url, onSuccess, onError, body) => {
        sendWithBody(url, onSuccess, onError, body, 'PATCH');
    },
    post: (url, onSuccess, onError, body) => {
        sendWithBody(url, onSuccess, onError, body, 'POST');
    }
}

const sendWithBody = (url, onSuccess, onError, body, method) => {
    fetch(constApi.apiUrl + url, {
        method: 'POST' || method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        }
    })
        .then(data => {
            if (data.ok && POSITIVE_STATUSES.includes(data.status)) {
                return data.json();
            }
            throw new Error();
        })
        .then(onSuccess)
        .catch(err => onError || handleError(err))
}

const handleError = ({err}) => {
    console.log(err)
    // window.location.replace('server-error.html')
}

export default restService;