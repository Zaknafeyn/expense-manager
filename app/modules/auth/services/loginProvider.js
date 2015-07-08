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
                    $http.post(jcs.modules.pages.api.login, JSON.stringify(postData)).
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
                    return jcs.modules.pages.api.profiles + "/" + id;
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

                    $http.post(jcs.modules.pages.api.profiles, JSON.stringify(profile)).
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