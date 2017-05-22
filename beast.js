angular.module('app', ['ngMaterial'])
  .controller('mainController', ['$scope', function($scope) {
        
        $scope.data = data;

        $scope.getColumnByName = function(col) {
            for(var head in $scope.header) {
                head = $scope.header[head];
                if(head.friendlyName == col){
                    return head;
                }
            }
        }

        $scope.getRowByName = function(data){
            var retObj = {};
            for (var key in data){
                if (data.hasOwnProperty(key)){
                    var col = $scope.getColumnByName(key);
                    if(col != null && col["display"]) retObj[key] = data[key];
                }
            }
            return retObj;
        }

        $scope.getHeader = function(){
            return $scope.header.filter(function(x){return x.display;});
        }

        $scope.getRow = function(){
            return $scope.data.map(function(x){return $scope.getRowByName(x)})
        }

  }]);