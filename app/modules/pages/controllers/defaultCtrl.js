/**
 * Created by Valik on 6/28/15.
 */
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.default, [
            '$scope',
            '$http',
            function ($scope, $http) {

                $scope.showExpenseFlag = true;
                $scope.showCalculationFlag = false;

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