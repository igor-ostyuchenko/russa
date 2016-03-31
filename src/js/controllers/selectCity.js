angular.module('fbApp').controller('selectCityCtrl',
    ['$scope', '$rootScope', 'langService', 'initView', "$timeout", '$state', 'db', 'City', 'Navigator', '$stateParams',
        function($scope, $rootScope, langService, initView, $timeout, $state, db, City, Navigator, $stateParams) {

            if ($stateParams.checkState && db.getKey('city', 'currentCity') != null) {
                $state.go('editors_choice');
            }


            $scope.noData = false;


            $timeout(initView.render);

            var listen = false;
            $timeout(function () {
                listen = true;
            }, 100);


            $scope.cities = [];
            $scope.loaded = false;
            $scope.$on('appIsOnline', function() {
                Log('catched onLine event');
                if ($scope.noData) {
                    City.reload(getList);
                }
            });

            function getList() {
                City.list().then(function (data) {
                    var data = data.data.data;
                    Log('Data received:', data);
                    $scope.cities = data.cities;
                    if ($scope.cities.length == 0) {
                        Log('No data returned');
                        $scope.noData = true;
                        setTimeout($scope.$digest, 1);
                    } else {
                        $scope.noData = false;
                    }
                    $scope.cities.forEach(function (city) {
                        city.loaded = true;
                    });
                    $scope.selectedCity = $scope.cities[0];
                });
            }

            //getList();
            City.reload(getList);

            $scope.selectedCity = $scope.cities[0];

            $scope.lang = langService.getLanguage();


            $scope.windowWidth = window.innerWidth;

            var screenHeight = $(window).height();
            $scope.getImageHeight = function() {
                return screenHeight * 0.3;
            };

            $scope.getMatchesHeight = function() {
                return screenHeight * 0.3;
            };

            $scope.getTitleHeight = function() {
                return screenHeight * 0.1;
            };



            $scope.currentTranslate = 0;
            $scope.step = 0;

            $(".city-carousel").off();


            $scope.citySelect = function() {
                // Если нет сети и нет данных по этому городу - не пускаем дальше
                if (navigator.connection && navigator.connection.type == 'none') {
                    if (db.getKey('cityData', $scope.selectedCity.id) == null) {
                        alert({
                            ru:"Данные по этому городу отсутствуют. Установите подключение к сети интернет и повторите попытку",
                            en:"There was no data downloaded for this city. Connect to the network and try again"
                        }[$scope.lang]);
                        return;
                    }
                }
                $timeout(function() {
                    City.setCurrent($scope.selectedCity, function() {
                        Log('In the callback');
                        $state.go('editors_choice');
                    });
                });
            };


            $scope.$on('cityRenderFinished', function() {
                if ($scope.cities.length > 0) {
                    $(".city-wrapper").removeClass('hidden');
                    var owl = $(".owl-carousel").owlCarousel({
                        items: 1,
                        loop: false,
                        stagePadding: Math.ceil($(window).width() / 10),
                        margin: 10,
                        dots: true
                    });

                    owl.on('changed.owl.carousel', function (event) {
                        $timeout(function () {
                            var id = $(".owl-item.active>div").data('city');
                            $scope.selectedCity = $scope.cities.filter(function (item) {
                                return item.id == id
                            })[0];
                        }, 500);
                    });

                    $timeout(function() {
                        $scope.loaded = true;
                    });
                }
            });


        }])
    .directive('renderMessage', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.renderMessage);
                    });
                }
            }
        }
    })
    .filter('showDate', ['$filter', 'langService', function($filter, langService) { // Gets String, Number or Date as input, returns string like '25 июля 2018, 21:45'
        return function(input, lang) {
            lang = lang || langService.getLanguage() || 'en';
            var date = new Date(input);
            var result = date.getDate() + ' '
                + $filter('monthString')(date.getMonth(), true, lang) + ' '
                + date.getFullYear() + ', '
                + date.getHours() + ':' + date.getMinutes();

            return result;
        }
    }]);