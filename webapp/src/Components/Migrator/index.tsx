import React from 'react';
import {
	AppBar,
	createStyles,
	DialogContent,
	DialogTitle,
	Radio,
	Tab,
	Theme,
	Typography,
	withStyles,
	WithStyles,
} from '@material-ui/core';
import AppContext from '../../AppContext';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import {MigratorContent, MigratorItem} from "../../Interfaces";
import Tabs from "@material-ui/core/Tabs";
import SwipeableViews from 'react-swipeable-views';
import RadioGroup from "@material-ui/core/RadioGroup";

const styles = (theme: Theme) => createStyles({
	tabPanel: {
		padding: theme.spacing(2),
	},
	footer: {
		padding: theme.spacing(2, 0),
	}
});

interface Props extends WithStyles<typeof styles> {
	item: MigratorItem,
	contents: MigratorContent[],
	destinations: string[],
	source: string,
	onClose: () => void,
}

interface State {
	item: MigratorItem,
	contents: { selected: boolean, item: MigratorContent }[],
	tabIndex: number,
	selectAllContent: boolean,
	destination: string | null,
	makePlaylist: boolean,
	errMessage: string,
}

class Migrator extends React.Component<Props, State> {
	state: State = {
		item: this.props.item,
		contents: this.props.contents.map(i => ({item: i, selected: true})),
		tabIndex: 0,
		selectAllContent: true,
		destination: null,
		makePlaylist: this.props.item.type === 'playlist',
		errMessage: '',
	};

	render() {
		const {classes, source, destinations} = this.props;
		const {errMessage, makePlaylist, destination, contents, item, tabIndex, selectAllContent} = this.state;
		let actionText = '', actionIsError = false;
		if (errMessage) {
			actionText = errMessage;
		} else if (tabIndex === 0) {
			actionText = 'Select tracks';
		} else if (tabIndex === 1) {
			actionText = 'Select destination';
		} else if (tabIndex === 2) {
			actionText = destination ? 'Confirm and migrate' : 'Select a service';
			actionIsError = (destination == null);
		}
		return (
			<Dialog
				open
				onClose={this.props.onClose}
				fullWidth
				maxWidth={"sm"}
			>
				<DialogTitle>
					<Typography variant={"inherit"}
								color={actionIsError ? "error" : "textPrimary"}>{actionText}</Typography>
				</DialogTitle>
				<DialogContent>
					<AppBar position="static" color="default">
						<Tabs
							value={tabIndex}
							onChange={this.handleTabChange}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth"
						>
							<Tab label="Tracks"/>
							<Tab label="Service"/>
							<Tab label="Confirm"/>
						</Tabs>
					</AppBar>
					<Grid container style={{maxHeight: 400, overflow: 'auto'}}>
						<SwipeableViews
							index={tabIndex}
							onChangeIndex={this.handleTabSwipe}
						>
							<TabPanel className={classes.tabPanel} value={tabIndex} index={0}>
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												checked={selectAllContent}
												color="primary"
												onChange={({target: {checked}}) => this.handleSelectAllContent(checked)}
											/>
										}
										label={"Select all"}
									/>
									{
										contents.map(({item, selected}, i) => (
											<FormControlLabel
												key={i}
												control={
													<Checkbox
														checked={selected}
														color="secondary"
														onChange={({target: {checked}}) => this.handleContentCheck(i, checked)}
													/>
												}
												label={item.title}
											/>
										))
									}
								</FormGroup>
							</TabPanel>
							<TabPanel className={classes.tabPanel} value={tabIndex} index={1}>
								<RadioGroup value={destination}
											onChange={({target: {value}}) => this.setState({destination: value})}>
									{
										destinations.map((dst, i) => (
											<FormControlLabel
												key={i}
												control={<Radio/>}
												label={dst}
												value={dst}
												disabled={source === dst}
											/>
										))
									}
								</RadioGroup>
							</TabPanel>
							<TabPanel className={classes.tabPanel} value={tabIndex} index={2}>
								{
									destination ?
										<Typography>Migrate '{item.title}' from {source} to {destination}</Typography> :
										<Typography>Migrate '{item.title}' from {source}</Typography>
								}
								<FormControlLabel
									control={
										<Checkbox
											color="primary"
											onChange={({target: {checked}}) => this.setState({makePlaylist: checked})}
										/>
									}
									disabled={item.type === 'playlist' || (!selectAllContent && item.type === 'album')}
									checked={makePlaylist}
									label={"Migrate as playlist"}
								/>
							</TabPanel>
						</SwipeableViews>
					</Grid>
					<Grid container justify={'space-between'} alignItems={'flex-end'} className={classes.footer}>
						<Grid item xs={7}>
							<Typography noWrap={true}>{item.title}</Typography>
						</Grid>
						<Grid item xs={5} dir={'rtl'}>
							{tabIndex !== 2 ?
								<Button variant="contained" color={"primary"}
										onClick={() => this.handleTabSwipe(tabIndex + 1)}>Next</Button> :
								<Button variant="contained" color={"primary"} disabled={destination == null}
										onClick={() => this.handleMigrate()}>Migrate</Button>}
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
		);
	}

	handleContentCheck(i: number, selected: boolean): void {
		this.setState((prev) => {
			const contents = prev.contents;
			contents[i].selected = selected;
			const selectAllContent = contents.reduce((acc: boolean, {selected}) => (acc && selected), true);
			const makePlaylist = this.props.item.type === 'album' ? !selectAllContent : prev.makePlaylist;
			return {contents, selectAllContent, makePlaylist};
		});
	}

	handleSelectAllContent(selected: boolean) {
		this.setState((prev) => ({selectAllContent: selected, contents: prev.contents.map(i => ({...i, selected}))}));
	}

	handleMigrate(): void {
		const {source} = this.props;
		const {makePlaylist, contents, item, destination} = this.state;
		const selectedContents = makePlaylist ? contents.filter(i => i.selected).map(i => i.item) : null;
		console.log(source, destination, makePlaylist ? 'playlist' : 'album', item.title, selectedContents);
	}

	handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		this.setState({tabIndex: newValue});
	};

	handleTabSwipe = (index: number) => {
		this.setState({tabIndex: index});
	};
}

Migrator.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Migrator);

interface TabPanelProps {
	children?: React.ReactNode;
	dir?: string;
	index: any;
	value: any;

	[key: string]: any;
}

function TabPanel(props: TabPanelProps) {
	const {children, value, index, ...other} = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			{...other}
		>
			{value === index ? children : null}
		</div>
	);
}