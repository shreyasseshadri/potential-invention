import React from 'react';
import {Theme, WithStyles, withStyles} from '@material-ui/core';
import {MuiThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppContext from './AppContext';
import {DarkTheme} from './Themes';
import {Route, RouteComponentProps, Switch} from 'react-router-dom';
import Home from './Components/Home';
import FourZeroFour from './Components/FourZeroFour';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Explorer from "./Components/Explorer";
import {IAppServer, IUser} from "./Interfaces";
import {fetchUser} from "./Helpers";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = (theme: Theme) => ({});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
}

interface State {
	user: IUser | null,
	loadingCalls: number,
}

const AppServer: IAppServer = {apiRoot: 'http://localhost:5000/api/v1', fetchMode: 'cors'};

class App extends React.Component<Props, State> {
	state: State = {
		user: null,
		loadingCalls: 0,
	};

	componentDidMount(): void {
		this.checkSession();
	}

	render() {
		const {user, loadingCalls} = this.state;
		return (
			<MuiThemeProvider theme={DarkTheme}>
				<React.Fragment>
					<CssBaseline/>
					<AppContext.Provider value={{
						user,
						appServer: AppServer,
						setLoading: this.setLoading,
						resetLoading: this.resetLoading,
					}}>
						<div>
							<div>
								{loadingCalls ? <LinearProgress/> : null}
							</div>
							<div>
								<Switch>
									<Route exact path='/' component={Home}/>
									<Route path='/signup' component={SignUp}/>
									<Route path='/login' component={this.LoginComponent}/>
									<Route path='/explore' component={user ? Explorer : this.LoginComponent}/>
									<Route path='/' component={FourZeroFour}/>
								</Switch>
							</div>
						</div>
					</AppContext.Provider>
				</React.Fragment>
			</MuiThemeProvider>
		);
	}

	setLoading = () => {
		this.setState(prev => ({loadingCalls: prev.loadingCalls + 1}));
	};

	resetLoading = () => {
		this.setState(prev => ({loadingCalls: prev.loadingCalls - 1}));
	};

	LoginComponent = (props: any) => {
		return (
			<Login
				{...props}
				onLogin={this.onLogin}
			/>
		);
	};

	onLogin = () => {
		if (this.props.history.location.pathname === '/login') {
			this.props.history.push('/');
		}
		this.setLoading();
		fetchUser(AppServer, (err, user) => {
			if (err || !user) {
				console.error(err?.message || 'Could not get user');
			} else {
				this.setState({user});
			}
			this.resetLoading();
		});
	};

	checkSession() {
		this.setLoading();
		fetchUser(AppServer, (err, user) => {
			if (user) {
				this.setState({user});
			}
			this.resetLoading();
		});
	}
}

export default withStyles(styles, {withTheme: true})(App);