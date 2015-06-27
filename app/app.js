'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.addEntryView',
  'myApp.version'
]);

myApp.config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]);

myApp.controller('mainCtrl', function($scope, $http){
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

    $scope.selectedPlayer =$scope.players[0];
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
        console.log(data);
        $scope.novaPlayers = data;

        // process data
        var entries = data.feed.entry;
        //$scope.novaPlayers = entries;

        console.log("Entries :" + entries.length);
        console.log(entries);
        var counter = 0;
        var result = [];
        for(var entryCounter in entries)
        {
            var entry = entries[entryCounter];
            console.log(entry);
            counter ++;
            if (counter < 2)
                continue;

            var row = [];

            var itemCounter = 0;
            console.log(entry["gsx$авто"]);
            if (entry["gsx$авто"].$t == 'нет')
                continue;

            for(var entryItemCounter in entry)
            {
                itemCounter++;
                if (itemCounter <= 7 || (itemCounter != 8 && itemCounter != 9 && itemCounter != 18))
                    continue;

                var entryItem = entry[entryItemCounter];
                console.log(entryItem);
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
});