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