(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).factory(jcs.modules.auth.services.authentication, [
        '$q',
        '$timeout',
        '$http',
        '$rootScope',
        'eventbus',
        jcs.modules.auth.services.storage,
        "loginProvider",
        function ($q, $timeout, $http, $rootScope, eventbus, storage, loginProvider ) {
            var currentUser,
                createUser = function (id, name, permissions) {
                    var newUser = {
                        id: id,
                        name: name,
                        permissions: permissions
                    };
                    storage.storeUser(newUser);
                    return newUser;
                },
                login = function (email, password) {

                    var defer = $q.defer();

                    if (isLoggedInUser()){
                        currentUser = storage.getCurrentUser();
                        defer.resolve(currentUser);
                    }
                    else {
                        var profilePromise = loginProvider.getProfile(email, password);
                        profilePromise.then(function(profile){
                            if (profile == undefined)
                                defer.reject('Unknown Username / Password combination');
                            currentUser = createUser(profile.id, profile.name, ['Admin']);
                            defer.resolve(currentUser);
                            raiseEvent(jcs.modules.auth.events.userLoggedIn, currentUser);
                        });
                    }

                    return defer.promise;
                },
                logout = function () {
                    // we should only remove the current user.
                    // routing back to login login page is something we shouldn't
                    // do here as we are mixing responsibilities if we do.
                    currentUser = undefined;
                    storage.deleteUser();
                    //eventbus.broadcast(jcs.modules.auth.events.userLoggedOut);
                    raiseEvent(jcs.modules.auth.events.userLoggedOut);
                },
                isLoggedInUser = function() {
                    console.log("Check if user logged in ... ");

                    var result = storage.getCurrentUser() != undefined;
                    console.log("User is %slogged in", result?"":"not ");
                    return result;
                },
                getCurrentLoginUser = function () {
                    if (currentUser == undefined)
                        currentUser = storage.getCurrentUser();
                    return currentUser;
                };

            var raiseEvent = function(name, data){
               eventbus.broadcast(name, data);
            };

            return {
                login: login,
                logout: logout,
                getCurrentLoginUser: getCurrentLoginUser,
                isLoggedInUser : isLoggedInUser
            };
        }
    ]);
}(angular, jcs));