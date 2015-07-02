(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.profile, [
            '$scope',
            'storage',
            function ($scope, storage) {
                $scope.currentProfile = {
                    "login": "admin@test.com",
                    "password": "admin@test.com",
                    "email": "admin@test.com",
                    "name": "Admin User - from file",
                    "hasCar" : "true"
                };

                $scope.updateProfile = function(){
                    console.log("Store profile %O to DB.", $scope.currentProfile);
                };
            }
        ]);
}(angular, jcs));