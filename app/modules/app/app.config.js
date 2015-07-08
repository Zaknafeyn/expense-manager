(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.app.name)
    .config(['$httpProvider', 'ngToastProvider', function($httpProvider, ngToast) {
        ngToast.configure({
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            maxNumber: 3,
            animation : 'slide'
        });


        $httpProvider.defaults.useXDomain = true;
        //$httpProvider.defaults.headers.common = {};

        console.log('logging out headers');
        console.log($httpProvider.defaults);
        console.log($httpProvider.defaults.headers.common);
        console.log($httpProvider.defaults.headers.post);
        console.log($httpProvider.defaults.headers.put);
        console.log($httpProvider.defaults.headers.patch);
        console.log('end logging out headers');

        $httpProvider.defaults.headers.common = {Accept: "application/json, text/plain, */*"};
        $httpProvider.defaults.headers.post = {"Content-Type": "application/json;charset=utf-8"};

        console.log('after: logging out headers');
        console.log($httpProvider.defaults.headers.common);
        console.log($httpProvider.defaults.headers.post);
        console.log($httpProvider.defaults.headers.put);
        console.log($httpProvider.defaults.headers.patch);
        console.log('after: end logging out headers');


        // http://better-inter.net/enabling-cors-in-angular-js/
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];

        //// recommendation from this thread:
        //// http://stackoverflow.com/questions/12111936/angularjs-performs-an-options-http-request-for-a-cross-origin-resource
        //
        ////Reset headers to avoid OPTIONS request (aka preflight)
        //$httpProvider.defaults.headers.common = {};
        //$httpProvider.defaults.headers.post = {};
        //$httpProvider.defaults.headers.put = {};
        //$httpProvider.defaults.headers.patch = {};
    }]);
    //.config(['$httpProvider', function($httpProvider){
    //        // recommendation from this thread:
    //        // http://stackoverflow.com/questions/12111936/angularjs-performs-an-options-http-request-for-a-cross-origin-resource
    //
    //        //Reset headers to avoid OPTIONS request (aka preflight)
    //        $httpProvider.defaults.headers.common = {};
    //        $httpProvider.defaults.headers.post = {};
    //        $httpProvider.defaults.headers.put = {};
    //        $httpProvider.defaults.headers.patch = {};
    //    }])

}(angular, jcs));