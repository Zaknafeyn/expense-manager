(function (angular, jcs) {
    'use strict';


    angular.module(jcs.modules.app.name).run([
        '$rootScope',
        function ($rootScope) {
            console.log("app.run");
        }]);

}(angular, jcs));