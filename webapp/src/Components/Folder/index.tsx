import React from 'react';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import {IFolderData} from "../../Interfaces";

const styles = (theme: Theme) => createStyles({
	root: {},
	thumb: {
		position: "relative",
		paddingTop: "100%",
	},
	avatarContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		height: "100%",
		width: "100%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
	},
	avatar: {
		margin: "auto",
		width: "75%",
		height: "75%",
	},
	centerHorizontally: {},
});

interface Props extends WithStyles<typeof styles> {
	data: IFolderData,
	onClick: (nav: string) => void,
}

interface State {
}

class Folder extends React.Component<Props, State> {
	render() {
		const {classes, data: {id, type, title, description, thumbnails}, onClick} = this.props;
		let nav = generateNavLink(type, id);
		return (
			<Card className={classes.root}>
				<CardActionArea onClick={nav ? () => onClick(nav) : undefined}>
					{
						thumbnails && thumbnails.length ?
							<CardMedia
								className={classes.thumb}
								image={thumbnails[0].url}
								title={title}
							/>
							:
							<div className={classes.thumb}>
								<div className={classes.avatarContainer}>
									<Avatar className={classes.avatar}>
										{title[0]}
									</Avatar>
								</div>
							</div>
					}
					<CardContent>
						<Typography gutterBottom variant="h6" noWrap>
							{title}
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p" noWrap>
							{description || title}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		);
	}
}

function generateNavLink(type: string, id: string): string {
	switch (type) {
		case "service":
			return id;
		case "track":
			return '';
		default:
			return `${type}:${id}`;
	}
}

export default withStyles(styles, {withTheme: true})(Folder);