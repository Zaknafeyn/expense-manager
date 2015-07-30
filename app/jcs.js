(function (window) {
    'use strict';

    var jcs = window.jcs = window.jcs || {};

    jcs.modules = {
        app: {
            name: 'myApp',
            router: 'ngRoute',
            controllers: {
                mainCtrl: 'mainCtrl'
            },
            events: {
            }
        }
    };
}(window));