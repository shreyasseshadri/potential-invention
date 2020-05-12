config = window.wrappedJSObject.applicationContextConfiguration;

function amazonPlaylistMapper(d) {
	return {
		id: d.playlistId,
		title: d.title,
		description: d.title,
		thumb: d.fourSquareImage ? d.fourSquareImage.url : null,
	};
}

function amazonTrackMapper(t) {
	return {
		id: t.metadata.requestedMetadata.objectId,
		title: t.metadata.requestedMetadata.title,
		description: t.metadata.requestedMetadata.albumName,
		thumb: null,
	};
}

function getPlaylists(cb) {
	fetch("https://music.amazon.in/EU/api/playlists/", {
		"credentials": "include",
		"headers": {
			"User-Agent": navigator.userAgent,
			"Accept": "*/*",
			"Accept-Language": "en-US,en;q=0.5",
			"content-type": "application/json",
			"Content-Encoding": "amz-1.0",
			"X-Amz-Target": "com.amazon.musicplaylist.model.MusicPlaylistService.getOwnedPlaylistsInLibrary",
			"csrf-token": config.CSRFTokenConfig.csrf_token,
			"csrf-rnd": config.CSRFTokenConfig.csrf_rnd,
			"csrf-ts": config.CSRFTokenConfig.csrf_ts,
			"X-Requested-With": "XMLHttpRequest"
		},
		"referrer": "https://music.amazon.in/home",
		"body": JSON.stringify({
			pageSize: 100, entryOffset: 0,
			deviceId: config.deviceId,
			deviceType: config.deviceType,
			musicTerritory: config.musicTerritory,
			customerId: config.customerId
		}),
		"method": "POST",
		"mode": "cors"
	})
		.then(res => {
			if (res.ok) {
				return res.json()
			}
			throw new Error(res.statusText);
		})
		.then(data => cb(null, data.playlists.map(amazonPlaylistMapper)))
		.catch(err => cb(err));
}

function getTracksOfPlaylists(playlistIds, cb) {
	fetch("https://music.amazon.in/EU/api/playlists/", {
		"credentials": "include",
		"headers": {
			"User-Agent": navigator.userAgent,
			"Accept": "*/*",
			"Accept-Language": "en-US,en;q=0.5",
			"content-type": "application/json",
			"Content-Encoding": "amz-1.0",
			"X-Amz-Target": "com.amazon.musicplaylist.model.MusicPlaylistService.getPlaylistsByIdV2",
			"csrf-token": config.CSRFTokenConfig.csrf_token,
			"csrf-rnd": config.CSRFTokenConfig.csrf_rnd,
			"csrf-ts": config.CSRFTokenConfig.csrf_ts,
			"X-Requested-With": "XMLHttpRequest"
		},
		"referrer": "https://music.amazon.in/home",
		"body": JSON.stringify({
			playlistIds: playlistIds,
			requestedMetadata: ["asin", "albumName", "albumAsin", "sortAlbumName", "artistName", "artistAsin", "primeStatus", "isMusicSubscription", "duration", "sortArtistName", "sortAlbumArtistName", "objectId", "title", "status", "assetType", "discNum", "trackNum", "instantImport", "purchased", "uploaded", "fileExtension", "fileName", "parentalControls"],
			deviceId: config.deviceId,
			deviceType: config.deviceType,
			musicTerritory: config.musicTerritory,
			customerId: config.customerId
		}),
		"method": "POST",
		"mode": "cors"
	})
		.then(res => {
			if (res.ok) {
				return res.json()
			}
			throw new Error(res.statusText);
		})
		.then(data => cb(null, data)).catch(err => cb(err));
}

function getDump(cb) {
	getPlaylists((err, playlists) => {
		if (err) {
			return cb(err);
		}
		getTracksOfPlaylists(playlists.map(d => d.id), (err, data) => {
			if (err) {
				return cb(err);
			}
			let playlistData = playlists.map((d, i) => ({
				...d,
				tracks: data.playlists[i].tracks.map(amazonTrackMapper)
			}));
			cb(null, { playlists: playlistData, albums: [] });
		});
	})
}

function messageExtension(type, data) {
	browser.runtime.sendMessage({ type, data });
}

setTimeout(() => {
	console.log("Collectecting dump");
	getDump((err, dump) => {
		if (err) {
			console.error(err);
		}
		else {
			messageExtension("uploadDump", dump);
		}
	})
}, 1000);