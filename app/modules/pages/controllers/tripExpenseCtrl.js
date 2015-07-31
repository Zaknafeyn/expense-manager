(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.tripExpense, [
            '$scope',
            '$http',
            '$log',
            jcs.modules.core.services.eventbus,
            jcs.modules.core.services.tournamentSelection,
            function ($scope, $http, $log, eventbus, tournamentSelection) {
                var name = "tripExpense";
                $scope.pageHeader = "Trip expenses";

                jcs.modules.pages.common.getMenu(name, $http, function(list){
                    $scope.menuItems = list;
                });

                reloadExpenses();

                ////$log.debug("URL years:" + jcs.modules.pages.api.years);
                //$http.get(jcs.modules.pages.api.years).
                //    success(function(data, status, headers, config) {
                //        $scope.years = data;
                //        $scope.selectedYear = $scope.years[0]; // 2010
                //    }).
                //    error(function(data, status, headers, config) {
                //        // log error
                //        $log.error("Error retrieving years data. Data - %O, status - %O, headers - %O, config - %O", data, status, headers, config);
                //    });

                $http.get(jcs.modules.pages.api.dictionaries.categories).
                    success(function(data, status, headers, config) {
                        $scope.categories = data;
                        $log.debug("Categories : %O", data);
                    }).
                    error(function(data, status, headers, config) {
                        // log error
                        $log.error("Error retrieving categories data");
                    });


                function reloadExpenses(){
                    $log.info("Reloading expenses ...");
                    tournamentSelection.getExpenses(1)
                        .then(function(expenses) {
                            $scope.expenses = {
                                crewId : 1,
                                expensesArray : expenses
                            };
                            $log.debug("Expenses %O", expenses);
                        });
                };

                $scope.removeItem = function(expenseItem) {
                    tournamentSelection.removeItem(expenseItem);
                };
                ////$log.debug("URL tournaments:" + jcs.modules.pages.api.tournaments);
                //$http.get(jcs.modules.pages.api.tournaments).
                //    success(function(data, status, headers, config) {
                //        $scope.tournaments = data;
                //        $scope.selectedTrip = $scope.tournaments[0];
                //    }).
                //    error(function(data, status, headers, config) {
                //        // log error
                //        $log.error("Error retrieving tournaments data");
                //    });

                /* event handlers
                * ---------------
                */
                eventbus.subscribe(jcs.modules.core.events.tournamentChanged, function(oldTournamentId, newTournamentId){
                    //tournamentSelection.getExpenses(1)
                    //    .then(function(expenses) {
                    //        $scope.expenses = {
                    //            crewId : 1,
                    //            expensesArray : expenses
                    //        };
                    //        $log.debug("Expenses %O", expenses);
                    //    });
                    $log.debug("Tournament changed. Old tounament id: %s, new tournamentId: %s", oldTournamentId, newTournamentId);
                    reloadExpenses();
                });
            }
        ]);
}(angular, jcs));