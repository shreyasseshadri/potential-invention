interface Node {
	title: string,
	description: string,
	thumb?: string,
	children?: Record<string, Node>
}

const data: Node = {
	title: "root",
	description: "root",
	children: {
		"explore": {
			title: "Explore",
			description: "Explore your services",
			children: {
				"spotify": {
					title: "Spotify",
					description: "Your playlists from Spotify",
					thumb: "/images/sample/Spotify_Icon_RGB_Green.png",
					children: {
						"pride": {
							title: "Pride and Prejudice",
							description: "Jane",
							thumb: "/images/sample/1.jpg",
						},
					}
				},
				"amazon": {
					title: "Amazon",
					description: "Your playlists from Amazon",
					children: {}
				},
			}
		}
	}
};

export {data};