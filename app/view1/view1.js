'use strict';

var view11App = angular.module('myApp.view1', ['ngRoute']);

view11App .config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}]);

view11App.controller('View1Ctrl', function($scope) {
    $scope.viewName = "View 1";
});