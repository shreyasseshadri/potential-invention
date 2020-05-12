import React from 'react';
import {CircularProgress, createStyles, Theme, withStyles, WithStyles} from '@material-ui/core';
import AppContext from '../../AppContext';
import {Link, RouteComponentProps} from "react-router-dom";
import {fetchSpotifyAuthCallback} from "../../Helpers";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import ErrorIcon from "@material-ui/icons/Error";
import ExploreIcon from '@material-ui/icons/Explore';
import IconButton from "@material-ui/core/IconButton";

const styles = (theme: Theme) => createStyles({
	content: {
		margin: theme.spacing(4),
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	}
});

interface MatchParams {
	service: string;
}

interface Props extends WithStyles<typeof styles>, RouteComponentProps<MatchParams> {
}

interface State {
	errMessage: string,
	completed: boolean,
}

const AuthCallbacks: any = {
	spotify: fetchSpotifyAuthCallback,
};

class Connect extends React.Component<Props, State> {
	state: State = {
		errMessage: '',
		completed: true,
	};

	render() {
		const {classes} = this.props;
		const service = this.props.match.params.service;
		const {errMessage, completed} = this.state;
		const message = errMessage ? errMessage : (completed ? 'Connected. Explore!' : 'Connecting');
		const Icon = errMessage ? <ErrorIcon fontSize={"large"}/> : (
			!completed ? <CircularProgress/> :
				<IconButton component={Link} to={`/explore/${service}`}>
					<ExploreIcon color={"secondary"} fontSize={"large"}/>
				</IconButton>);
		return (
			<Dialog open={true} fullWidth maxWidth={"xs"}>
				{
					<div>
						<div className={classes.content}>
							<Typography variant={"h6"}>{message}</Typography>
							{Icon}
						</div>
					</div>
				}
			</Dialog>
		);
	}

	componentDidMount(): void {
		const service = this.props.match.params.service;
		const callback = AuthCallbacks[service];
		if (callback) {
			callback(this.context.appServer, window.location.search, (err: Error | null) => {
				if (err) {
					this.setState({errMessage: err.message});
				} else {
					this.setState({completed: true});
				}
			});
		}
	}
}

Connect.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Connect);