angular.module('fbApp')
    .controller('offline_pagesCtrl',
    ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'LocalResolver',
        function($scope,   initView,   $timeout,   db,   $state,   langService,   $rootScope, LocalResolver) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');

            $scope.lang = langService.getLanguage();
            $scope.selected = null;

            $scope.selection = Object.keys(LocalResolver.ScreenshotsCache).map(function(key) {
                return {
                    title: key,
                    url: LocalResolver.ScreenshotsCache[key]
                }
            });

            //$scope.selection = [
            //    {
            //        title: 'Замечательная задница',
            //        url: 'http://www.planwallpaper.com/static/images/cool-hd-wallpapers-for-iphone-4-51.jpg'
            //    },
            //    {
            //        title: 'Замечательная задница',
            //        url: 'http://www.wallpapereast.com/static/images/Snow-flying-iphone-5s-wallpaper-ilikewallpaper_com.jpg'
            //    },
            //    {
            //        title: 'Замечательная задница',
            //        url: 'http://www.sadsnow.com/wp-content/uploads/2012/09/21.jpg'
            //    }
            //];

            $scope.filtered = $scope.selection;

            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#offline_pages .title").height();
            };

            $scope.getTitleHeight = function() {
                return $("#offline_pages .title").height() + 98;
            };

            $scope.windowWidth = window.innerWidth;



            $scope.removeItem = function (item) {
                var index = $scope.selection.indexOf(item);
                if (index != -1) {
                    item.removed = true;
                    $timeout(function() {
                        delete LocalResolver.ScreenshotsCache[item.title];
                        $scope.selection.splice(index, 1);
                        LocalResolver.saveCache();
                    }, 300);
                }
            };

            $scope.newSearch = function (query) {
                $scope.filtered = [];
                for (var i = 0; i < $scope.selection.length; i++) {
                    if ($scope.selection[i].name[$scope.lang].toUpperCase().indexOf(query.toString().toUpperCase()) != -1) {
                        $scope.filtered.push($scope.selection[i]);
                    }
                }
                if ($scope.filtered.length == 0) {
                    $scope.filtered = $scope.selection;
                }
            };

            $scope.fullScreenImage = $scope.selection[0];
            $timeout(function() {
                $(".fullScreenImage img").panzoom({
                    minScale: 1
                });
            });

            $scope.showFullScreen = function(item) {
                $scope.fullScreenImage = item;
                $timeout(function() {
                    $(".fullScreenImage").fadeIn(300);
                });
            };

            $scope.closeFullScreen = function(){
                $(".fullScreenImage").fadeOut(300);
            };

        }]);