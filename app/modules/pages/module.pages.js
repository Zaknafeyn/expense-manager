(function (angular, jcs) {
    'use strict';

    var apiServer = "http://expense-manager-backend.azurewebsites.net";
    // var apiServer = "http://localhost:59184";
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