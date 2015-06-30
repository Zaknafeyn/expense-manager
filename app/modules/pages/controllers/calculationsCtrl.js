/**
 * Created by Valik on 6/29/15.
 */
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.calculations, [
            '$scope',
            '$http',
            function ($scope, $http) {
                var name = "calculations";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                    console.log($scope.menuItems);
                });
            }
        ]);
}(angular, jcs));