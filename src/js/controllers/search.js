angular.module('fbApp')
    .controller('searchCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'Route', 'Navigator', '$stateParams', 'Search', 'Favorites',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, Route, Navigator, $stateParams, Search, Favorites) {
            $timeout(initView.render);
            $(".burger-menu").removeClass('active');

            setTimeout(function() {
               //$("#search .top-menu > .title input").focus();
            }, 100);

            $scope.city = City.getCurrent();
            if (!$scope.city || $scope.city == null) {
                $state.go('city_select');
            }

            $scope.lang = langService.getLanguage();

            $scope.showStartMessage = true;


            $scope.activeFilter = 'objects';


            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - ($("#search .title").height() + $("#search .filters").height() + 30);
            };

            $scope.getImageHeight = function() {
                return screenHeight * 0.4;
            };

            $scope.windowWidth = window.innerWidth;


            $scope.checkFavorite = function(item) {
                return Favorites.check(item, item.type);
            };



            $scope.setActive = function(item) {
                $state.go(item.type, {object: item});
            };

            $scope.selection = {
                objects:[],
                events: [],
                routes: []
            };

            $scope.newSearch = function(query) {
                $scope.showStartMessage = false;
                $scope.selection = Search.processQuery(query);
            }

        }]);