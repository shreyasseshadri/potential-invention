import {IAppServer, IUser} from '../Interfaces';

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

export function fetchSpotifyCollection(appServer: IAppServer,
									   done: (err: Error | null, data: any | null) => void) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/spotify/access/collection`;
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
		.then(data => done(null, {
			Playlists: data.playlists.items.map((i: any) => ({
				title: i.name,
				description: i.description || i.name,
				thumb: i.images[0]?.url,
				nav: `playlist:${i.id}`,
			})),
			Albums: data.albums.items.map((i: any) => ({
				title: i.album.name,
				description: i.album.name,
				thumb: i.album.images[0]?.url,
				nav: `album:${i.album.id}`,
			}))
		}))
		.catch(err => done(err, null));
}

export function fetchSpotifyPlaylist(appServer: IAppServer,
									 playlistID: string,
									 done: (err: Error | null, data: any | null) => void) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/spotify/access/playlist/${playlistID}`;
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
		.then(data => done(null, {
			Tracks: data.tracks.items.map((i: any) => ({
				title: i.track.name,
				description: formatDurationFromMillisecond(i.track.duration_ms) + (i.track?.album?.name ? ` ${i.track.album.name}` : ''),
				thumb: i.track?.album?.images[0]?.url,
				nav: `track:${i.track.id}`,
			}))
		}))
		.catch(err => done(err, null));
}


function formatDurationFromMillisecond(ms: number) {
	return ms;
}