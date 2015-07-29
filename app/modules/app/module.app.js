(function (angular, jcs) {
    'use strict';

    jcs.modules.app = {
        name: 'myApp',
        events: {
            userLoggedIn: 'auth:user:loggedIn',
            userLoggedOut: 'auth:user:loggedOut'
        },
        controllers: {
            login: 'loginCtrl'
        },
        services: {
            tournamentSelection: 'tournamentSelection'
        },
        routes: {
            login: '/login',
            notAuthorised: '/not-authorised'
        }
    };

    angular.module(jcs.modules.app.name, [
        'ngRoute'
    ]);


}(angular, jcs));