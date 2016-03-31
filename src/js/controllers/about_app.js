angular.module('fbApp')
    .controller('about_appCtrl',
    ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City ) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');



            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();

            $scope.About = db.getKey('about', 'info');


            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#about_app .title").height();
            };

            $scope.getImageHeight = function() {
                return screenHeight * 0.4;
            };

            $scope.windowWidth = window.innerWidth;



            $scope.goSocial = function($event, social) {
                if ($event.preventDefault) {
                    $event.preventDefault();
                }
                window.open($scope.About[social+'_url'], '_system', 'location=yes');
            };

            $scope.goToFed = function() {
                window.open('http://www.russiatourism.ru/', '_system');
            };

        }]);