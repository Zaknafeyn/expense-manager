(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.core.name).factory(jcs.modules.core.services.tournamentSelection, [
        '$http',
        '$q',
        jcs.modules.core.services.eventbus,
        function ($http, $q, eventbus) {
            var tournamentId,
            getExpenses = function(crewId) {

                var defer = $q.defer();
                var expensesData = undefined;

                //console.log("Getting expenses from url: %s", jcs.modules.core.api.expenses + crewId );
                $http.get(jcs.modules.core.api.expenses + crewId).
                    success(function(data, status, headers, config) {
                        console.log("%O", data);
                        expensesData = data;
                        defer.resolve(expensesData);
                    }).
                    error(function(data, status, headers, config) {
                        // Log error
                        console.log("Error retrieving expenses data");
                        defer.reject('Cannot retrieve data from service');
                    });

                return defer.promise;
            },
            updateCurrentTournamentId = function(tournmtId) {
                tournamentId = tournmtId;
            },
            getCurrentTournamentId = function(){
                return tournamentId;
            };

            return {
                getExpenses : getExpenses,
                updateCurrentTournamentId : updateCurrentTournamentId,
                getCurrentTournamentId : getCurrentTournamentId
            };
        }
    ]);
}(angular, jcs));