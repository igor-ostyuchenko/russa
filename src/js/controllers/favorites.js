angular.module('fbApp')
    .controller('favoritesCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'Route', 'Navigator', '$stateParams', 'Favorites',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, Route, Navigator, $stateParams, Favorites) {
            $timeout(initView.render);
            $(".burger-menu").removeClass('active');


            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();

            $scope.Favorites =  Favorites.get();

            $scope.activeFilter = 'objects';


            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - ($("#favorites .title").height() + $("#favorites .filters").height() + 15);
            };

            $scope.getImageHeight = function() {
                return screenHeight * 0.4;
            };

            $scope.windowWidth = window.innerWidth;


            $scope.checkFavorite = function(item) {
                return Favorites.check(item, item.type);
            };

            var swiping = false;
            $scope.touchEvent = function(item, event) {
                item.out = true;
                $timeout(function() {
                    Favorites.set(item, item.type, true);
                    //var index = $scope.Favorites[item.type + 's'].indexOf(item);
                    //$scope.Favorites[item.type + 's'].splice(index, 1);
                }, 600);
            };

            $scope.setActive = function(item) {
                $state.go(item.type, {object: item});
            };

        }]);