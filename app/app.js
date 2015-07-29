(function(angular, jcs){
'use strict';

  jQuery.support.cors = true;

    // Declare app level module which depends on views, and components
    var myApp = angular.module(jcs.modules.app.name, [
        "ngStorage",
        jcs.modules.app.router,
        'myApp.view1',
        'myApp.addEntryView',
//        'myApp.version',
        jcs.modules.auth.name,
        jcs.modules.core.name,
        jcs.modules.pages.name,
        'angular-md5',
        'ngToast'
    ]);


    myApp.controller('mainCtrl', function($scope, $http, authentication, storage, eventbus){


        $http.get(jcs.modules.pages.api.tournaments).
            success(function(data) {
                $scope.trips = data;
                $scope.selectedTrip = $scope.trips[0];
                console.log("Retrieved trips: %O", data);
            }).
            error(function(data, status, headers, config) {
                // log error
                console.log("error retrieving trips data");
            });

        $http.get(jcs.modules.pages.api.years).
            success(function(data) {
                $scope.years = data;
                $scope.selectedYear = $scope.years[0];
            }).
            error(function(data, status, headers, config) {
                // log error
                console.log("error retrieving years data");
            });



        $scope.tripSelected = function(trip){
            console.log("Selected trip: %O", trip);
        }

        // initial state
        $scope.loggedIn = authentication.isLoggedInUser();
        if ($scope.loggedIn)
            $scope.currentUser = storage.getCurrentUser().name;

        $scope.logout = function() {
            console.log("Logging out");
            authentication.logout();
        };

        //start events subscription section
        eventbus.subscribe(jcs.modules.auth.events.userLoggedIn, function(e, user){
            console.log("Login Event caught")
            $scope.loggedIn = authentication.isLoggedInUser();
            $scope.currentUser = user.name;
        });

        eventbus.subscribe(jcs.modules.auth.events.userLoggedOut, function(){
            console.log("Logout Event caught");
            $scope.loggedIn = authentication.isLoggedInUser();
            $scope.currentUser = "";
        });

        eventbus.subscribe(jcs.modules.pages.events.profileUpdated, function(e, updatedProfile){
            $scope.currentUser = updatedProfile.name;
        });

        //end events subscription section

        $scope.testName = "Test name";

        $scope.years = [2010, 2011, 2012, 2013, 2014, 2015];
        $scope.selectedYear = $scope.years[0]; // 2010

        $scope.trips = [
            {
                'year' : 2010,
                'name' : "Winter Brest 2010"
            },
            {
                'year' : 2010,
                'name' : "PChU - 2010"
            },
            {
                'year' : 2010,
                'name' : "OChU - 2010"
            },
            {
                'year' : 2011,
                'name' : "Winter Brest 2011"
            },
            {
                'year' : 2011,
                'name' : "Windmill - 2011"
            },
            {
                'year' : 2011,
                'name' : "PChU - 2011"
            },
            {
                'year' : 2011,
                'name' : "OChU - 2011"
            }
        ];

        $scope.selectedTrip = $scope.trips[0];

        $scope.players = [
            {
                "name" : "Player1",
                "isDriver" : "false"
            },
            {
                "name" : "Player2",
                "isDriver" : "false"
            },
            {
                "name" : "Player3",
                "isDriver" : "false"
            },
            {
                "name" : "Player4",
                "isDriver" : "false"
            },
            {
                "name" : "Player5",
                "isDriver" : "false"
            },
            {
                "name" : "Player6",
                "isDriver" : "false"
            },
            {
                "name" : "Player6",
                "isDriver" : "false"
            },
            {
                "name" : "Player8",
                "isDriver" : "true",
                "carName" : "Yoslik"
            },
            {
                "name" : "Player9",
                "isDriver" : "true",
                "carName" : "Drakosha"
            }
        ];

        $scope.selectedPlayer = $scope.players[0];
        $scope.selectedDriver = null;

        $http.get('models/headers.json').
        success(function(data, status, headers, config) {
            $scope.tableHeaders = [];
            var counter = 0;
            for(var item in data)
            {
                counter++;
                if (counter != 1 && counter != 2 && counter != 11)
                    continue;

                $scope.tableHeaders.push(data[item]);
            }
        }).
        error(function(data, status, headers, config) {
            // log error
            console.log("error retrieving headers data");
        });

        $http.get('https://spreadsheets.google.com/feeds/list/1vRhgI-NUXKJtcc9E98zPhb4Pd1FFWQdV7wPQ-SPXTTo/od6/public/values?alt=json').
        success(function(data, status, headers, config) {
//            console.log(data);
            $scope.novaPlayers = data;

            // process data
            var entries = data.feed.entry;
            $scope.novaPlayers = entries;
//            console.log("Entries :" + entries.length);
//            console.log(entries);
            var counter = 0;
            var result = [];
            for(var entryCounter in entries)
            {
                var entry = entries[entryCounter];
//                console.log(entry);
                counter ++;
                if (counter < 2)
                    continue;

                var row = [];

                var itemCounter = 0;
//                console.log(entry["gsx$авто"]);
                if (entry["gsx$авто"].$t == 'нет')
                    continue;

                for(var entryItemCounter in entry)
                {
                    itemCounter++;
                    if (itemCounter <= 7 || (itemCounter != 8 && itemCounter != 9 && itemCounter != 18))
                        continue;

                    var entryItem = entry[entryItemCounter];
//                    console.log(entryItem);
                    row.push(entryItem);
                }

                result.push(row);
            }

            $scope.novaPlayers = result;
        }).
        error(function(data, status, headers, config) {
            // log error
            console.log("error");
        });

        $scope.selectedDriver1 = "";
    });
}(angular, jcs));