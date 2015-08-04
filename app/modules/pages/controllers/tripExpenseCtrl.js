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

                reloadExpenses(1);

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
                        $scope.categories = data[0];
                        $log.debug("Categories : %O", data);
                    }).
                    error(function(data, status, headers, config) {
                        // log error
                        $log.error("Error retrieving categories data");
                    });

                $http.get(jcs.modules.pages.api.dictionaries.currencies).
                    success(function(data, status, headers, config) {
                        $scope.currencies = data[0];
                        $log.debug("Currencies : %O", data);
                    }).
                    error(function(data, status, headers, config) {
                        // log error
                        $log.error("Error retrieving currencies data");
                    });

                function reloadExpenses(crewId){
                    $log.info("Reloading expenses ...");
                    tournamentSelection.getExpenses(crewId)
                        .then(function(expenses) {
                            $scope.expenses = {
                                crewId : crewId,
                                expensesArray : expenses
                            };
                            $log.debug("Expenses %O", expenses);
                        });
                };

                function canReloadExpenses(){
                    // validate expenses
                    return true;
                };

                $scope.removeItem = function(expenseItem) {
                    tournamentSelection.removeItem(expenseItem);
                };

                $scope.addNewItem = function(){
                    $log.debug("add new item");
                    $scope.expenses.expensesArray.push({
                        expense : 0,
                        description : "",
                        currency : 0,
                        category : 0,
                        carCrewRefId : 1
                    });
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
                    reloadExpenses(1);
                });
            }
        ]);
}(angular, jcs));