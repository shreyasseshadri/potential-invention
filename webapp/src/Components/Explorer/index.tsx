import React from 'react';
import {createStyles, Grid, Theme, withStyles, WithStyles} from '@material-ui/core';
import Folder from "../Folder";
import {RouteComponentProps} from "react-router-dom";

const styles = (theme: Theme) => createStyles({
	root: {
		padding: theme.spacing(5)
	},
	folders: {
		padding: theme.spacing(5)
	}
});

interface Props extends WithStyles<typeof styles> {
}

interface State {
}

const data = {
	sources: [
		{
			name: "spotify",
			title: "Spotify",
			description: "Your playlists from Spotify",
			thumb: "images/sample/Spotify_Icon_RGB_Green.png",
		},
		{
			name: "amazon",
			title: "Amazon",
			description: "Your playlists from Amazon",
			thumb: "images/sample/1.jpg",
		}
	]
};

class Explorer extends React.Component<Props, State> {
	render() {
		const {classes} = this.props;
		return (
			<div className={classes.root}>
				<div className={classes.folders}>
					<Grid container spacing={4}>
						{
							data.sources.map((s, i) => (
								<Grid item xs={2}>
									<Folder
										title={s.title}
										description={s.description}
										thumb={s.thumb}
										name={s.name}
									/>
								</Grid>
							))
						}
					</Grid>
				</div>
			</div>
		);
	}
}

export default withStyles(styles, {withTheme: true})(Explorer);