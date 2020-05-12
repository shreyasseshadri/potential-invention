const apiRoot = 'http://localhost:5000/api/v1';
browser.runtime.onMessage.addListener(onMessage);

function onMessage(message) {
	switch (message.type) {
		case "uploadDump":
			uploadDump(message.data, (err) => {
				if (err) {
					console.error("Error while uploading dump", err);
				}
				else {
					console.log("Uploaded dump");
				}
			})
			break;
	}
}

function uploadDump(dump, cb) {
	fetch(`${apiRoot}/amazon/dump`, {
		credentials: "include",
		mode: "cors",
		method: "POST",
		headers: {
			"content-type": 'application/json',
		},
		body: JSON.stringify(dump),
	})
		.then(r => {
			if (r.ok) {
				cb();
			}
			else {
				throw new Error(r.statusText);
			}
		})
		.catch(e => cb(e));
}
