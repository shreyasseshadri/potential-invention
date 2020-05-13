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

export function fetchSpotifyCollection(
	appServer: IAppServer,
	done: IResourceFetcherCallback
) {
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
		.then(data => done(null,
			{
				id: "spotify-service",
				type: "service",
				title: "Spotify",
				description: "Your Spotify Collection",
			},
			{
				playlists: data.playlists.items.map((i: any) => ({
					id: i.id,
					type: "playlist",
					title: i.name,
					description: i.description || i.name,
					thumb: i.images[0]?.url,
					nav: `playlist:${i.id}`,
				})),
				albums: data.albums.items.map((i: any) => ({
					id: i.album.id,
					type: "album",
					title: i.album.name,
					description: i.album.name,
					thumb: i.album.images[0]?.url,
					nav: `album:${i.album.id}`,
				}))
			}))
		.catch(err => done(err, null, null));
}

export function fetchSpotifyPlaylist(
	appServer: IAppServer,
	playlistID: string,
	done: IResourceFetcherCallback
) {
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
		.then(data => done(null,
			{
				id: data.id,
				type: "playlist",
				title: data.name,
				description: "",
			}, {
				tracks: data.tracks.items.map((i: any) => ({
					id: i.track.id,
					type: 'track',
					title: i.track.name,
					description: formatDurationFromMillisecond(i.track.duration_ms) + (i.track?.album?.name ? ` ${i.track.album.name}` : ''),
					thumb: i.track?.album?.images[0]?.url,
					nav: `track:${i.track.id}`,
				}))
			}))
		.catch(err => done(err, null, null));
}


function formatDurationFromMillisecond(ms: number) {
	const duration = ms / 1000;
	return [duration / 3600, (duration / 60) % 60, (duration) % 60]
		.map(Math.floor)
		.filter(n => n)
		.map(n => n < 10 ? `0${n}` : `${n}`)
		.join(':');
}

export function fetchServices(
	appServer: IAppServer,
	done: IResourceFetcherCallback
) {
	done(null,
		{
			id: "explore",
			type: "misc",
			title: "Services",
			description: "Your Music Services",
		},
		{
			"connected": [
				{
					id: "spotify",
					type: "service",
					title: "Spotify",
					description: "Your Spotify collection",
					thumb: "images/sample/Spotify_Icon_RGB_Green.png",
					nav: "spotify",
				},
				{
					id: "amazon",
					type: "service",
					title: "Amazon",
					description: "Your Amazon collection",
					nav: "amazon",
				},
			]
		}
	);
}

export function fetchAmazonCollection(
	appServer: IAppServer,
	done: IResourceFetcherCallback
) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/amazon/collection`;
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
				id: "amazon-service",
				type: "service",
				title: "Amazon",
				description: "Your Amazon Collection",
			},
			{
				playlists: data.playlists.map((i: any) => ({
					id: i.id,
					type: "playlist",
					title: i.title,
					description: i.description,
					thumb: i.thumb,
					nav: `playlist:${i.id}`,
				})),
				albums: data.albums.map((i: any) => ({
					id: i.id,
					type: "album",
					title: i.title,
					description: i.description,
					thumb: i.thumb,
					nav: `album:${i.id}`,
				}))
			}))
		.catch(err => done(err, null, null));
}

export function fetchAmazonPlaylist(
	appServer: IAppServer,
	playlistID: string,
	done: IResourceFetcherCallback
) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/amazon/playlist/${playlistID}`;
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
				type: "playlist",
				title: data.title,
				description: data.description,
			}, {
				tracks: data.tracks.map((i: any) => ({
					id: i.id,
					type: 'track',
					title: i.title,
					description: i.description,
					// Note: playlist thumb instead of track thumb
					thumb: data.thumb,
					nav: `track:${i.id}`,
				}))
			}))
		.catch(err => done(err, null, null));
}

export function fetchAmazonAlbum(
	appServer: IAppServer,
	albumID: string,
	done: IResourceFetcherCallback
) {
	const {apiRoot, fetchMode} = appServer;
	const url = `${apiRoot}/amazon/album/${albumID}`;
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
				type: "album",
				title: data.title,
				description: data.description,
			}, {
				tracks: data.tracks.map((i: any) => ({
					id: i.id,
					type: 'track',
					title: i.title,
					description: i.description,
					// Note: playlist thumb instead of track thumb
					thumb: data.thumb,
					nav: `track:${i.id}`,
				}))
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

export function getAppRootUrl() {
	return window.location.origin;
}