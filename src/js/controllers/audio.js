angular.module('fbApp')
    .controller('audioCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'Audio',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, Audio) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');

            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();

            $scope.Audio = Audio.get();
            $scope.Audio.loaded = true;
            console.log($scope.Audio);

            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#audio .title").height();
            };

            $scope.getImageHeight = function() {
                return screenHeight * 0.4;
            };

            // TODO: ng-repeat to carousel, when api will be ready
          //  $scope.$on('AudioRenderFinished', function() {
            $timeout(function(){
                $(".owl-carousel").owlCarousel({
                    items: 1,
                    loop: true,
                    dots: true
                });
            });
           // });

        }]);