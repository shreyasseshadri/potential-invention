import React from 'react';
import {Theme, withStyles} from '@material-ui/core';
import {MuiThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppContext from './AppContext';
import {DarkTheme} from './Themes';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './Components/Home';
import FourZeroFour from './Components/FourZeroFour';

const styles = (theme: Theme) => ({});


class App extends React.Component {
	render() {
		return (
			<MuiThemeProvider theme={DarkTheme}>
				<React.Fragment>
					<CssBaseline/>
					<AppContext.Provider value={{}}>
						<Router>
							<div>
								<Switch>
									<Route exact path='/' component={Home}/>
									<Route path='/' component={FourZeroFour}/>
								</Switch>
							</div>
						</Router>
					</AppContext.Provider>
				</React.Fragment>
			</MuiThemeProvider>
		);
	}
}

export default withStyles(styles, {withTheme: true})(App);