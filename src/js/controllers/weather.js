angular.module('fbApp').controller('weatherCtrl',
    ['$scope', '$rootScope', 'langService', 'initView', "$timeout", '$state', 'db', 'City', 'Navigator', 'Weather', '$filter',
        function($scope, $rootScope, langService, initView, $timeout, $state, db, City, Navigator, Weather, $filter) {

            $scope.images = {
                1: "img/spb.jpg",
                2: "img/msc.jpg"
            };

            $scope.lang = langService.getLanguage();

            if (navigator.connection && navigator.connection.type == 'none') {
                alert({
                    ru:"Просмотр погоды недоступен в оффлайн-режиме. Установите подключени к сети интернет и повторите попытку",
                    en:"Weather forecast is unavailable in offline mode. Connect to the network and try again"
                }[$scope.lang]);
                backBtnPressed();
                return;
            }

            $timeout(initView.render);

            var listen = false;
            $timeout(function() {
                listen = true;
            }, 100);

            var date = new Date();
            $scope.dateStr = {
                day: $filter('weekDay')(date.getDay(), $scope.lang),
                date: date.getDate(),
                month: $filter('monthString')(date.getMonth(), true, $scope.lang)
            };

            $scope.weatherIcon = Weather.weatherIcon;
            $scope.windDir = Weather.windDir;

            $scope.currentCity = City.getCurrent();
            $scope.cities = [];
            $scope.loaded  = false;
            City.list().then(function(data) {
                var data = data.data.data;
                $scope.cities = data.cities;
                $scope.cities.forEach(function(city) {
                    city.loaded = true;
                });
                Weather.assignList($scope.cities);
            });



            $scope.$on('weatherAssigned', function() {
                Log('weatherAssigned', $scope.cities);
            });




            var screenHeight = $(window).height();
            $scope.getTitleHeight = function() {
                return screenHeight * 0.1;
            };

            $scope.getCarouselHeight = function() {
                return screenHeight * 0.9;
            };


            $scope.getDayName = function(date) {
                date = new Date(date);
                var translate = [
                    {
                        en: "sn",
                        ru: "вс"
                    },
                    {
                        en: "mn",
                        ru: "пн"
                    },
                    {
                        en: "tu",
                        ru: "вт"
                    },
                    {
                        en: "wd",
                        ru: "ср"
                    },
                    {
                        en: "th",
                        ru: "чт"
                    },
                    {
                        en: "fr",
                        ru: "пт"
                    },
                    {
                        en: "sn",
                        ru: "сб"
                    }
                ];
                var day = date.getDay();

                return translate[day]? translate[day][$scope.lang] : undefined;
            };



            $scope.$on('cityRenderFinished', function() {
                var index = 0;
                for (var i = 0; i < $scope.cities.length; i++) {
                    if ($scope.cities[i].id == $scope.currentCity.id) {
                        index = i;
                    }
                }

                if ($scope.cities.length > 0) {
                    var owl = $(".owl-carousel").owlCarousel({
                        items: 1,
                        loop: false,

                        dots: true,
                        startPosition: index
                    });

                    owl.on('changed.owl.carousel', function (event) {
                        $timeout(function () {
                            var $div = $(".owl-item.active");

                        }, 500);
                    });

                    $timeout(function() {
                        $scope.loaded = true;
                    });
                }
            });


        }]);