/**
 * Created by Valik on 6/28/15.
 */
(function (angular, jcs) {
    'use strict';

    jcs.modules.core = {
        name: 'jcs-core',
        services: {
            eventbus: 'eventbus'
        }
    };

    angular.module(jcs.modules.core.name, []);
}(angular, jcs));