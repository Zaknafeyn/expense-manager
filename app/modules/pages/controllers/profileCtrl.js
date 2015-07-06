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
                console.log("Current user id %s", currentUser);
                loginProvider.getProfileById(currentUser.id).then(function(profile){
                    console.log("Current user profile %O", profile);
                    $scope.currentProfile = profile;
                });

                $scope.updateProfile = function(){
                    loginProvider.updateProfile($scope.currentProfile).then(function(){
                        eventbus.broadcast(jcs.modules.pages.events.profileUpdated, $scope.currentProfile);
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