'use strict';

var addEntryViewApp = angular.module('myApp.addEntryView', ['ngRoute']);

addEntryViewApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addEntryView', {
    templateUrl: 'addEntryView/addEntryView.html',
    controller: 'addEntryViewCtrl'
  });
}]);

addEntryViewApp.controller('addEntryViewCtrl', function($scope) {
    $scope.viewName = "add entry view";

    $scope.categories = [
        "Бензин",
        "Страховка",
        "Стоянка",
        "Другое"
    ];

    $scope.entries = [
        {
            "category": "0",
            "comment" : "Patrol",
            "sum" : "100.6"
        },
        {
            "category": "2",
            "comment" : "Parking",
            "sum" : "10.6"
        },
        {
            "category": "1",
            "comment" : "Green card",
            "sum" : "23.6"
        }
    ];

    $scope.selectedCategory = "";
    $scope.comment = "";
    $scope.sum = "";

    $scope.add = function(item){
        $scope.entries.push(item);
    };

    $scope.getTotal = function(){
        var total = -0;
        for(var i = 0; i < $scope.entries.length; i++){
            var product = $scope.entries[i];
            total += product.sum;
        }

        return parseFloat(total);
    };

});