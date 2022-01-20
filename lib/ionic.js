'use babel';

const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const path = require('path');

import IonicView from './ionic-view';
import { CompositeDisposable } from 'atom';

var getPath = function(project) {

	if(project.getDirectories() && project.getDirectories()[0] && project.getDirectories()[0].path)
		return project.getDirectories()[0].path;
	else if(project.getPaths() && project.getPaths()[0])
		return project.getPaths()[0];
}

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

		this.lastCommand = '';
		this.proccess = null;

		this.subscriptions = new CompositeDisposable();

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'ionic:serve': () => this.runCommand('ionic serve'),
			'ionic:run': () => this.runCommand('ionic cordova run android --device'),
			'ionic:build': () => this.runCommand('ionic cordova build android --release'),
			'ionic:buildios': () => this.runCommand('ionic cordova build ios --prod'),
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
		if(this.lastCommand) {
			if(this.lastCommand == command && this.proccess) {
				//kill process
				var kill = 'Taskkill /PID '+this.proccess.pid+' /F';
				exec(kill, function(error, stdout, stderr) {
					console.log(error, stdout, stderr);
				}, function(error, stdout, stderr) {
					console.log(error, stdout, stderr);
				});
				this.lastCommand = null;
			} else {
				this.lastCommand = command;
				var projectPath = atom.project.getDirectories()[0].path ;
				this.proccess = exec(command, {
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

				console.log(this.proccess)
			}
		} else {
			this.lastCommand = command;
			var projectPath = getPath(atom.project);
			this.proccess = exec(command, {
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

			console.log(this.proccess)
		}



	}
};
