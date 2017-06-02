namespace directive.resizeTable {
	export interface IResizeTableEntry {
		[header: string]: string;
	}

	export interface IResizeTableData {
		header: string;
		resizable: boolean;
		sortable: boolean;
		searchable: boolean;
		display: boolean;

		width: number;
	}

	class resizeTable implements ng.IDirective{
		headerText: string;
		tableData: IResizeTableData[];
		tableEntry: IResizeTableEntry[];
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
		sortIndex: number = 0;
		sortDesc: boolean = false;

		constructor() {
			let self = this;
			function _link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: any){
				scope.headerText = attrs.header;
				scope.tableData = JSON.parse(attrs.headerData);
				scope.tableEntry = JSON.parse(attrs.rowData);
				scope.sortIndex  = self.sortIndex;
				scope.sortDesc = self.sortDesc;
				scope.pages = [10, 25, 50, 100, "All"];
				scope.pageCount = scope.pages[0];
				scope.pageNumber = 0;
				scope.lowerPage = 1;
				scope.upperPage = scope.pageCount;

				scope.getEntry = function(value) {
					var o = Object.keys(value).map(function(key){ return value[key]; });
					return o;
				}

				scope.swapOrder = function(index: number) {
					scope.sortDesc = scope.sortIndex == index ? !scope.sortDesc : false;
					scope.sortIndex = index;

					scope.updateOrder();
				}

				scope.updateOrder = function() {
					scope.tableEntry.sort(scope.sortEntry);
				}

				scope.sortEntry = function(a:IResizeTableEntry, b:IResizeTableEntry) {
					var aData = a[scope.tableData[scope.sortIndex].header];
					var bData = b[scope.tableData[scope.sortIndex].header];
					if(aData < bData) return -1 * scope.sortDesc ? 1 : -1;
					if(aData > bData) return 1 * scope.sortDesc ? 1 : -1;
					return 0 * scope.sortDesc ? 1 : -1;
				}

				scope.getWidth = function(index: number){
					var width = scope.tableData[index].width + "px";
					return {'width': width};
				}

				scope.stopProp = function(event) {
					event.stopPropagation();
				}

				scope.updatePages = function() {
					if(scope.pageCount == "All") {
						scope.lowerPage = 1;
						scope.upperPage = scope.tableEntry.length;
					}
					else {
						scope.lowerPage = scope.pageNumber * scope.pageCount;
						scope.upperPage = scope.lowerPage + scope.pageCount;
						if(scope.lowerPage == 0) scope.lowerPage = 1;
					}
				}

				scope.hasPreviousPage = function() {
					return scope.pageNumber > 0;
				}
				scope.previousPage = function() {
					if(scope.hasPreviousPage()) {
						scope.pageNumber--;
						scope.updatePages();
					}
				}

				scope.hasNextPage = function() {
					return scope.pageNumber < scope.tableEntry.length;
				}
				scope.nextPage = function() {
					if(scope.hasNextPage()) {
						scope.pageNumber++;
						scope.updatePages();
					}
				}

			}

			this.link = _link;
		}
		static factory(): ng.IDirectiveFactory {
			var dir = () => new resizeTable();
			dir.$inject = [];
			return dir;
		}
	};

	angular.module("mainApp")
		.directive("resizeTable", resizeTable.factory())
		.filter('startFrom', function() {
			return function(input, start) {
				start = +start;
				return input.slice(start);
			}
		})
		.directive("widthSlider", ['$document', '$timeout', function($document, $timeout) {
			return {
				restrict: 'A',
				scope: {
					currentWidth: '=currentWidth'
				},
				link: function(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: any){
					let self = this;

					element.on('mousedown', function(e) {
						e.stopPropagation();

						self.down = true;
						self.oldX = e.pageX;
						self.left = element.position().left;

						$('td').each(function(){$(this).addClass('noselect')});
						$timeout(mousemove, 2);
						$document.on('mousemove', eMousemove);
						$document.on('mouseup', mouseup);
					});

					function mousemove() {
						if(self.down) $timeout(mousemove, 2);
						if(self.x == null) return;
						var delta = self.x - self.oldX;
						self.oldX = self.x;
						scope.currentWidth += delta;
					}

					function eMousemove(e){
						self.x = e.pageX;
					};

					function mouseup(e) {
						$('td').each(function(){$(this).removeClass('noselect')});
						self.down = false;
						self.x = null;
						self.oldX = null;
						$document.unbind('mousemove', eMousemove);
						$document.unbind('mouseup', mouseup);

					}
				}
			}
		}
	]);
}