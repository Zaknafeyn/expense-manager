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
                getProfile = function(login, password) {
                    return loadData(login, password).then(function(profile){
                        return profile;
                    });
                };
            return {
                getProfile : getProfile
            }
        }])
}(angular, jcs));