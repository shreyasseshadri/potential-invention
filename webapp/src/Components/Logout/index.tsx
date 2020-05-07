import React from 'react';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import AppContext from '../../AppContext';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import {fetchLogout} from "../../Helpers";
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = (theme: Theme) => createStyles({
	content: {
		margin: theme.spacing(4),
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	}
});

interface Props extends WithStyles {
	onLogout: () => void,
}

interface State {
	errMessage: string,
}

class Logout extends React.Component<Props, State> {
	state: State = {
		errMessage: '',
	};

	componentDidMount(): void {
		const {setLoading, resetLoading, appServer} = this.context;
		setLoading();
		fetchLogout(appServer, (err) => {
			if (err) {
				this.setState({errMessage: err.message});
			} else {
				this.props.onLogout();
			}
			resetLoading();
		});
	}

	render() {
		const {classes} = this.props;
		const {errMessage} = this.state;
		return (
			<Dialog open={true} fullWidth maxWidth={"xs"}>
				{
					errMessage ?
						<div className={classes.content}>
							<Typography variant={"h6"}>{errMessage}</Typography>
							<ErrorIcon fontSize={"large"}/>
						</div>
						:
						<div className={classes.content}>
							<Typography variant={"h6"}>Logging out</Typography>
							<CircularProgress/>
						</div>
				}
			</Dialog>
		);
	}
}

Logout.contextType = AppContext;

export default withStyles(useStyles, {withTheme: true})(Logout);