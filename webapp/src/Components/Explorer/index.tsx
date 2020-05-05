import React from 'react';
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core';
import {RouteComponentProps} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Folder from "../Folder";
import {data} from "./data";

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

}

interface Node {
	title: string,
	description: string,
	thumb?: string,
	children?: Record<string, Node>
}

class Explorer extends React.Component<Props, State> {
	render() {
		const {classes} = this.props;
		const node = this.getCurrentNode();
		return (
			<div className={classes.root}>
				{this.getView(node)}
			</div>
		);
	}

	getView(node?: Node | null) {
		const {classes} = this.props;
		if (!node) {
			return (
				<div>404</div>
			);
		}
		if (node && !node.children) {
			return (
				<div>File</div>
			);
		}
		if (node && node.children && !Object.keys(node.children).length) {
			return (
				<div>Empty Folder</div>
			);
		}
		if (node && node.children && Object.keys(node.children).length) {
			const folders = node.children;
			return (
				<div className={classes.folders}>
					<Grid container spacing={4}>
						{
							Object.keys(folders).map((name) => {
								const folder = folders[name];
								return (
									// TODO: change key
									<Grid item xs={2} key={name}>
										<Folder
											title={folder.title}
											description={folder.description}
											thumb={folder.thumb}
											name={name}
											onClick={this.navigate}
										/>
									</Grid>
								)
							})
						}
					</Grid>
				</div>
			);
		}
	}

	getCurrentNode() {
		const keys = this.props.history.location.pathname.split('/').filter(s => s.length);
		let node = data;
		for (let i = 0; i < keys.length; ++i) {
			if (!node.children) {
				return null;
			}
			node = node.children[keys[i]];
			if (!node) {
				return null;
			}
		}
		return node;
	}

	navigate = (name: string) => {
		this.props.history.push(`${this.props.history.location.pathname}/${name}`);
	}
}

export default withStyles(styles, {withTheme: true})(Explorer);