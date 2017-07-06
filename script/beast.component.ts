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

		getIndexByKey(key) {
			for(var i = 0; i < this.tableEntry.length; ++i) {
				if(key == this.tableEntry[i]["Name"]) return i;
			}
		}

		loadData() {
			let self = this;
			this.loading = true;
			this.$http.get("script/data.json").then(function(entries: any){
				entries = entries.data;
				for(var i = 0; i < entries[0].length; ++i) {
					var headerData = entries[0][i];
					self.tableData.push(<directive.resizeTable.IResizeTableData> {
						header: headerData.header,
						resizable: headerData.resizable,
						sortable: headerData.sortable,
						searchable: headerData.searchable,
						display: headerData.display,
						order: headerData.order,
						width: headerData.width == null ? 250 : headerData.width
					});
				}
				for(var j = 0; j< entries[1].length; ++j) {
					var td = entries[1][j];
					self.tableEntry.push(td);
				}

				self.tableData.sort(function(a, b) {
					if(a.order < b.order) return -1;
					if(a.order > b.order) return 1;
					return 0;
				});

				self.$http.get("script/images.json").then(function(data: any){
					data = data.data;
					for(var i = 0; i < data.length; ++i) {
						var row = data[i];
						var index = self.getIndexByKey(row[0]);
						if(index == null) continue;
						self.tableEntry[index]["pictureName"] = row[2] + "\\" + row[1];
					}
					self.loading = false;
				});

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