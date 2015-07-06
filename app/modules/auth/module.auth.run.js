(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).run([
        '$rootScope',
        '$location',
        '$sessionStorage',
        jcs.modules.auth.services.authorization,
        function ($rootScope, $location, $sessionStorage, authorization) {
            var routeChangeRequiredAfterLogin = false,
                loginRedirectUrl;
            $rootScope.$on('$routeChangeStart', function (event, next) {
                var loggedIn = $sessionStorage.user != undefined;

                var nextOriginalPath = next.originalPath;

                if (nextOriginalPath == jcs.modules.auth.routes.login && loggedIn)
                {
                    $location.path(jcs.modules.pages.routes.home).replace();
                    return;
                }

                var authorised;
                if (routeChangeRequiredAfterLogin && next.originalPath !== jcs.modules.auth.routes.login) {
                    routeChangeRequiredAfterLogin = false;
                    $location.path(loginRedirectUrl).replace();
                } else if (next.access !== undefined) {
                    authorised = authorization.authorize(next.access.loginRequired,
                        next.access.permissions,
                        next.access.permissionCheckType);
                    if (authorised === jcs.modules.auth.enums.authorised.loginRequired) {
                        routeChangeRequiredAfterLogin = true;
                        loginRedirectUrl = next.originalPath;
                        $location.path(jcs.modules.auth.routes.login);
                    } else if (authorised === jcs.modules.auth.enums.authorised.notAuthorised) {
                        $location.path(jcs.modules.auth.routes.notAuthorised).replace();
                    }
                }
                console.log("Authorized type: %O", authorised);
            });

            $rootScope.$on(jcs.modules.auth.events.userLoggedOut, function(){
                delete $sessionStorage.user;
            });

            $rootScope.$on(jcs.modules.auth.events.userLoggedIn, function(e, user){
                // add user to storage
                console.log("data %O, data2 - %O", e, user);
            });
        }]);
}(angular, jcs));