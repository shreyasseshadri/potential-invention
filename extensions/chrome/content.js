config = window.applicationContextConfiguration;

function amazonPlaylistMapper(d) {
	return {
		type: "playlist",
		id: d.playlistId,
		title: d.title,
		description: null,
		external_url: null,
		thumbnails: d.fourSquareImage ? [d.fourSquareImage] : null,
	};
}

function amazonTrackMapper(t) {
	return {
		type: "track",
		id: t.metadata.requestedMetadata.objectId,
		title: t.metadata.requestedMetadata.title,
		duration: t.metadata.requestedMetadata.duration,
		album: {
			title: t.metadata.requestedMetadata.albumName,
			id: t.metadata.requestedMetadata.albumAsin
		},
		thumbnails: [
			{ url: t.metadata.requestedMetadata.albumCoverImageFull },
			{ url: t.metadata.requestedMetadata.albumCoverImageLarge },
			{ url: t.metadata.requestedMetadata.albumCoverImageMedium },
			{ url: t.metadata.requestedMetadata.albumCoverImageSmall }
		],
		artists: [{ name: t.metadata.requestedMetadata.artistName }],
		external_url: null,
	};
}

function amazonAlbumMapper(d) {
	return {
		id: d.metadata.albumAsin,
		title: d.metadata.albumName,
		description: d.metadata.artistName,
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
			requestedMetadata: [
				"albumCoverImageFull", "albumCoverImageLarge",
				"albumCoverImageMedium", "albumCoverImageSmall",
				"asin", "albumName", "albumAsin", "artistName",
				"artistAsin", "duration", "objectId", "title"
			],
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

function getAlbums(cb) {
	let body = {
		'searchReturnType': 'ALBUMS',
		'searchCriteria.member.1.attributeName': 'status',
		'searchCriteria.member.1.comparisonType': 'EQUALS',
		'searchCriteria.member.1.attributeValue': 'AVAILABLE',
		'searchCriteria.member.2.attributeName': 'trackStatus',
		'searchCriteria.member.2.comparisonType': 'IS_NULL',
		'searchCriteria.member.2.attributeValue': '',
		'albumArtUrlsSizeList.member.1': 'MEDIUM',
		'selectedColumns.member.1': 'albumArtistName',
		'selectedColumns.member.2': 'albumName',
		'selectedColumns.member.3': 'artistName',
		'selectedColumns.member.4': 'objectId',
		'selectedColumns.member.5': 'primaryGenre',
		'selectedColumns.member.6': 'sortAlbumArtistName',
		'selectedColumns.member.7': 'sortAlbumName',
		'selectedColumns.member.8': 'sortArtistName',
		'selectedColumns.member.9': 'albumCoverImageMedium',
		'selectedColumns.member.10': 'albumAsin',
		'selectedColumns.member.11': 'artistAsin',
		'selectedColumns.member.12': 'gracenoteId',
		'selectedColumns.member.13': 'physicalOrderId',
		'sortCriteriaList': '',
		'nextResultsToken': '0',
		'Operation': 'searchLibrary',
		'caller': 'getAllDataByMetaType',
		'sortCriteriaList.member.1.sortColumn': 'sortAlbumName',
		'sortCriteriaList.member.1.sortType': 'ASC',
		'ContentType': 'JSON',
		'customerInfo.customerId': `${config.customerId}`,
		'customerInfo.deviceId': `${config.deviceId}`,
		'customerInfo.deviceType': `${config.deviceType}`,
	}
	body = Object.keys(body).map(k => `${k}=${body[k]}`).join('&');

	fetch("https://music.amazon.in/EU/api/cirrus/", {
		"credentials": "include",
		"headers": {
			"User-Agent": navigator.userAgent,
			"Accept": "application/json, text/javascript, */*; q=0.01",
			"Accept-Language": "en-US,en;q=0.5",
			"Content-Type": "application/x-www-form-urlencoded",
			// "x-amzn-RequestId": "it-works-if-i-do-not-include-this",
			"csrf-token": config.CSRFTokenConfig.csrf_token,
			"csrf-rnd": config.CSRFTokenConfig.csrf_rnd,
			"csrf-ts": config.CSRFTokenConfig.csrf_ts,
			"X-Requested-With": "XMLHttpRequest"
		},
		"referrer": "https://music.amazon.in/home",
		body,
		"method": "POST",
		"mode": "cors"
	})
		.then(r => {
			if (r.ok) {
				return r.json();
			}
			throw new Error(r.statusText);
		})
		.then(r => {
			let albums = r.searchLibraryResponse.searchLibraryResult.searchReturnItemList;
			albums = albums.filter(a => a.numTracks > 1).map(amazonAlbumMapper);
			cb(null, albums);
		})
		.catch(e => cb(e));
}

function getTracksOfAlbums(asins, cb) {
	fetch("https://music.amazon.in/EU/api/muse/legacy/lookup", {
		"credentials": "include",
		"headers": {
			"User-Agent": navigator.userAgent,
			"Accept": "*/*",
			"Accept-Language": "en-US,en;q=0.5",
			"content-type": "application/json",
			"X-Amz-Target": "com.amazon.musicensembleservice.MusicEnsembleService.lookup",
			"X-Requested-With": "XMLHttpRequest",
			"Content-Encoding": "amz-1.0",
			"csrf-token": config.CSRFTokenConfig.csrf_token,
			"csrf-rnd": config.CSRFTokenConfig.csrf_rnd,
			"csrf-ts": config.CSRFTokenConfig.csrf_ts,
		},
		"referrer": "https://music.amazon.in/home",
		"body": JSON.stringify({
			asins,
			"features": ["popularity", "expandTracklist", "trackLibraryAvailability", "collectionLibraryAvailability"],
			"requestedContent": "PRIME",
			"deviceId": config.deviceId,
			"deviceType": config.deviceType,
			"musicTerritory": config.musicTerritory,
			"customerId": config.customerId
		}),
		"method": "POST",
		"mode": "cors"
	})
		.then(r => {
			if (r.ok) {
				return r.json();
			}
			throw new Error(r.statusText);
		})
		.then(r => {
			cb(null, r.albumList.map(a => ({
				type: "album",
				id: a.globalAsin,
				title: a.title,
				thumbnails: [{ url: a.image }],
				artists: [{ name: a.artist.name }],
				external_url: null,
				tracks: a.tracks.map(t => ({
					type: "track",
					id: t.asin,
					title: t.title,
					duration: t.duration,
					album: { title: a.title, id: a.globalAsin },
					thumbnails: [{ url: a.image }],
					artists: [{ name: t.artist.name }],
					external_url: null,
				}))
			})));
		})
		.catch(e => cb(e));
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
			const playlistData = playlists.map((d, i) => ({
				...d,
				tracks: data.playlists[i].tracks.map(amazonTrackMapper)
			}));

			getAlbums((err, data) => {
				if (err) {
					return cb(err);
				}
				getTracksOfAlbums(data.map(d => d.id), (err, albumData) => {
					if (err) {
						return cb(err);
					}
					cb(null, { playlists: playlistData, albums: albumData });
				});
			});
		});
	})
}

function messageExtension(dump){
	var event = new CustomEvent("PassToBackground", {"detail": {type:"uploadDump","data":dump}});
	window.dispatchEvent(event);
}

setTimeout(() => {
	console.log("Collectecting dump");
	getDump((err, dump) => {
		if (err) {
			console.error(err);
		}
		else {
			messageExtension(dump);
		}
	})
}, 3000);