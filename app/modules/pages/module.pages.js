(function (angular, jcs) {
    'use strict';

    var apiServer = jcs.modules.core.apiServer;
    var apiPath = jcs.modules.core.apiPath;
    var categoryUrl = apiPath + "/dictionaries/category/";

    jcs.modules.pages = {
        apiServer : apiServer,
        name: 'pages',
        controllers: {
            default: 'defaultCtrl',
            tripExpense: 'tripExpenseCtrl',
            calculations: 'calculationsCtrl',
            profile: 'profileCtrl',
            crew: 'crewCtrl',
            currencies : 'currencies'
        },
        routes: {
            home: '/home',
            tripExpense: '/tripExpense',
            calculations: '/calculations',
            profile: '/profile',
            crew: '/crew',
            currencies: '/currencies'
        },
        templates: {
            home: 'modules/pages/html/home.tmpl.html',
            tripExpense: 'modules/pages/html/tripExpense.tmpl.html',
            calculations: 'modules/pages/html/calculations.tmpl.html',
            profile: 'modules/pages/html/profile.tmpl.html',
            crew: 'modules/pages/html/crew.tmpl.html',
            currencies: 'modules/pages/html/currencies.tmpl.html'
        },
        models :{
            trips : 'modules/pages/models/trips.json',
            menu : 'modules/pages/models/menu.json'
        },
        api: {
            profiles: apiPath + '/profiles',
            login: apiPath + '/login',
            tournaments: apiPath + '/Tournaments',
            years: apiPath + '/Years',
            tournamentsPerYear: apiPath + '/Tournaments/filter/year/',
            dictionaries: {
                categories : categoryUrl + 'categories',
                currencies : categoryUrl + 'currencies'
            }
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
                            //console.log(btnClass);
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