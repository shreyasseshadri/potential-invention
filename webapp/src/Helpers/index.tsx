import {IAppServer, IResourceFetcherCallback, IUser} from '../Interfaces';

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

export function fetchCollection(
	appServer: IAppServer,
	service: string,
	done: IResourceFetcherCallback
) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/${service}/access/collection`;
	const options: RequestInit = {
		method: 'GET',
		credentials: 'include',
		mode: fetchMode,
	};
	fetch(url, options)
		.then(r => {
			if (r.ok) {
				return r.json();
			} else {
				throw new Error(r.statusText);
			}
		})
		.then(data => done(null,
			{
				id: data.id,
				type: data.type,
				title: data.title,
				description: data.description,
			},
			{
				playlists: data.playlists,
				albums: data.albums,
			})
		)
		.catch(err => done(err, null, null));
}

export function fetchPlaylist(
	appServer: IAppServer,
	service: string,
	playlistID: string,
	done: IResourceFetcherCallback
) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/${service}/access/playlist/${playlistID}`;
	const options: RequestInit = {
		method: 'GET',
		credentials: 'include',
		mode: fetchMode,
	};
	fetch(url, options)
		.then(r => {
			if (r.ok) {
				return r.json();
			} else {
				throw new Error(r.statusText);
			}
		})
		.then(data => done(null,
			{
				id: data.id,
				type: data.type,
				title: data.title,
				description: data.description,
			}, {
				tracks: data.tracks
			}))
		.catch(err => done(err, null, null));
}

export function fetchAlbum(
	appServer: IAppServer,
	service: string,
	albumID: string,
	done: IResourceFetcherCallback
) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/${service}/access/album/${albumID}`;
	const options: RequestInit = {
		method: 'GET',
		credentials: 'include',
		mode: fetchMode,
	};
	fetch(url, options)
		.then(r => {
			if (r.ok) {
				return r.json();
			} else {
				throw new Error(r.statusText);
			}
		})
		.then(data => done(null,
			{
				id: data.id,
				type: data.type,
				title: data.title,
				description: data.description,
			}, {
				tracks: data.tracks
			}))
		.catch(err => done(err, null, null));
}

export function fetchServices(
	appServer: IAppServer,
	done: IResourceFetcherCallback
) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/auth/me`;
	const options: RequestInit = {
		method: 'GET',
		credentials: 'include',
		mode: fetchMode,
	};
	fetch(url, options)
		.then(r => {
			if (r.ok) {
				return r.json();
			} else {
				throw new Error(r.statusText);
			}
		})
		.then(data => done(null,
			{
				id: "explore",
				type: "misc",
				title: "Services",
				description: "Your Music Services",
			}, {
				"services": data.services
			}))
		.catch(err => done(err, null, null));
}

export function fetchSpotifyConnectUrl(
	appServer: IAppServer,
	done: (err: Error | null, data: { redirect_uri: string } | null) => void
) {
	const {apiRoot, fetchMode} = appServer;
	const params = new URLSearchParams({
		redirect_uri: `${getAppRootUrl()}/connect/spotify`
	}).toString();
	const url = `${apiRoot}/spotify/auth/authorize?${params}`;
	const options: RequestInit = {
		method: 'GET',
		credentials: 'include',
		mode: fetchMode,
	};
	fetch(url, options)
		.then(r => {
			if (r.ok) {
				return r.json();
			} else {
				throw new Error(r.statusText);
			}
		})
		.then(data => done(null, data))
		.catch(err => done(err, null));
}

export function fetchSpotifyAuthCallback(
	appServer: IAppServer,
	params: string,
	done: (err: Error | null) => void
) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/spotify/auth/callback${params}`;
	const options: RequestInit = {
		method: 'GET',
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

export function fetchMigrate(
	appServer: IAppServer,
	fromServiceName: string, toServiceName: string, migrationType: string,
	migrationData: any,
	done: (err: Error | null, data: any) => void
) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/migrate`;
	const options: RequestInit = {
		method: 'POST',
		credentials: 'include',
		mode: fetchMode,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({fromServiceName, toServiceName, migrationType, migrationData}),
	};
	fetch(url, options)
		.then(r => {
			if (r.ok) {
				done(null, null);
			} else {
				throw new Error(r.statusText);
			}
		})
		.catch(err => done(err, null));
}

export function getAppRootUrl() {
	return window.location.origin;
}