(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).controller(jcs.modules.auth.controllers.login, [
        '$scope',
        '$location',
        jcs.modules.auth.services.authentication,
        function ($scope, $location, authentication) {
            var isLoggedIn = authentication.isLoggedInUser();
            if (isLoggedIn){
                console.log("User is logged in");
                return;
            }

            $scope.loginModel = {};
            $scope.isBusy = false;
            $scope.invalidLogin = false;

            $scope.login = function () {
                $scope.invalidLogin = false;
                $scope.isBusy = true;
                authentication.login($scope.loginModel.login, $scope.loginModel.password)
                .then(function () {
                    $location.path(jcs.modules.pages.routes.home);
                }, function () {
                    $scope.invalidLogin = true;
                })['finally'](function () {
                    $scope.isBusy = false;
                });
            };
        }
    ]);
}(angular, jcs));