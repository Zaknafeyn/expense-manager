(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).run([
        '$rootScope',
        '$location',
        '$sessionStorage',
        'storage',
        'eventbus',
        jcs.modules.auth.services.authorization,
        function ($rootScope, $location, $sessionStorage, authorization, storage, eventbus) {
            var routeChangeRequiredAfterLogin = false,
                loginRedirectUrl;
            $rootScope.$on('$routeChangeStart', function (event, next) {
                var loggedIn = $sessionStorage.user != undefined;
                //var loggedIn = storage.getCurrentUser() != undefined;

                if (loggedIn)
                    return;
                
                var nextOriginalPath = next.originalPath;

                if (nextOriginalPath == jcs.modules.auth.routes.login && loggedIn)
                {
                    $location.path(jcs.modules.pages.routes.home).replace();
                    return;
                }

                var authorised;
                console.log("checking route ... ");
                /*if (routeChangeRequiredAfterLogin && next.originalPath !== jcs.modules.auth.routes.login) {
                    routeChangeRequiredAfterLogin = false;
                    $location.path(loginRedirectUrl).replace();
                } else*/ if (next.access !== undefined) {
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
            });

            $rootScope.$on(jcs.modules.auth.events.userLoggedOut, function(){
                delete $sessionStorage.user;
                //storage.deleteUser();
            });

            $rootScope.$on(jcs.modules.auth.events.userLoggedIn, function(e, user){
                // add user to storage
                //storage.storeUser(user);
                $sessionStorage.user = user;
            });

            $rootScope.$on(jcs.modules.pages.events.profileUpdated, function(e, profile){
            //eventbus.subscribe(jcs.modules.pages.events.profileUpdated, function(e, profile){
                // update user name
                //storage.updateUser(profile.name);
                $sessionStorage.user.name = profile.name;
            });

        }]);
}(angular, jcs));