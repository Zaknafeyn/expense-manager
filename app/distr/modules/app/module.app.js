(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.app.name)
    .config(['ngToastProvider', function(ngToast) {
        ngToast.configure({
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            maxNumber: 3,
            animation : 'slide'
        });
    }]);

}(angular, jcs));
(function (angular, jcs) {
    'use strict';


    angular.module(jcs.modules.app.name).run([
        '$rootScope',
        function ($rootScope) {
            console.log("app.run");
        }]);

}(angular, jcs));
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.app.name).config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.otherwise({ redirectTo: '/home' });
        }]);

//    var checkRouting = function ($q, $rootScope, $location) {
//        console.log("Changing route");
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
