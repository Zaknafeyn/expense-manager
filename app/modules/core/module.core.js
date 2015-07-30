(function (angular, jcs) {
    'use strict';

    var apiServer = "http://expense-manager-backend.azurewebsites.net";
    // var apiServer = "http://localhost:59184";

    jcs.modules.core = {
        name: "jcs-core",
        apiServer : apiServer,
        services: {
            eventbus: "eventbus",
            tournamentSelection : "tournamentSelection"
        },
        events : {
            tournamentChanged : "tournamentChanged"
        },
        api: {
            expenses: apiServer + "/api/crewexpenses/"
        }
    };

    angular.module(jcs.modules.core.name, []);
}(angular, jcs));