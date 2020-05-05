import React from 'react';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core';
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

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
	title: string,
	description: string,
	thumb?: string,
	name: string,
	onClick: (name: string) => void,
}

interface State {
}

class Folder extends React.Component<Props, State> {
	render() {
		const {classes, thumb, title, description, name, onClick} = this.props;
		return (
			<Card className={classes.root}>
				<CardActionArea onClick={() => onClick(name)}>
					{
						thumb ?
							<CardMedia
								className={classes.thumb}
								image={thumb}
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
						<Typography gutterBottom variant="h5" component="h2">
							{title}
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p">
							{description}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		);
	}
}

export default withStyles(styles, {withTheme: true})(Folder);