import React from 'react';
import {Button, createStyles, Theme, withStyles, WithStyles} from '@material-ui/core';
import AppContext from '../../../AppContext';
import {fetchSpotifyConnectUrl} from "../../../Helpers";

const styles = (theme: Theme) => createStyles({
	root: {}
});

interface Props extends WithStyles<typeof styles> {
}

interface State {
}

class SpotifyConnectButton extends React.Component<Props, State> {
	render() {
		const {classes} = this.props;
		return (
			<div className={classes.root}>
				<Button onClick={this.onClick}>Connect Spotify</Button>
			</div>
		);
	}

	onClick = () => {
		fetchSpotifyConnectUrl(this.context.appServer, (err, data) => {
			if (err || !data) {
				console.error(err);
			} else {
				window.location.href = data.redirect_uri;
			}
		});
	}
}

SpotifyConnectButton.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(SpotifyConnectButton);