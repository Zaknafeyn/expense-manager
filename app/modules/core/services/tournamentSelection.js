(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.core.name).factory(jcs.modules.core.services.tournamentSelection, [
        '$http',
        '$q',
        function ($http, $q) {
            var tournamentId,
            getExpenses = function(crewId) {

                var defer = $q.defer();
                var expensesData = undefined;

                $http.get(jcs.modules.app.api.expenses + crewId).
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
            updateCurrentTournamentId = function(tourId) {
                tournamentId = tournId;
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