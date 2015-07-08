(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.app.name)
    .config(['ngToastProvider', function(ngToast) {
        ngToast.configure({
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            maxNumber: 3,
            animation : 'slide'
        });
    }]);

}(angular, jcs));