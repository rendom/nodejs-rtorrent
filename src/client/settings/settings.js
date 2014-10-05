var log = require('../log/log');

module.exports = angular
	.module('feeds.edit', [
		'ui.router',
		log.name,
	])
	.config(function($stateProvider) {
		$stateProvider.state('home.settings', {
			url: 'settings',
			views: {
				'modal@': {
					templateUrl: 'settings/settings.tpl.html',
					controller: 'SettingsCtrl as settingsEditCtrl'
				}
			},
			isModal: true,
			data: {
				rule: ['isLoggedIn']
			},
		});
	});

require('./settings-controller');
