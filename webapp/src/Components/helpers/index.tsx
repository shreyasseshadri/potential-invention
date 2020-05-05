type CallbackType = (arg1: { status: Number | String, message: String } | null, arg2: Object | null) => void;

function customFetch(endpoint: String, fetchOptions: Object | undefined, callback: CallbackType) {
    var options = fetchOptions;
    fetch(`http://localhost:3001${endpoint}`, options).then((resp) => {
        if (resp.ok) {
            callback(null, resp);
        }
        else callback({ status: resp.status, message: resp.statusText }, null)
    })
        .catch(err => callback({ status: "Fetch Failed", message: err }, null))
}

export { customFetch }