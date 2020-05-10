import React from 'react';
import {AppBar, createStyles, DialogContent, DialogTitle, Tab, Theme, withStyles, WithStyles,} from '@material-ui/core';
import AppContext from '../../AppContext';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import {MigratorContent, MigratorItem} from "../../Interfaces";
import DialogActions from "@material-ui/core/DialogActions";
import Tabs from "@material-ui/core/Tabs";
import SwipeableViews from 'react-swipeable-views';

const styles = (theme: Theme) => createStyles({});

interface Props extends WithStyles<typeof styles> {
	item: MigratorItem,
	contents: MigratorContent[],
	onClose: () => void,
}

interface State {
	item: MigratorItem,
	contents: { selected: boolean, item: MigratorContent }[],
	tabIndex: number,
	selectAllContent: boolean,
}

class Migrator extends React.Component<Props, State> {
	state: State = {
		item: this.props.item,
		contents: this.props.contents.map(i => ({item: i, selected: true})),
		tabIndex: 0,
		selectAllContent: true,
	};

	render() {
		const {contents, item, tabIndex, selectAllContent} = this.state;
		return (
			<Dialog
				open
				onClose={this.props.onClose}
				fullWidth
				maxWidth={"sm"}
			>
				<DialogTitle>
					Migrate {item.title}
				</DialogTitle>
				<DialogContent>
					<div>
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
						<SwipeableViews
							index={tabIndex}
							onChangeIndex={this.handleTabSwipe}
						>
							<TabPanel value={tabIndex} index={0}>
								<Grid container style={{maxHeight: 400, overflow: 'auto'}}>
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
								</Grid>
							</TabPanel>
							<TabPanel value={tabIndex} index={1}>
								<Grid container direction="column">
									<Grid item>
										<Typography variant={"h4"}>Where to migrate?</Typography>
									</Grid>
									<Grid item>
										<FormGroup>
											<FormControlLabel
												control={
													<Checkbox
														name={"Amazon"}
														color="primary"
													/>
												}
												label="Amazon"
											/>
										</FormGroup>
									</Grid>
								</Grid>
							</TabPanel>
							<TabPanel value={tabIndex} index={2}>
								Item Three
							</TabPanel>
						</SwipeableViews>
					</div>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" color={"primary"} onClick={() => this.handleMigrate()}>Migrate</Button>
				</DialogActions>
			</Dialog>
		);
	}

	handleContentCheck(i: number, selected: boolean): void {
		this.setState((prev) => {
			const contents = prev.contents;
			contents[i].selected = selected;
			return {contents, selectAllContent: contents.reduce((acc: boolean, {selected}) => (acc && selected), true)};
		});
	}

	handleSelectAllContent(selected: boolean) {
		this.setState((prev) => ({selectAllContent: selected, contents: prev.contents.map(i => ({...i, selected}))}));
	}

	handleMigrate(): void {
		const selectedContents = this.state.contents.filter(i => i.selected).map(i => i.item);
		console.log(selectedContents);
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