import React, { ReactNode } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import { customFetch } from '../../Helpers';
import { History } from 'history';

const useStyles = (theme: Theme) => createStyles({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
});

interface Props extends WithStyles {
	history: History
}
interface State {
	username: string,
	password: string
}
class SignUp extends React.Component<Props, State> {
	state: State = {
		username: '',
		password: ''
	}


	handleSubmit = () => {
		const { username, password } = this.state;
		var { history } = this.props;
		var fetchOptions = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"username": username,
				"password": password
			})
		}
		customFetch("/api/v1/auth/signup", fetchOptions, (err, resp) => {
			if (err) {
				console.log(err);
			}
			else {
				console.log(`Response ${resp}`);
				history.push("/login");
			}
		})
	}

	render(): ReactNode {

		const { classes } = this.props;

		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<form className={classes.form} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="username"
									label="username"
									name="username"
									autoComplete="Username"
									onChange={(event) => this.setState({ username: event.target.value })}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									onChange={(event) => this.setState({ password: event.target.value })}
								/>
							</Grid>
						</Grid>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={() => this.handleSubmit()}
						>
							Sign Up
			</Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link href="/login" variant="body2">
									Already have an account? Login!
				</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		)
	}
}

export default withStyles(useStyles, { withTheme: true })(SignUp);