import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import {Link as RouterLink} from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {History} from 'history';
import AppContext from '../../AppContext';
import {fetchLogin} from "../../Helpers";

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
	errMessage: {
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
});

interface Props extends WithStyles {
	history: History,
	onLogin: () => void,
}

interface State {
	username: string,
	password: string,
	errMessage: string,
}

class Login extends React.Component<Props, State> {
	state: State = {
		username: '',
		password: '',
		errMessage: '',
	};

	handleLogin = () => {
		const {username, password} = this.state;
		const {setLoading, resetLoading} = this.context;
		setLoading();
		fetchLogin(this.context.appServer, {username, password}, (err) => {
			if (err) {
				this.setState({errMessage: err.message});
			} else {
				this.setState({errMessage: ''}, () => this.props.onLogin());
			}
			resetLoading();
		});
	};

	render() {
		const {errMessage} = this.state;
		const {classes} = this.props;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline/>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon/>
					</Avatar>
					<Typography component="h1" variant="h5">
						Login
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
							onChange={(event) => this.setState({username: event.target.value})}
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
							onChange={(event) => this.setState({password: event.target.value})}

						/>
						{
							errMessage ?
								<Typography className={classes.errMessage} align={"center"}
											color={"error"}>{errMessage}</Typography>
								: null
						}
						<Button
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={() => {
								this.handleLogin();
							}}
						>
							Login
						</Button>
						<Typography align={"center"}>
							<Link component={RouterLink} to="/signup">
								Don't have an account? Sign Up!
							</Link>
						</Typography>
					</form>
				</div>
			</Container>
		);
	}
}

Login.contextType = AppContext;

export default withStyles(useStyles, {withTheme: true})(Login);