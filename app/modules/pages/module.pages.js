(function (angular, jcs) {
    'use strict';

    jcs.modules.pages = {
        name: 'pages',
        controllers: {
            default: 'defaultCtrl',
            tripExpense: 'tripExpenseCtrl',
            calculations: 'calculationsCtrl',
            profile: 'profileCtrl'
        },
        routes: {
            home: '/home',
            tripExpense: '/tripExpense',
            calculations: '/calculations',
            profile: '/profile'
        },
        templates: {
            home: 'modules/pages/html/home.tmpl.html',
            tripExpense: 'modules/pages/html/tripExpense.tmpl.html',
            calculations: 'modules/pages/html/calculations.tmpl.html',
            profile: 'modules/pages/html/profile.tmpl.html'
        },
        models :{
            trips : 'modules/pages/models/trips.json',
            menu : 'modules/pages/models/menu.json',
            tempProfiles: 'modules/pages/models/temp.profiles.json'
        },
        api: {
            profiles: 'http://expense-manager-backend.azurewebsites.net/api/profiles'
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