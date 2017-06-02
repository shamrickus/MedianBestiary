(function() {
	'use strict';

	var app = angular.module('mainApp', ['ngMaterial', 'ngMessages', 'ngAnimate']);

	app.directive("sticky", function($window: ng.IWindowService){
		return {
			restrict: 'A',
			link: function(scope: ng.IScope, element: JQuery, attrs: ng.IAttributes){
				element.ready(function(){
					var $win = angular.element($window);
					if (scope._stickyElements === undefined) {
						scope._stickyElements = [];

						$win.bind("scroll", function(e) {
							var pos = $win.scrollTop();
							for (var i=0; i<scope._stickyElements.length; i++) {
								var item = scope._stickyElements[i];
								var left = $("#tableHeader").offset().left;

								//Height check
								if (!item.isStuck && pos > item.start) {
									item.element.addClass("stuck");
									item.isStuck = true;
									if (item.placeholder) {
										item.placeholder = angular.element("<div></div>")
												.css({height: item.element.outerHeight() + "px"
													, left: item.left})
												.insertBefore(item.element);
									}
									item.element.css({'left': left});
								}
								else if (item.isStuck && pos <= item.start) {
									item.element.css({'left': 0})
									item.element.removeClass("stuck");
									item.isStuck = false;

									if (item.placeholder) {
										item.placeholder.remove();
										item.placeholder = true;
									}
								}
							}
						});

						var recheckPositions = function() {
							for (var i=0; i<scope._stickyElements.length; i++) {
								var item = scope._stickyElements[i];
								if (!item.isStuck) {
									item.start = item.element.offset().top;
								} else if (item.placeholder) {
									item.start = item.placeholder.offset().top;
								}
							}
						};
						$win.bind("load", recheckPositions);
						$win.bind("resize", recheckPositions);
					}

					function init(): {} {
						return {
							element: element,
							isStuck: false,
							placeholder: attrs.usePlaceholder !== undefined,
							start: element.offset().top,
							left: element.offset().left,
							id: attrs.columnId
						}
					}
					var item = init();

					scope._stickyElements.push(item);
				});

			}
		}
	});
})();