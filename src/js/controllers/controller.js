/*
MODULE
*/
var gsatf = angular.module("gsaTableFormatter", ['ngRoute', 'xeditable']);

/*
CONTROLLER
*/
gsatf.controller("SimpleController", ['$scope', 'gsatfFactory', '$sce', '$location', '$compile',
    function ($scope, gsatfFactory, $sce, $location, $compile) {
        // the $scope variable is the "glue" between the controller (this function) and the View (the html page)
        // by "injecting" the $scope into the controller, it makes it accessible from the view (as long as I use the ng-controller directive in the view)
        $scope.table = gsatfFactory.getTable();
        $scope.tableHtml = gsatfFactory.buildHtml();
        
        $scope.click = function() {
            $scope.table = gsatfFactory.extractData($scope.textarea);
            $scope.tableHtml = gsatfFactory.buildHtml();
            $location.path('view2');
        };
        
        $scope.close = function() {
            $('#submitDataBtn').popover('hide');
        };
        
        $scope.test = {one: "this"};
        
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

/*
options for xeditable

gsatf.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
*/