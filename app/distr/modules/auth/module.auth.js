(function (angular, jcs) {
    'use strict';

    jcs.modules.auth = {
        name: 'auth',
        enums: {
            authorised: {
                authorised: 0,
                loginRequired: 1,
                notAuthorised: 2
            },
            permissionCheckType: {
                atLeastOne: 0,
                combinationRequired: 1
            }
        },
        events: {
            userLoggedIn: 'auth:user:loggedIn',
            userLoggedOut: 'auth:user:loggedOut'
        },
        controllers: {
            login: 'loginCtrl'
        },
        services: {
            authentication: 'authentication',
            authorization: 'authorization',
            storage: 'storage'
        },
        routes: {
            login: '/login',
            notAuthorised: '/not-authorised'
        }
    };

    angular.module(jcs.modules.auth.name, [
        'ngRoute',
        jcs.modules.core.name
    ]);


}(angular, jcs));
/**
 * Created by Valik on 6/27/15.
 */
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when(jcs.modules.auth.routes.login, {
                controller: jcs.modules.auth.controllers.login,
                templateUrl: 'modules/auth/html/login.tmpl.html'
            });
            $routeProvider.when(jcs.modules.auth.routes.notAuthorised, {
                controller: jcs.modules.auth.controllers.login,
                templateUrl: 'modules/auth/html/not-authorised.tmpl.html'
            });

//            $routeProvider.otherwise({ redirectTo: jcs.modules.auth.routes.login });
        }]);


}(angular, jcs));

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
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).directive('access', [
        jcs.modules.auth.services.authorization,
        function (authorization) {
            console.log("Checking access directive");
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var makeVisible = function () {
                            element.removeClass('hidden');
                        },
                        makeHidden = function () {
                            element.addClass('hidden');
                        },
                        determineVisibility = function (resetFirst) {
                            var result;
                            if (resetFirst) {
                                makeVisible();
                            }

                            result = authorization.authorize(true, roles, attrs.accessPermissionType);
                            if (result === jcs.modules.auth.enums.authorised.authorised) {
                                makeVisible();
                            } else {
                                makeHidden();
                            }
                        },
                        roles = attrs.access.split(',');


                    if (roles.length > 0) {
                        determineVisibility(true);
                    }
                }
            };
        }]);
}(angular, jcs));
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
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).factory(jcs.modules.auth.services.authorization, [
        'authentication',
        function (authentication) {
            var authorize = function (loginRequired, requiredPermissions, permissionCheckType) {
                var result = jcs.modules.auth.enums.authorised.authorised,
                    user = authentication.getCurrentLoginUser(),
                    loweredPermissions = [],
                    hasPermission = true,
                    permission, i;

                permissionCheckType = permissionCheckType || jcs.modules.auth.enums.permissionCheckType.atLeastOne;
                if (loginRequired === true && user === undefined) {
                    result = jcs.modules.auth.enums.authorised.loginRequired;
                } else if ((loginRequired === true && user !== undefined) &&
                    (requiredPermissions === undefined || requiredPermissions.length === 0)) {
                    // Login is required but no specific permissions are specified.
                    result = jcs.modules.auth.enums.authorised.authorised;
                } else if (requiredPermissions) {
                    loweredPermissions = [];
                    angular.forEach(user.permissions, function (permission) {
                        loweredPermissions.push(permission.toLowerCase());
                    });

                    for (i = 0; i < requiredPermissions.length; i += 1) {
                        permission = requiredPermissions[i].toLowerCase();

                        if (permissionCheckType === jcs.modules.auth.enums.permissionCheckType.combinationRequired) {
                            hasPermission = hasPermission && loweredPermissions.indexOf(permission) > -1;
                            // if all the permissions are required and hasPermission is false there is no point carrying on
                            if (hasPermission === false) {
                                break;
                            }
                        } else if (permissionCheckType === jcs.modules.auth.enums.permissionCheckType.atLeastOne) {
                            hasPermission = loweredPermissions.indexOf(permission) > -1;
                            // if we only need one of the permissions and we have it there is no point carrying on
                            if (hasPermission) {
                                break;
                            }
                        }
                    }

                    result = hasPermission ? jcs.modules.auth.enums.authorised.authorised : jcs.modules.auth.enums.authorised.notAuthorised;
                }

                return result;
            };

            return {
                authorize: authorize
            };
        }]);
}(angular, jcs));
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).factory("loginProvider", [
        '$q',
        '$http',
        'md5',
        function ($q, $http, md5) {
            var loadData = function(login, password){
                    var defer = $q.defer(),
                        loginData = undefined;

                    var passwordHash = md5.createHash(password);
                    var loginHash = md5.createHash(login);

                    var postData = {login : login, loginHash : loginHash, passwordHash : passwordHash};
                    console.log("Post data %O", JSON.stringify(postData));
                    // $http.post("http://localhost:59184/api/login", JSON.stringify(postData)).
                    $http.post("http://expense-manager-backend.azurewebsites.net/api/login", JSON.stringify(postData)).
                        success(function(data, status, headers, config) {
                            console.log("%O", data);
                            loginData = data;

                            defer.resolve(loginData);
                        }).
                        error(function(data, status, headers, config) {
                            // log error
                            console.log("error retrieving trips data");
                            defer.reject('Cannot retrieve data from service');
                        });
                    return defer.promise;
                },
                getProfileUrl = function(id){
                    return "http://expense-manager-backend.azurewebsites.net/api/profiles/" + id;
                },
                getProfile = function(login, password) {
                    return loadData(login, password).then(function(profile){
                        return profile;
                    });
                },
                getProfileById = function(id) {
                    var defer = $q.defer();

                    $http.get(getProfileUrl(id)).
                        success(function(data, status, headers, config) {
                            defer.resolve(data);
                        }).
                        error(function(data, status, headers, config) {
                            // log error
                            console.log("Cannot retrieve profile data fro id " + id);
                            defer.reject('Cannot retrieve data from service');
                        });
                    return defer.promise;
                },
                updateProfile = function(profile) {
                    var defer = $q.defer();

                    $http.post("http://expense-manager-backend.azurewebsites.net/api/profiles/", JSON.stringify(profile)).
                        success(function(data, status, headers, config) {
                            defer.resolve();
                        }).
                        error(function(data, status, headers, config) {
                            // log error
                            console.log("Cannot retrieve profile data fro id " + id);
                            defer.reject('Cannot post data to service');
                        });
                    return defer.promise;
                };
            return {
                getProfile : getProfile,
                getProfileById : getProfileById,
                updateProfile : updateProfile
            }
        }])
}(angular, jcs));
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).factory(jcs.modules.auth.services.storage, [
        '$sessionStorage',
        function ($sessionStorage) {
            var storeUser = function (user) {
                    $sessionStorage.user = user;

                    return user;
                },
                getCurrentUser = function(){
                    if ($sessionStorage == undefined)
                        return;

                    return $sessionStorage.user;
                },
                deleteUser = function () {
                    delete $sessionStorage.user;
                },
                updateUser = function(name) {
                    $sessionStorage.user.name = name;
                };

            return {
                storeUser: storeUser,
                getCurrentUser: getCurrentUser,
                deleteUser: deleteUser,
                updateUser : updateUser
            };
        }
    ]);
}(angular, jcs));