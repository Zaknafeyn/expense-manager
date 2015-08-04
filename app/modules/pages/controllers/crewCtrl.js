(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.crew, [
            '$scope',
            '$http',
            '$log',
            function ($scope, $http, $log) {
                var name = "crew";
                $scope.pageHeader = "Crew";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                    $log.debug($scope.menuItems);
                });
            }
        ]);
}(angular, jcs));