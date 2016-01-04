/*
MODULE
*/
var gsatf = angular.module("gsaTableFormatter", ['ngRoute', 'xeditable']);

/*
options for xeditable

gsatf.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
*/

/*
CONTROLLER
*/
gsatf.controller("SimpleController", ['$scope', 'gsatfFactory', '$location',
    function ($scope, gsatfFactory, $location) {
        
        $scope.table = gsatfFactory.getTable();
        $scope.tableHtml = gsatfFactory.buildHtml();
        
        $scope.processData = function() {
            $scope.table = gsatfFactory.extractData($scope.textarea);
            $scope.tableHtml = gsatfFactory.buildHtml();
            $location.path('view2');
        };
        
        $scope.close = function() {
            $('#submitDataBtn').popover('hide');
        };
        
    }]);


/* 
ROUTE
*/
gsatf.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/view1.html',
            controller: 'SimpleController'
        })
        .when('/view2', {
            templateUrl: 'pages/view2.html',
            controller: 'SimpleController'
        })
        .otherwise({ redirectTo: '/' });
        
}]);

