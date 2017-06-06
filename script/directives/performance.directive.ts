namespace directive.performance {
	class performance implements ng.IDirective {
		restrict: 'EA';
		controllerAs: string = "ctrl";
		templateUrl: string = "script/directives/resizeTable.tmpl.html";
		replace: boolean = true;
		scope: {
			headerData: '=',
			rowData: '=',
			header: "@",
		};
		link: any;
		constructor($timeout, $log, TimeTracker) {
			let self = this;
			function _link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: any){
				if(scope.$last) {
					$timeout(function() {
						var time = TimeTracker.reviewListLoaded();
						var ref = new Date(time);
						var end = new Date();
					});
				}
				this.link = _link;
			}
		};

		static factory(): ng.IDirectiveFactory {
			var dir = ($timeout, $log, TimeTracker) => new performance($timeout, $log, TimeTracker);
			dir.$inject = ["$timeout", "$log", 'TimeTracker'];
			return dir;
		}
	}

	angular.module("mainApp")
		.directive("performance", performance.factory());
}