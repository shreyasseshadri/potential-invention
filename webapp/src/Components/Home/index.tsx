import React from 'react';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";

const styles = (theme: Theme) => createStyles({
	root: {}
});

interface Props extends WithStyles<typeof styles> {
}

interface State {
}

class Home extends React.Component<Props, State> {
	render() {
		const {classes} = this.props;
		return (
			<div className={classes.root}>
				<Typography variant={"h1"}>Home</Typography>
				<Link component={RouterLink} to={'explore'}>Explore</Link>
			</div>
		);
	}
}

export default withStyles(styles, {withTheme: true})(Home);