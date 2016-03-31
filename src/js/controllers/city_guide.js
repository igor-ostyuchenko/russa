angular.module('fbApp').controller('cityGuideCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', 'City', '$rootScope',
    function($scope, initView, $timeout, db, $state, langService, City, $rootScope) {
        $timeout( initView.render);
        $scope.$on('backbutton-pressed', function(event, data) {
            data.callback();
        });

        $scope.city = City.getCurrent();
        $scope.lang = langService.getLanguage();
        $scope.langTitle = {'ru':'Русский', 'en': 'English'}[$scope.lang];

        console.log($scope.city, $scope.lang);

        $scope.eraseAll = function() {
            console.info("Erasing...");
            localStorage.clear();
            $rootScope.currentCity = undefined;
            $rootScope.currentLanguage = undefined;
            navigator.app.exitApp();
        }

    }]);