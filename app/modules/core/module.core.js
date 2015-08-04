(function (angular, jcs) {
    'use strict';

    //var apiServer = "http://expense-manager-backend.azurewebsites.net";
    var apiServer = "http://localhost:59184";

    var baseApiPath = "/api/v1";
    var apiPath = apiServer + baseApiPath;

    jcs.modules.core = {
        name: "jcs-core",
        apiServer : apiServer,
        apiPath : apiPath,
        baseApiPath : baseApiPath,
        services: {
            eventbus: "eventbus",
            tournamentSelection : "tournamentSelection"
        },
        events : {
            tournamentChanged : "tournamentChanged"
        },
        api: {
            expenses: apiPath + "/crewexpenses/"
        }
    };

    angular.module(jcs.modules.core.name, []);
}(angular, jcs));