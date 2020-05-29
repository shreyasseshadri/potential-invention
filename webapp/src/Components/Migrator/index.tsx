import React from 'react';
import {
	AppBar,
	createStyles,
	DialogContent,
	DialogTitle,
	Radio,
	Tab,
	Theme,
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
import DialogActions from "@material-ui/core/DialogActions";
import Tabs from "@material-ui/core/Tabs";
import SwipeableViews from 'react-swipeable-views';
import RadioGroup from "@material-ui/core/RadioGroup";

const styles = (theme: Theme) => createStyles({});

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
}

class Migrator extends React.Component<Props, State> {
	state: State = {
		item: this.props.item,
		contents: this.props.contents.map(i => ({item: i, selected: true})),
		tabIndex: 0,
		selectAllContent: true,
		destination: null,
		makePlaylist: this.props.item.type === 'playlist',
	};

	render() {
		const {source, destinations} = this.props;
		const {makePlaylist, destination, contents, item, tabIndex, selectAllContent} = this.state;
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
						<Grid container style={{maxHeight: 400, overflow: 'auto'}}>
							<SwipeableViews
								index={tabIndex}
								onChangeIndex={this.handleTabSwipe}
							>
								<TabPanel value={tabIndex} index={0}>
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
								<TabPanel value={tabIndex} index={1}>
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
								<TabPanel value={tabIndex} index={2}>
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
									Migrate {item.title} from {source} to {destination}?
								</TabPanel>
							</SwipeableViews>
						</Grid>
					</div>
				</DialogContent>
				<DialogActions>
					{tabIndex !== 2 ?
						<Button variant="contained" color={"secondary"}
								onClick={() => this.handleTabSwipe(tabIndex + 1)}>Next</Button> :
						<Button variant="contained" color={"primary"}
								onClick={() => this.handleMigrate()}>Migrate</Button>}
				</DialogActions>
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