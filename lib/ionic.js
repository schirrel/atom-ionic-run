'use babel';

const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const path = require('path');

import IonicView from './ionic-view';
import { CompositeDisposable } from 'atom';

export default {

	ionicView: null,
	modalPanel: null,
	subscriptions: null,

	activate(state) {
		this.ionicView = new IonicView(state.ionicViewState);
		this.modalPanel = atom.workspace.addModalPanel({
			item: this.ionicView.getElement(),
			visible: false
		});

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'ionic:serve': () => this.runCommand('ionic serve'),
			'ionic:run': () => this.runCommand('ionic run android --device'),
			'ionic:build': () => this.runCommand('ionic build android --release')
		}));
	},

	deactivate() {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.ionicView.destroy();
	},

	serialize() {
		return {
			ionicViewState: this.ionicView.serialize()
		};
	},

	runCommand(command) {
		var projectPath = atom.project.getDirectories()[0].path ;
		var proccess = exec(command, {
			cwd: projectPath
		}, function(error, stdout, stderr) {
			console.log(error, stdout, stderr);
		}, function(error, stdout, stderr) {
			console.log(error, stdout, stderr);
		});
		var modal = this.modalPanel;
		modal.show();
		setTimeout(function(){
			modal.hide() ;
		},1500);

		console.log(proccess)
	}
};
