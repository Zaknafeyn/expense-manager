(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.core.name).factory(jcs.modules.core.services.tournamentSelection, [
        '$http',
        '$q',
        '$log',
        jcs.modules.core.services.eventbus,
        function ($http, $q,$log, eventbus) {
            var tournamentId,
                currentExpenseData,
            getExpenses = function(crewId) {

                var defer = $q.defer();
                var expensesData = undefined;

                //console.log("Getting expenses from url: %s", jcs.modules.core.api.expenses + crewId );
                $http.get(jcs.modules.core.api.expenses + crewId).
                    success(function(data, status, headers, config) {
                        $log.debug("%O", data);
                        expensesData = data;
                        currentExpenseData = expensesData;
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
            },
            commitChanges = function(crewId){

                $http.post(jcs.modules.core.api.expenses + crewId, JSON.stringify(currentExpenseData)).
                    success(function(data, status, headers, config) {
                        console.log("%O", data);
                    }).
                    error(function(data, status, headers, config) {
                        // Log error
                        console.log("Error sending expenses data");
                    });
            },

            removeItem = function(item){
                var index = currentExpenseData.indexOf(item);
                if (index > -1) {
                    currentExpenseData.splice(index, 1);
                };

                if (item.id == undefined)
                    return;

                $http.delete(jcs.modules.core.api.expenses + item.id)
                    .error(function(data){
                        $log.error("Cannot delete item with id: %s", item.id);
                    });
            };

            return {
                getExpenses : getExpenses,
                updateCurrentTournamentId : updateCurrentTournamentId,
                getCurrentTournamentId : getCurrentTournamentId,
                commitChanges : commitChanges,
                removeItem : removeItem
            };
        }
    ]);
}(angular, jcs));