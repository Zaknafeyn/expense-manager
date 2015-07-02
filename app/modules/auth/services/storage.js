(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.auth.name).factory(jcs.modules.auth.services.storage, [
        '$sessionStorage',
        function ($sessionStorage) {
            var storeUser = function (user) {
                    $sessionStorage.user = user;
                    console.log("Value from local storage:" + $sessionStorage.user.name);

                    return user;
                },
                getCurrentUser = function(){
                    if ($sessionStorage == undefined)
                        return;

                    return $sessionStorage.user;
                },
                deleteUser = function () {
                    delete $sessionStorage.user;
                };

            return {
                storeUser: storeUser,
                getCurrentUser: getCurrentUser,
                deleteUser: deleteUser
            };
        }
    ]);
}(angular, jcs));