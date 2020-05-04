import {createMuiTheme} from "@material-ui/core";

const DarkTheme = createMuiTheme({
	palette: {
		type: "dark",
	},
});

const LightTheme = createMuiTheme({
	palette: {
		type: "light",
	},
});

export {DarkTheme, LightTheme};
