/**
 * Created by Valik on 6/29/15.
 */
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.tripExpense, [
            '$scope',
            '$http',
            function ($scope, $http) {
                var name = "tripExpense";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                    console.log($scope.menuItems);
                });

                $scope.showExpenseFlag = true;
                $scope.showCalculationFlag = false;

                $scope.years = [2010, 2011, 2012, 2013, 2014, 2015];
                $scope.selectedYear = $scope.years[0]; // 2010

                $http.get(jcs.modules.pages.models.trips).
                    success(function(data, status, headers, config) {
                        $scope.tableHeaders = data;
                    }).
                    error(function(data, status, headers, config) {
                        // log error
                        console.log("error retrieving trips data");
                    });

                $scope.selectedTrip = $scope.trips[0];

                $scope.showExpenses = function() {
                    $scope.showExpenseFlag = true;
                    $scope.showCalculationFlag = false;
                };

                $scope.showCalculations = function() {
                    $scope.showExpenseFlag = false;
                    $scope.showCalculationFlag = true;
                };

            }
        ]);
}(angular, jcs));