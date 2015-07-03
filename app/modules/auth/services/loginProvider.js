(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).factory("loginProvider", [
        '$q',
        '$http',
        function ($q, $http) {
            var loadData = function(){
                    var defer = $q.defer(),
                        loginData = undefined;


                    $http.get("http://expense-manager-backend.azurewebsites.net/api/profiles").
                    // $http.get("http://localhost:59184/api/Profiles").
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
                    // $http.get(jcs.modules.pages.models.tempProfiles).
                    //     success(function(data, status, headers, config) {
                    //         console.log("%O", data);
                    //         loginData = data;

                    //         defer.resolve(loginData);
                    //     }).
                    //     error(function(data, status, headers, config) {
                    //         // log error
                    //         console.log("error retrieving trips data");
                    //         defer.reject('Cannot retrieve data from service');
                    //     });

                    return defer.promise;
                },
                getProfile = function(login, password){
                    return loadData().then(function(loginCollection){
                        console.log("retrieved array: %O", loginCollection);
                        // var result = $.grep(loginCollection, function(e){ return e.login == login && e.password == password; });
                        var result = $.grep(loginCollection, function(e){ return e.login == login });

                        console.log("result = %O", result);
                        if (result.length == 0)
                            return undefined;
                        else
                            return result[0];

                    });
                };

            return {
                getProfile : getProfile
            }
        }])
}(angular, jcs));