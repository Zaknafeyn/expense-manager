(function (angular, jcs) {
    'use strict';

    //var apiServer = "http://expense-manager-backend.azurewebsites.net";
    var apiServer = "http://localhost:59184";
    jcs.modules.pages = {
        apiServer : apiServer,
        name: 'pages',
        controllers: {
            default: 'defaultCtrl',
            tripExpense: 'tripExpenseCtrl',
            calculations: 'calculationsCtrl',
            profile: 'profileCtrl',
            crew: 'crewCtrl'
        },
        routes: {
            home: '/home',
            tripExpense: '/tripExpense',
            calculations: '/calculations',
            profile: '/profile',
            crew: '/crew'
        },
        templates: {
            home: 'modules/pages/html/home.tmpl.html',
            tripExpense: 'modules/pages/html/tripExpense.tmpl.html',
            calculations: 'modules/pages/html/calculations.tmpl.html',
            profile: 'modules/pages/html/profile.tmpl.html',
            crew: 'modules/pages/html/crew.tmpl.html'
        },
        models :{
            trips : 'modules/pages/models/trips.json',
            menu : 'modules/pages/models/menu.json'
        },
        api: {
            profiles: apiServer + '/api/profiles',
            login: apiServer + '/api/login',
            tournaments: apiServer + '/api/Tournaments',
            years: apiServer + '/api/Years',
            tournamentsPerYear: apiServer + '/api/Tournaments/filter/year/'
        },
        events : {
            profileUpdated : "pages:profile:profileUpdated"
        },
        common : {
            getMenu : function (name, http, callback){
                var menuList = [];
                http.get(jcs.modules.pages.models.menu).
                    success(function(data) {
                        for(var menuItem in data){
                            var btnClass = "btn-sm ";
                            btnClass += (data[menuItem].name == name)? "btn-primary" : "btn-default";
                            console.log(btnClass);
                            var newMenuItem = {
                                "name": data[menuItem].name,
                                "text": data[menuItem].text,
                                "link": data[menuItem].link,
                                "icon" : data[menuItem].icon,
                                "menuClass": btnClass
                            };

                            menuList.push(newMenuItem);
                        };

                        callback(menuList);
                    }).
                    error(function(data, status, headers, config) {
                        // log error
                        console.log("Error retrieving menu data");
                    });

            }
        }
    };

    angular.module(jcs.modules.pages.name, [
        'ngRoute'
    ]);
}(angular, jcs));
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
            }).when(jcs.modules.pages.routes.crew, {
                controller: jcs.modules.pages.controllers.crew,
                templateUrl: jcs.modules.pages.templates.crew,
                access: {
                    loginRequired: true
                }
            }).otherwise({redirectTo: jcs.modules.pages.routes.home});
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
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.calculations, [
            '$scope',
            '$http',
            function ($scope, $http) {
                var name = "calculations";
                $scope.pageHeader = "Calculations";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                    console.log($scope.menuItems);
                });
            }
        ]);
}(angular, jcs));
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.crew, [
            '$scope',
            '$http',
            function ($scope, $http) {
                var name = "crew";
                $scope.pageHeader = "Crew";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                    console.log($scope.menuItems);
                });
            }
        ]);
}(angular, jcs));
/**
 * Created by Valik on 6/28/15.
 */
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.default, [
            '$scope',
            '$http',
            function ($scope, $http) {


                $scope.pageHeader = "Expense manager";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                    console.log($scope.menuItems);
                });

                //$scope.tripSelected = false;

            }
        ]);
}(angular, jcs));
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.profile, [
            '$scope',
            'authentication',
            'loginProvider',
            'ngToast',
            'eventbus',
            function ($scope, authentication, loginProvider, ngToast, eventbus) {
                var currentUser = authentication.getCurrentLoginUser();
                loginProvider.getProfileById(currentUser.id).then(function(profile){
                    $scope.currentProfile = profile;
                });

                $scope.cancelEdit = function(){
                    var currentUser = authentication.getCurrentLoginUser();
                    loginProvider.getProfileById(currentUser.id).then(function(profile){
                        $scope.currentProfile = profile;
                    });
                };

                $scope.hasCarChanged = function(value){
                    console.log("Changed. Current value: %s", value);
                    if (value)
                    {
                        $scope.currentProfile.carName = "";
                    }
                }

                $scope.isBusy = false;
                $scope.updateProfile = function(){
                    $scope.isBusy = true;
                    loginProvider.updateProfile($scope.currentProfile).then(function(){
                        eventbus.broadcast(jcs.modules.pages.events.profileUpdated, $scope.currentProfile);
                    })['finally'](function () {
                        $scope.isBusy = false;
                    });

                    var tost = ngToast.create({
                        className: 'info',
                        content: 'Profile updated successfully',
                        dismissOnTimeout : true,
                        timeout : 4000,
                        dismissButton : true
                    });
                };
            }
        ]);
}(angular, jcs));
/**
 * Created by Valik on 6/29/15.
 */
(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.tripExpense, [
            '$scope',
            '$http',
            function ($scope, $http) {
                var name = "tripExpense";
                $scope.pageHeader = "Trip expenses";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                });

                $scope.years = [2010, 2011, 2012, 2013, 2014, 2015];
                $scope.selectedYear = $scope.years[0]; // 2010

                $http.get(jcs.modules.pages.models.trips).
                    success(function(data, status, headers, config) {
                        $scope.tableHeaders = data;
                    }).
                    error(function(data, status, headers, config) {
                        // log error
                        console.log("error retrieving trips data");
                    });

                $scope.selectedTrip = $scope.trips[0];
            }
        ]);
}(angular, jcs));