import React from 'react';
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core';
import {RouteComponentProps} from "react-router-dom";
import AppContext from '../../AppContext';
import Grid from "@material-ui/core/Grid";
import Folder from "../Folder";
import Typography from "@material-ui/core/Typography";
import {fetchSpotifyCollection, fetchSpotifyPlaylist} from "../../Helpers";
import {IFolderData} from "../../Interfaces";

const styles = (theme: Theme) => createStyles({
	root: {
		padding: theme.spacing(5)
	},
	folders: {
		padding: theme.spacing(5)
	}
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
}

interface State {
	children: Record<string, IFolderData[]>,
	resourceError: string,
}

class Explorer extends React.Component<Props, State> {
	state: State = {
		children: {},
		resourceError: ''
	};
	unListen: any;

	componentDidMount(): void {
		this.parseUrl();
		this.unListen = this.props.history.listen(() => {
			this.parseUrl();
		});
	}

	componentWillUnmount(): void {
		this.unListen();
	}

	render() {
		const {classes} = this.props;
		const {children, resourceError} = this.state;
		return (
			<div className={classes.root}>
				{
					resourceError ?
						<Typography variant={"h4"} color={"error"}>{resourceError}</Typography> : null
				}
				{
					Object.keys(children).map((category, i) => ((
						<div key={i} className={classes.folders}>
							{
								Object.keys(children).length > 1 ?
									<Typography gutterBottom variant={"h4"}>{category}</Typography> : null
							}
							<Grid container spacing={4}>
								{
									children[category].map((child, j) => {
										return (
											<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={j}>
												<Folder
													title={child.title}
													description={child.description}
													thumb={child.thumb}
													name={child.nav}
													onClick={this.navigate}
												/>
											</Grid>
										)
									})
								}
							</Grid>
						</div>
					)))
				}
			</div>
		);
	}

	navigate = (name: string) => {
		const pathname = this.props.history.location.pathname;
		this.props.history.push(`${pathname}${pathname[pathname.length - 1] === '/' ? '' : '/'}${name}`);
	};

	parseUrl() {
		const {setLoading, resetLoading} = this.context;
		const {pathname} = this.props.history.location;
		setLoading();
		for (let i = 0; i < this.resources.length; ++i) {
			let match = pathname.match(this.resources[i].pattern);
			if (match) {
				(this.resources[i].callback)(match, (err, data) => {
					if (err || !data) {
						this.setState({resourceError: err?.message || 'Could not find resource', children: {}});
					} else {
						this.setState({resourceError: '', children: data});
					}
					resetLoading();
				});
				break;
			}
		}
	}

	fetchServices = ([path]: RegExpMatchArray,
					 done: (err: Error | null, data: any | null) => void) => {
		done(null, {
			"Services": [
				{
					title: "Spotify",
					description: "Your Spotify collection",
					thumb: "images/sample/Spotify_Icon_RGB_Green.png",
					nav: "spotify",
				},
				{
					title: "Amazon",
					description: "Your Amazon collection",
					nav: "amazon",
				},
			]
		});
	};

	fetchCollection = ([path, service]: RegExpMatchArray,
					   done: (err: Error | null, data: any | null) => void) => {
		if (service === 'spotify') {
			fetchSpotifyCollection(this.context.appServer, done);
		} else {
			done(new Error('Resource not found'), null);
		}
	};

	fetchPlaylist = ([path, service, playlistID]: RegExpMatchArray,
					 done: (err: Error | null, data: any | null) => void) => {
		if (service === 'spotify') {
			fetchSpotifyPlaylist(this.context.appServer, playlistID, done);
		} else {
			done(new Error('Resource not found'), null);
		}
	};

	fetchPlaylistTrack = ([path, service, playlistID, trackID]: RegExpMatchArray,
						  done: (err: Error | null, data: any | null) => void) => {
		done(new Error('Resource not found'), null);
	};

	fetchAlbum = ([path, service, albumID]: RegExpMatchArray,
				  done: (err: Error | null, data: any | null) => void) => {
		done(new Error('Resource not found'), null);
	};

	fetchAlbumTrack = ([path, service, albumID, trackID]: RegExpMatchArray,
					   done: (err: Error | null, data: any | null) => void) => {
		done(new Error('Resource not found'), null);
	};

	fetch404 = ([path]: RegExpMatchArray,
				done: (err: Error | null, data: any | null) => void) => {
		done(new Error('Resource not found'), null);
	};

	resources = [
		{
			pattern: new RegExp('^/explore/?$'),
			callback: this.fetchServices
		},
		{
			pattern: new RegExp('^/explore/([^/.]+)/?$'),
			callback: this.fetchCollection
		},
		{
			pattern: new RegExp('^/explore/([^/.]+)/playlist:([^/.]+)/?$'),
			callback: this.fetchPlaylist
		},
		{
			pattern: new RegExp('^/explore/([^/.]+)/playlist:([^/.]+)/track:([^/.]+)/?$'),
			callback: this.fetchPlaylistTrack
		},
		{
			pattern: new RegExp('^/explore/([^/.]+)/album:([^/.]+)/?$'),
			callback: this.fetchAlbum
		},
		{
			pattern: new RegExp('^/explore/([^/.]+)/album:([^/.]+)/track:([^/.]+)/?$'),
			callback: this.fetchAlbumTrack
		},
		{
			pattern: new RegExp('^.*$'),
			callback: this.fetch404
		},
	];
}

Explorer.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Explorer);