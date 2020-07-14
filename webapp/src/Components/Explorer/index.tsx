import React from 'react';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import {RouteComponentProps} from "react-router-dom";
import AppContext from '../../AppContext';
import Grid from "@material-ui/core/Grid";
import Folder from "../Folder";
import Typography from "@material-ui/core/Typography";
import {fetchAlbum, fetchCollection, fetchPlaylist, fetchServices} from "../../Helpers";
import {IFolderData, IResourceFetcherCallback} from "../../Interfaces";
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";
import Migrator from "../Migrator";

const styles = (theme: Theme) => createStyles({
	root: {
		padding: theme.spacing(5)
	},
	folders: {
		padding: theme.spacing(5)
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
	item: IFolderData | null,
	content: Record<string, IFolderData[]> | null,
	resourceError: string,
	openMigrator: boolean,
	source: string | null,
}

class Explorer extends React.Component<Props, State> {
	state: State = {
		item: null,
		content: null,
		resourceError: '',
		openMigrator: false,
		source: null,
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
		const {source, content, resourceError, item, openMigrator} = this.state;
		return (
			<div className={classes.root}>
				{
					openMigrator && item && content && source ?
						<Migrator
							item={item}
							contents={content["tracks"]}
							onClose={() => this.setState({openMigrator: false})}
							destinations={['amazon', 'spotify']}
							source={source}
						/> : null
				}
				<Grid container direction="row" justify="space-around" alignItems="center">
					<Grid item>
						{
							<IconButton
								onClick={this.goBack}
								disabled={this.props.history.location.pathname.split('/').filter(s => s.length > 0).length <= 1}
							>
								<ArrowBackRoundedIcon/>
							</IconButton>
						}
					</Grid>
					<Grid item>
						{
							item ?
								<Typography variant={"h4"}>{item.title}</Typography> :
								<Typography variant={"h4"} color={"error"}>{resourceError}</Typography>
						}
					</Grid>
					<Grid item>
						{
							item && (item.type === "album" || item.type === "playlist") && !resourceError ?
								<Button className={classes.migrateButton} size="large"
										onClick={() => this.setState({openMigrator: true})}>Migrate!</Button> : null
						}
					</Grid>
				</Grid>
				{
					content ?
						Object.keys(content).map((category, i) => ((
							<div key={i} className={classes.folders}>
								{
									Object.keys(content).length > 1 ?
										<Typography style={{textTransform: "capitalize"}} gutterBottom
													variant={"h4"}>{category}</Typography> : null
								}
								<Grid container spacing={4}>
									{
										content[category].map((contentItem, j) => {
											return (
												<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={j}>
													<Folder
														data={contentItem}
														onClick={this.navigate}
													/>
												</Grid>
											)
										})
									}
								</Grid>
							</div>
						))) : null
				}
			</div>
		);
	}

	goBack = () => {
		const pathname = this.props.history.location.pathname.split("/").filter(s => s.length > 0);
		pathname.pop();
		this.props.history.push(`/${pathname.join('/')}`);
	};

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
				(this.resources[i].callback)(match, (err, item, content) => {
					if (err) {
						this.setState({resourceError: err?.message, item: null, content: {}});
					} else {
						this.setState({
							resourceError: '',
							item: item,
							content: content
						});
					}
					resetLoading();
				});
				break;
			}
		}
	}

	getServices = ([path]: RegExpMatchArray, done: IResourceFetcherCallback) => {
		fetchServices(this.context.appServer, done);
	};

	getCollection = ([path, service]: RegExpMatchArray, done: IResourceFetcherCallback) => {
		this.setState({source: service});
		fetchCollection(this.context.appServer, service, done);
	};

	getPlaylist = ([path, service, playlistID]: RegExpMatchArray, done: IResourceFetcherCallback) => {
		this.setState({source: service});
		fetchPlaylist(this.context.appServer, service, playlistID, done);
	};

	getPlaylistTrack = ([path, service, playlistID, trackID]: RegExpMatchArray, done: IResourceFetcherCallback) => {
		done(new Error('Resource not found'), null, null);
	};

	getAlbum = ([path, service, albumID]: RegExpMatchArray, done: IResourceFetcherCallback) => {
		this.setState({source: service});
		fetchAlbum(this.context.appServer, service, albumID, done);
	};

	getAlbumTrack = ([path, service, albumID, trackID]: RegExpMatchArray, done: IResourceFetcherCallback) => {
		done(new Error('Resource not found'), null, null);
	};

	get404 = ([path]: RegExpMatchArray, done: IResourceFetcherCallback) => {
		done(new Error('Resource not found'), null, null);
	};

	resources = [
		{
			pattern: new RegExp('^/explore/?$'),
			callback: this.getServices
		},
		{
			pattern: new RegExp('^/explore/([^/.]+)/?$'),
			callback: this.getCollection
		},
		{
			pattern: new RegExp('^/explore/([^/.]+)/playlist:([^/.]+)/?$'),
			callback: this.getPlaylist
		},
		{
			pattern: new RegExp('^/explore/([^/.]+)/playlist:([^/.]+)/track:([^/.]+)/?$'),
			callback: this.getPlaylistTrack
		},
		{
			pattern: new RegExp('^/explore/([^/.]+)/album:([^/.]+)/?$'),
			callback: this.getAlbum
		},
		{
			pattern: new RegExp('^/explore/([^/.]+)/album:([^/.]+)/track:([^/.]+)/?$'),
			callback: this.getAlbumTrack
		},
		{
			pattern: new RegExp('^.*$'),
			callback: this.get404
		},
	];
}

Explorer.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Explorer);