import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { History } from 'history';
import { customFetch } from '../helpers';

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
		width: '100%', 
		marginTop: theme.spacing(1),
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

class SignIn extends React.Component<Props, State>{
	state: State = {
		username: '',
		password: ''
	}

	handleLogin = () => {
		const { username, password } = this.state;
		var { history } = this.props;
		var fetchOptions = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"username": username,
				"password": password
			})
		}
		customFetch("/api/v1/auth/login", fetchOptions, (err, resp) => {
			if (err) {
				console.log(err);
			}
			else {
				console.log(`Response ${resp}`);
				history.push("/");
			}
		})
	}

	render() {

		const { classes } = this.props;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
            		</Typography>
					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="email"
							autoComplete="username"
							autoFocus
							onChange={(event) => this.setState({ username: event.target.value })}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							onChange={(event) => this.setState({ password: event.target.value })}

						/>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={() => { this.handleLogin(); }}
						>
							Sign In
						</Button>
						<Grid container justify="center">
							<Grid item>
								<Link to="/signup" style={{ textDecoration: 'none' }}>
									Don&apos;t have an account? Sign Up
                  				</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		);
	}
}
export default withStyles(useStyles, { withTheme: true })(SignIn);