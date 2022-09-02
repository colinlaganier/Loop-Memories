import config from 'utils/config.js'

function apiFetch(method, route, data, user) {
    const requestOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'App-Version': config.version,
            'App-Platform': 'web',
            'Authorization': (!!user && !!user.authToken) ? user.authToken : null,
        },
        body: !!data ? JSON.stringify(data) : null
    };

    return fetch(config.api + route, requestOptions).then(response => response.text().then(text => {
        let data = text
        try {
            data = text && JSON.parse(text);
        } catch {}

        if (!response.ok) {
            const error = (data && data.error) || response.statusText;
            return Promise.reject([error, response.status]);
        }

        const value = data.ok
        if (!value) {
            const error = (data && data.error) || response.statusText;
            return Promise.reject([error, response.status]);
        }

        return value;
    }));
}

export { apiFetch }
