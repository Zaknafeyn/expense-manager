(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.currencies, [
            '$scope',
            '$http',
            '$log',
            function ($scope, $http, $log) {

                $scope.pageHeader = "Currencies";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                    $log.debug($scope.menuItems);
                });


                //var url = "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=3";
                //var url = "http://content.finance.ua/ru/xml/currency-cash";
                var url = "http://localhost:59184/api/v1/Currencies";
                $http.get(url).
                    success(function(data, status, headers, config) {
                        $log.debug("Currencies data: %O", data);
                        $scope.currencies = data;
                    }).
                    error(function(data, status, headers, config) {
                        // Log error
                        $log.debug("Error retrieving currencies data");
                    });
            }
        ]);
}(angular, jcs));