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
		order: number;

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
			headerData: '<',
			rowData: '<',
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

				scope.getIndexFromKey = function(key) {
					for(var j = 0; j < scope.tableData.length; ++j) {
						var data = scope.tableData[j];
						if(data.header == key) return j;
					}
				}

				scope.getEntry = function(value) {
					var keys = Object.keys(value);
					var dict = {};
					var ret = [];
					for(var i = 0; i < keys.length; ++i) {
						var key = keys[i];
						var order = scope.tableData[scope.getIndexFromKey(key)].order;
						dict[order] = value[key]; 
					}

					for (var i = 0; i < scope.tableData.length; ++i) {
						ret.push(dict[i]);
					}
					return ret;
				}

				scope.swapOrder = function(index: number) {
					scope.sortDesc = scope.sortIndex == index ? !scope.sortDesc : false;
					scope.sortIndex = index;

					scope.updateOrder();
				}

				scope.updateOrder = function() {
					scope.tableEntry.sort(function(a:IResizeTableEntry, b:IResizeTableEntry) {
						var aData = a[scope.tableData[scope.sortIndex].header];
						var bData = b[scope.tableData[scope.sortIndex].header];
						var flip = scope.sortDesc ? 1 : -1;
						if(aData < bData) return -1 * flip;
						if(aData > bData) return 1 * flip;
						return 0 * flip;
					});
				}

				scope.getWidth = function(index: number){
					var width = scope.tableData[index].width + "px";
					return {'width': width};
				}

				scope.stopProp = function(event) {
					event.stopPropagation();
				}

				scope.updatePages = function() {
					$("html, body").animate({ scrollTop: 0}, 'fast');
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

				scope.getGifCode = function(val) {
					let code = val.split("\\");
					return "[mon]" + code[code.length - 1] + "[/mon]";
				}

				scope.getImageCode = function(index) {
					return "[mon]" + scope.tableEntry[index].Name + "[/mon]";
				}

				scope.checkImage = function(val: string) {
					return val.indexOf("\\") > -1;
				}

				scope.formatValue = function(val: string, index: number, parentIndex: number) {
					if (scope.tableData[scope.getIndexFromKey("pictureName")].order == index) { 
						return scope.getImageCode(parentIndex) + scope.getGifCode(val);
					}
					else if(scope.tableData[scope.getIndexFromKey("Location")].order == index) {
						return val.split(",").join("<br />");
					}
					else if(scope.tableData[scope.getIndexFromKey("Info")].order == index) {
						return val.split(",").join("<br />");
					}
					else return val;
				}

				scope.getLink = function(val: string) {
					return val.replace("monsters", "images") + ".gif";
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
					currentWidth: '=currentWidth',
					minWidth: '@?'
				},
				link: function(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: any){
					let self = this;

					element.on('mousedown', function(e) {
						e.stopPropagation();

						if(scope.minWidth == undefined) scope.minWidth = 95;

						self.down = true;
						self.oldX = e.pageX;
						self.left = element.position().left;

						$('td').each(function(){$(this).addClass('noselect')});
						$timeout(mousemove, 16);
						$document.on('mousemove', eMousemove);
						$document.on('mouseup', mouseup);
					});

					function mousemove() {
						if(self.down) $timeout(mousemove, 16);
						if(self.x == null) return;
						var delta = self.x - self.oldX;
						if(scope.currentWidth + delta <= scope.minWidth) return;
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
