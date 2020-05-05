import React from 'react';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import Explorer from "../Explorer";

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
				<Explorer/>
			</div>
		);
	}
}

export default withStyles(styles, {withTheme: true})(Home);