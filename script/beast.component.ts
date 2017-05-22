namespace beast {
	interface IReturnResult {
		data: any[];
	}

	interface ITableData {
		Name: string;
		immunity: string;
		location: string;
		skills: string;
		evade: string;
		info: string;
		trivia: string;
		monsterType: string;
		pictureName: string;
	}

	interface IHeaderData {
		display: boolean;
		name: string;
		sortable: boolean;
		searchable: boolean;
		source: string;
	}
	export class beastController {
		header: IHeaderData[];
		data: ITableData[];
		$http: ng.IHttpService;
		$scope: ng.IScope;
		loading: boolean;
		pageSizes: string[];
		pageValue: string;
		pageNumber: number;
		lowerEntry: number;
		higherEntry: number;

		sortName: string;
		sortDesc: boolean;
		slices: number;

		static $inject = ["$http", "$scope"];
		constructor($http: ng.IHttpService, $scope: ng.IScope) {
			this.$http = $http;
			this.$scope = $scope;
			this.pageSizes = ["10", "25", "50", "100", "All"];
			this.pageValue = this.pageSizes[0];
			this.pageNumber = 0;

			this.data = [];
			this.header = [];

			this.loadData();
		}

		loadData() {
			let self = this;
			this.loading = true;
			this.$http.get("script/data.json").then(function(data: IReturnResult){
				self.header = data.data[0];
				self.data = data.data[1];
				self.loading = false;

				self.updatePages();
			});
		}

		updatePages() {
			if(this.pageValue == "All") {
				this.lowerEntry = 1;
				this.higherEntry = this.data.length;
			}
			else {
				let value = parseInt(this.pageValue);
				this.lowerEntry = value * (this.pageNumber);
				this.higherEntry = this.lowerEntry + value;
				if(this.lowerEntry == 0) this.lowerEntry = 1;
			}
			this.slices = parseInt(this.pageValue) / this.data.length;
		}

		nextPage() {
			if(this.pageNumber < this.data.length){
				this.pageNumber++;
				this.updatePages();
			}
		}

		previousPage() {
			if(this.pageNumber > 0){
				this.pageNumber--;
				this.updatePages();
			}
		}

		showEntry(index: number) {
			return (this.lowerEntry - 1 <= index && this.higherEntry > index);
		}

		sort(column: string) {
			if(this.sortName == column) this.sortDesc = !this.sortDesc;
			else {
				this.sortName = column;
				this.sortDesc = false;
			}
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