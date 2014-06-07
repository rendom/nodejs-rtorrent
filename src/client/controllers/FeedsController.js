var controllersModule = require("../controllers");
controllersModule.controller("FeedsController", ["$log", "$scope", "$rootScope", "FeedFactory", "$modal",
	function($log, $scope, $rootScope, FeedFactory, $modal) {
		console.log("feeds controller loaded");
		
		$scope.pageTitle = "Feeds";

		FeedFactory.getFeeds().then(function(data) {
			$scope.feeds = data;
		}, function(err) {
			$log.error(err);
		});

		$scope.addFeed = function() {
			$modal.open({
				templateUrl: "../partials/add_feed_modal.html",
				controller: function($scope, $modalInstance) {
					$scope.feed = {};
					$scope.newFilter = {};
					$scope.feed.filters = [];

					$scope.addFilter = function(filter) {
						if (!filter.regex && !filter.type) {
							return;
						}

						$scope.feed.filters.push({
							regex: filter.regex,
							type: filter.type
						});
						$scope.newFilter = {
							regex: "",
							type: ""
						};	
					}

					$scope.deleteFilter = function(index) {
						$scope.feed.filters.splice(index, 1);
					}

					$scope.addRssFeed = function() {
						console.log($scope.feed);
						$scope.$close($scope.feed);
					}

					$scope.cancel = function() {
						$scope.$dismiss("cancel");
					}
				}
			}).result.then(function(data) {
				FeedFactory.addFeed({
					rss: data.url,
					title: data.name,
					filters: data.filters,
					regexFilter: data.regexFilter,
					autoDownload: data.autoDownload
				}).then(function(data) {
					// success add, need to refresh list

					FeedFactory.getFeeds().then(function(data) {
						$scope.feeds = data;
					}, function(err) {
						$log.error(err);
					});

					console.log(data);
				}, function(err) {
					$log.error(err);
				});
			}, function(err) {
				$log.error(err);
			});
		}

		$scope.editFeed = function(feed) {
			console.log(feed);
			var modalInstance = $modal.open({
				templateUrl: "partials/edit_feed_modal.html",
				controller: function($scope, $modalInstance, feed) {
					$scope.feed = feed;
					$scope.newFilter = {};

					$scope.title = "Edit \"" + feed.title + "\"";

					$scope.deleteFilter = function(index) {
						$scope.feed.filters.splice(index, 1);
					}

					$scope.addFilter = function(filter) {
						if (!filter.regex && !filter.type) {
							return;
						}

						$scope.feed.filters.push({
							regex: filter.regex,
							type: filter.type
						});
						$scope.newFilter = {
							regex: "",
							type: ""
						};	
					}

					$scope.edit = function(feed) {
						$modalInstance.close(feed);
					}

					$scope.cancel = function() {
						$modalInstance.dismiss("cancel");
					}
				},
				resolve: {
					feed: function() {
						return feed;
					}
				}
			});

			modalInstance.result.then(function(data) {
				FeedFactory.updateFeed(data).then(function(data) {
					$log.debug(data);
				}, function(err) {
					$log.error(err);
				});
			}, function(err) {
				$log.error(err);
			});
		}

		$scope.deleteFeed = function(feed, index) {
			var modalInstance = $modal.open({
				templateUrl: "partials/modal_confirmation.html",
				controller: function($scope, $modalInstance, feed) {
					$scope.title = "Delete \"" + feed.title + "\"?";
					$scope.body = "Deleting will remove the feed from the list.";
					$scope.delete = function() {
						$modalInstance.close(feed);
					}

					$scope.cancel = function() {
						$modalInstance.dismiss("cancel");
					}
				},
				resolve: {
					feed: function() {
						return feed;
					}
				}
			});

			modalInstance.result.then(function(data) {
				FeedFactory.deleteFeed(feed).then(function(data) {
					console.log(data);
					$scope.feeds.splice(index, 1);
				}, function(err) {
					$log.error(err);
				});
			}, function(err) {
				console.log("modal closed/rejected");
				$log.error(err);
			});
		}
	}
]);