import React, {ReactNode} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {WithStyles} from '@material-ui/core/styles/withStyles';
import {fetchSignup} from '../../Helpers';
import AppContext from '../../AppContext';
import {Link as RouterLink} from 'react-router-dom';

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
		marginTop: theme.spacing(3),
	},
	errMessage: {
		textTransform: 'capitalize',
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
});

interface Props extends WithStyles {
}

interface State {
	username: string,
	password: string,
	errMessage: string,
	success: boolean,
}

class SignUp extends React.Component<Props, State> {
	state: State = {
		username: '',
		password: '',
		errMessage: '',
		success: false,
	};


	handleSubmit = () => {
		const {username, password} = this.state;
		const {setLoading, resetLoading, appServer} = this.context;
		setLoading();
		fetchSignup(appServer, {username, password}, (err) => {
			if (err) {
				this.setState({errMessage: err.message});
			} else {
				this.setState({errMessage: '', success: true});
			}
			resetLoading();
		});
	};

	render(): ReactNode {
		const {classes} = this.props;
		const {errMessage, success} = this.state;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline/>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon/>
					</Avatar>
					<Typography component="h1" variant="h5">
						Signup
					</Typography>
					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="Username"
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
						{
							success ?
								<Typography className={classes.errMessage} align={"center"}
											color={"textPrimary"}>Success!</Typography>
								: null
						}
						{
							success ?
								<Button
									fullWidth
									variant="contained"
									color="secondary"
									className={classes.submit}
									component={RouterLink}
									to={'/login'}
								>
									Go to login
								</Button>
								:
								<Button
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									onClick={() => this.handleSubmit()}
								>
									Signup
								</Button>
						}
						<Typography align={"center"}>
							<Link component={RouterLink} to="/login">
								Already have an account? Login!
							</Link>
						</Typography>
					</form>
				</div>
			</Container>
		)
	}
}

SignUp.contextType = AppContext;

export default withStyles(useStyles, {withTheme: true})(SignUp);