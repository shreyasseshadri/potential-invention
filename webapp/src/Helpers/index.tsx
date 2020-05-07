import {IAppServer, IUser} from '../Interfaces';

type CallbackType = (arg1: { status: Number | String, message: String } | null, arg2: Object | null) => void;

export function customFetch(endpoint: String, fetchOptions: Object | undefined, callback: CallbackType) {
	var options = fetchOptions;
	fetch(`http://localhost:3001${endpoint}`, options).then((resp) => {
		if (resp.ok) {
			callback(null, resp);
		} else callback({status: resp.status, message: resp.statusText}, null)
	})
		.catch(err => callback({status: 'Fetch Failed', message: err}, null))
}

export function fetchUser(appServer: IAppServer,
						  done: (err: Error | null, user: IUser | null) => void) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/auth/me`;
	const options: RequestInit = {
		method: 'GET',
		credentials: 'include',
		mode: fetchMode,
		headers: {
			'Accept': 'application/json',
		},
	};
	fetch(url, options)
		.then(r => {
			if (r.ok) {
				return r.json();
			} else {
				throw new Error(r.statusText);
			}
		})
		.then(user => done(null, user))
		.catch(err => done(err, null));
}

export function fetchLogin(appServer: IAppServer,
						   cred: { username: string, password: string },
						   done: (err: Error | null) => void) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/auth/login`;
	const options: RequestInit = {
		method: 'POST',
		credentials: 'include',
		mode: fetchMode,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(cred)
	};
	fetch(url, options)
		.then(r => {
			if (r.ok) {
				done(null);
			} else {
				throw new Error(r.statusText);
			}
		})
		.catch(err => done(err));
}

export function fetchSignup(appServer: IAppServer,
							cred: { username: string, password: string },
							done: (err: Error | null) => void) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/auth/signup`;
	const options: RequestInit = {
		method: 'POST',
		credentials: 'include',
		mode: fetchMode,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(cred)
	};
	fetch(url, options)
		.then(r => {
			if (r.ok) {
				done(null);
			} else {
				throw new Error(r.statusText);
			}
		})
		.catch(err => done(err));
}

export function fetchLogout(appServer: IAppServer,
							done: (err: Error | null) => void) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/auth/logout`;
	const options: RequestInit = {
		method: 'POST',
		credentials: 'include',
		mode: fetchMode,
	};
	fetch(url, options)
		.then(r => {
			if (r.ok) {
				done(null);
			} else {
				throw new Error(r.statusText);
			}
		})
		.catch(err => done(err));
}