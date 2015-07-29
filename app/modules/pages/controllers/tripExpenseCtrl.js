(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.tripExpense, [
            '$scope',
            '$http',
            function ($scope, $http) {
                var name = "tripExpense";
                $scope.pageHeader = "Trip expenses";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                });

                console.log("%O", $http);
                console.log("URL years:" + jcs.modules.pages.api.years);
                $http.get(jcs.modules.pages.api.years).
                    success(function(data, status, headers, config) {
                        $scope.years = data;
                        $scope.selectedYear = $scope.years[0]; // 2010
                    }).
                    error(function(data, status, headers, config) {
                        // log error
                        console.log("Error retrieving years data. Data - %O, status - %O, headers - %O, config - %O", data, status, headers, config);
                    });

                console.log("URL tournaments:" + jcs.modules.pages.api.tournaments);
                $http.get(jcs.modules.pages.api.tournaments).
                    success(function(data, status, headers, config) {
                        $scope.tournaments = data;
                        $scope.selectedTrip = $scope.tournaments[0];
                    }).
                    error(function(data, status, headers, config) {
                        // log error
                        console.log("Error retrieving tournaments data");
                    });
                
            }
        ]);
}(angular, jcs));