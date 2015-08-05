(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.calculations, [
            '$scope',
            '$http',
            '$log',
            function ($scope, $http, $log) {
                var name = "calculations";
                $scope.pageHeader = "Calculations";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                    $log.debug($scope.menuItems);
                });
            }
        ]);
}(angular, jcs));