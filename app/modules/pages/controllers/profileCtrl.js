(function (angular, jcs) {
    'use strict';

    angular.module(jcs.modules.pages.name)
        .controller(jcs.modules.pages.controllers.profile, [
            '$scope',
            'authentication',
            'loginProvider',
            'ngToast',
            'eventbus',
            function ($scope, authentication, loginProvider, ngToast, eventbus) {
                var currentUser = authentication.getCurrentLoginUser();
                loginProvider.getProfileById(currentUser.id).then(function(profile){
                    $scope.currentProfile = profile;
                });

                $scope.cancelEdit = function(){
                    var currentUser = authentication.getCurrentLoginUser();
                    loginProvider.getProfileById(currentUser.id).then(function(profile){
                        $scope.currentProfile = profile;
                    });
                };

                $scope.hasCarChanged = function(value){
                    console.log("Changed. Current value: %s", value);
                    if (value)
                    {
                        $scope.currentProfile.carName = "";
                    }
                }

                $scope.isBusy = false;
                $scope.updateProfile = function(){
                    $scope.isBusy = true;
                    loginProvider.updateProfile($scope.currentProfile).then(function(){
                        eventbus.broadcast(jcs.modules.pages.events.profileUpdated, $scope.currentProfile);
                    })['finally'](function () {
                        $scope.isBusy = false;
                    });

                    var tost = ngToast.create({
                        className: 'info',
                        content: 'Profile updated successfully',
                        dismissOnTimeout : true,
                        timeout : 4000,
                        dismissButton : true
                    });
                };
            }
        ]);
}(angular, jcs));