/**
 * Created by Valik on 6/28/15.
 */
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name).config([
        '$routeProvider',

        function ($routeProvider) {
            $routeProvider.when(jcs.modules.pages.routes.home, {
                controller: jcs.modules.pages.controllers.default,
                templateUrl: jcs.modules.pages.templates.home,
                access: {
                    loginRequired: true
                }
            }).when(jcs.modules.pages.routes.tripExpense, {
                controller: jcs.modules.pages.controllers.tripExpense,
                templateUrl: jcs.modules.pages.templates.tripExpense,
//                resolve: {
//                    factory: checkRouting
//                },
                access: {
                    loginRequired: true
//                    permissions: ['User']
                }
            }).when(jcs.modules.pages.routes.calculations, {
                controller: jcs.modules.pages.controllers.calculations,
                templateUrl: jcs.modules.pages.templates.calculations,
                access: {
                    loginRequired: true
                }
            }).when(jcs.modules.pages.routes.profile, {
                controller: jcs.modules.pages.controllers.profile,
                templateUrl: jcs.modules.pages.templates.profile,
                access: {
                    loginRequired: true
                }
            }).
            otherwise({redirectTo: jcs.modules.pages.routes.home});
        }]);

//    var checkRouting = function ($q, $rootScope, $location) {
//        if ($rootScope.userProfile) {
//            return true;
//        } else {
//            var deferred = $q.defer();
//            $http.post("/loadUserProfile", { userToken: "blah" })
//                .success(function (response) {
//                    $rootScope.userProfile = response.userProfile;
//                    deferred.resolve(true);
//                })
//                .error(function () {
//                    deferred.reject();
//                    $location.path("/");
//                });
//            return deferred.promise;
//        }
//    };
}(angular, jcs));