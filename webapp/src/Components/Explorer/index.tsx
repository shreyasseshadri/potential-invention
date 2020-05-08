import React from 'react';
import { createStyles, Theme, withStyles, WithStyles, Modal, Fade, Divider } from '@material-ui/core';
import { RouteComponentProps } from "react-router-dom";
import AppContext from '../../AppContext';
import Grid from "@material-ui/core/Grid";
import Folder from "../Folder";
import Typography from "@material-ui/core/Typography";
import { fetchSpotifyCollection, fetchSpotifyPlaylist } from "../../Helpers";
import { IFolderData } from "../../Interfaces";
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import CloseIcon from '@material-ui/icons/Close';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = (theme: Theme) => createStyles({
	root: {
		padding: theme.spacing(5)
	},
	folders: {
		padding: theme.spacing(5)
	},
	icons: {
		cursor: 'pointer'
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '4px solid white',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(3, 5, 3),
	},
	migrateButton: {
		cursor: 'pointer',
		textTransform: 'none'
	}
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
}

interface State {
	title: string,
	type: string,
	children: Record<string, IFolderData[]>,
	resourceError: string,
	openModal: boolean,
	songsToMigrate: Set<string>,
}

class Explorer extends React.Component<Props, State> {
	state: State = {
		title: '',
		type: '',
		children: {},
		resourceError: '',
		songsToMigrate: new Set(),
		openModal: false
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

	initMigration(): void {
		this.setState({songsToMigrate: new Set()});
		this.setState((prev) => {
			var tempSet = prev.songsToMigrate;
			var key = (prev.type === "playlist") ? "Tracks" : "Albums"
			prev.children[key].map(child => tempSet.add(child.title))
			return { songsToMigrate: tempSet }
		});
		this.setState({ openModal: true });
	}

	handleSongCheck(name: string, checked: boolean): void {
		this.setState((prev) => {
			var tempSet = prev.songsToMigrate;
			(checked) ? tempSet.add(name) : tempSet.delete(name);
			return { songsToMigrate: tempSet }
		})
	}

	handleMigrate(): void {
		console.log(this.state.songsToMigrate)
		this.setState({songsToMigrate: new Set()});
		this.setState({ openModal: false });
	}

	render() {
		const { classes } = this.props;
		const { children, resourceError, openModal, title, type } = this.state;
		var ChildKey = (type === "playlist") ? "Tracks" : "Albums";
		return (
			<div className={classes.root}>
				<Modal
					aria-labelledby="transition-modal-title"
					aria-describedby="transition-modal-description"
					className={classes.modal}
					open={openModal}
					onClose={() => this.setState({ openModal: false })}
					closeAfterTransition
					BackdropComponent={Backdrop}
					BackdropProps={{
						timeout: 500,
					}}
				>
					<Fade in={openModal}>
						<div className={classes.paper}>
							{/* <CloseIcon style={{padding:1}} className={classes.icons} onClick={() => this.setState({openModal:false})}/> */}
							<Typography variant={"h3"} align="center">Migrate {title}</Typography>
							<Divider variant="middle" />
							<br />
							<Grid container style={{ maxHeight: 400, overflow: 'auto' }}>
								<FormGroup>
									{
										(!children[ChildKey]) ? null :
											children[ChildKey].map((child, i) => {
												return (
													<FormControlLabel
														control={
															<Checkbox
																key={i}
																defaultChecked={true}
																name={child.title}
																color="primary"
																onChange={(event) => this.handleSongCheck(event.target.name, event.target.checked)}
															/>
														}
														label={child.title}
													/>
												)
											})
									}
								</FormGroup>
							</Grid>
							<Divider variant="middle" />
							<br />
							<Grid container direction="column">
								<Grid item>
									<Typography variant={"h4"}> Where to migrate ? </Typography>
								</Grid>
								<Grid item>
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox
													name={"Amazon"}
													color="primary"
												/>
											}
											label="Amazon"
										/>
									</FormGroup>
								</Grid>
							</Grid>
							<Grid container justify="center" alignItems="center">
								<Button variant="contained" onClick={() => this.handleMigrate()}>Migrate</Button>
							</Grid>
						</div>
					</Fade>
				</Modal>
				<Grid container direction="row" justify="space-around" alignItems="center">
					<Grid item>
						{
							(this.props.history.location.pathname.split('/').filter(s => s.length > 0).length > 1) ?
								<ArrowBackRoundedIcon onClick={() => { this.goBack() }} className={classes.icons} /> :
								null
						}
					</Grid>
					<Grid item>
						{
							title && !resourceError ?
								<Typography variant={"h3"}>{title}</Typography> : null
						}
					</Grid>
					<Grid item>
						{
							(type === "album" || type === "playlist") && !resourceError ?
								<Button className={classes.migrateButton} size="large" onClick={() => this.initMigration()}>Migrate!</Button> : null
						}
					</Grid>
				</Grid>
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

	goBack = () => {
		const pathname = this.props.history.location.pathname.split("/").filter(s => s.length > 0);
		pathname.pop();
		this.props.history.push(`/${pathname.join('/')}`);
	}

	navigate = (name: string) => {
		const pathname = this.props.history.location.pathname;
		this.props.history.push(`${pathname}${pathname[pathname.length - 1] === '/' ? '' : '/'}${name}`);
	};

	parseUrl() {
		const { setLoading, resetLoading } = this.context;
		const { pathname } = this.props.history.location;
		setLoading();
		for (let i = 0; i < this.resources.length; ++i) {
			let match = pathname.match(this.resources[i].pattern);
			if (match) {
				(this.resources[i].callback)(match, (err, data) => {
					if (err || !data) {
						this.setState({ resourceError: err?.message || 'Could not find resource', children: {} });
					} else {
						this.setState({ resourceError: '', children: data.children, title: data.title, type: data.type });
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
			Title: "Your Music Services",
			children: {
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
			}
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

export default withStyles(styles, { withTheme: true })(Explorer);