import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: theme.spacing(1),
		},
	}),
);

export default function FourZeroFour() {
	const classes = useStyles();
	return <div className={classes.root}>{"404"}</div>;
}