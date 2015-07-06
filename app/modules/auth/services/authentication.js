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
                createUser = function (name, permissions) {
                    var newUser = {
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
                            currentUser = createUser(profile.name, ['Admin']);
                            defer.resolve(currentUser);
                            raiseEvent(jcs.modules.auth.events.userLoggedIn, currentUser);
                        });

//                        // only here to simulate a network call!!!!!
//                        $timeout(function () {
//                            // for the sake of the demo this is hard code
//                            // however this would always be a call to the server.
//                            email = email.toLowerCase();
//                            if (email === 'admin@test.com') {
//                                currentUser = createUser('Admin User', ['Admin']);
//                            } else if (email === 'manager@test.com') {
//                                currentUser = createUser('Manager User', ['UserManager']);
//                            } else if (email === 'user@test.com') {
//                                currentUser = createUser('Normal User', ['User']);
//                            } else {
//                                defer.reject('Unknown Username / Password combination');
//                                return;
//                            }
//
//                            defer.resolve(currentUser);
//                            raiseEvent(jcs.modules.auth.events.userLoggedIn, currentUser);
//                        }, 1000);
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
                    return currentUser;
                };

            var raiseEvent = function(name, data){
               eventbus.broadcast(name, data);
//                $rootScope.$broadcast(name, data);
                // $rootScope.$emit(name, data);
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