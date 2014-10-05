module.exports = angular
	.module('settings')
	.factory('settings', function(njrtLog, Restangular, $q) {
		var Settings = {};

		Settings.getAll = function() {
			var deferred = $q.defer();

			Restangular.all("settings").getList().
				then(function(data) {
					Feeds.feeds = data;
					deferred.resolve(data);
				}, function(err) {
					console.error(err);
					deferred.reject(err);
				});

			return deferred.promise;
		}

		Settings.update = function(settings) {
			var deferred = $q.defer();
			Settings.post(settings)
				.then(function (data) {
					deferred.resolve(settings);
				}, function (err) {
					logger.error(err.status, err.statusText, ':', err.data);
					deferred.reject(err);
				});
			return deferred.promise;
		}
	});
