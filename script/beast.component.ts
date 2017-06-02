namespace beast {

	export class beastController {
		$http: ng.IHttpService;
		$scope: ng.IScope;
		loading: boolean;
		sortIndex: number = 0;
		sortDesc: boolean = true;
		tableData: directive.resizeTable.IResizeTableData[];
		tableEntry: directive.resizeTable.IResizeTableEntry[];

		static $inject = ["$http", "$scope"];
		constructor($http: ng.IHttpService, $scope: ng.IScope) {
			this.$http = $http;
			this.$scope = $scope;

			this.tableData = [];
			this.tableEntry = [];
			this.loadData();
		}

		loadData() {
			let self = this;
			this.loading = true;
			this.$http.get("script/data.json").then(function(data: any){
				data = data.data;
				for(var i = 0; i < data[0].length; ++i) {
					var headerData = data[0][i];
					self.tableData.push(<directive.resizeTable.IResizeTableData> {
						header: headerData.header,
						resizable: headerData.resizable,
						sortable: headerData.sortable,
						searchable: headerData.searchable,
						display: headerData.display,
						width: 250
					});

				}
				for(var j = 0; j< data[1].length; ++j) {
					var td = data[1][j];
					self.tableEntry.push(td);
				}

				self.loading = false;
			});
		}
	}

	export class beastComponent {
		templateUrl: string;
		controller: any;
		controllerAs: string = "ctrl";
		bindings: any;

		constructor() {
			this.templateUrl = "script/beast.tmpl.html";
			this.controller = beastController;
		}
	}

	angular.module("mainApp").component("beast", new beastComponent());
}