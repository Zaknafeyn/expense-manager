(function (angular, jcs) {
    'use strict';
    
    angular.module(jcs.modules.app.name).run([
        '$rootScope',
        '$log',
        function ($rootScope, $log) {
            $log.debug("app.run");
        }]);

}(angular, jcs));