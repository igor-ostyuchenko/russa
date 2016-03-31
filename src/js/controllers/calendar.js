angular.module('fbApp')
    .controller('calendarCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'Calendar', 'Favorites', 'Events',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, Calendar, Favorites, Events) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');

            $scope.city = City.getCurrent();
            if (!$scope.city || $scope.city == null) {
                $state.go('city_select');
            }
            $scope.lang = langService.getLanguage();
            $scope.selected = null;

            $scope.selection = [];

            var dt = new Date();
            dt.setDate(dt.getDate() - 1),
                date = dt.getDate(),
                month = dt.getMonth()+1,
                year = dt.getFullYear();
            $scope.start_date = [
                date > 9 ? date : '0' + date,
                month > 9 ? month: '0' + month,
                year
            ].join('.');
            dt.setMonth(dt.getMonth() + 1);
            date = dt.getDate();
                month = dt.getMonth()+1;
                year = dt.getFullYear();
            $scope.end_date = [
                date > 9 ? date : '0' + date,
                month > 9 ? month: '0' + month,
                year
            ].join('.');

            $scope.currentDate = new Date();


            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#events .title").height();
            };

            $scope.setActive = function(item) {
                $scope.selection.forEach(function(obj) {
                    obj.active = false;
                });
                item.active = true;

                $timeout(function() {
                    Events.setCurrent(item);
                    $state.go('event', {object: item})
                }, 500);
            };

            $scope.checkFavorite = function(item) {
                return Favorites.check(item, 'event');
            };


            $timeout(function() {
               $(".filters .filter input").datetimepicker({
                   todayButton: false,
                   dayOfWeekStart: 1,
                   timepicker:false,
                   format:'d.m.Y',
                   lang: $scope.lang
               });

                $(".filters .filter input").on('focus', function() {
                   $(this).blur();
                });

                $scope.newSearch();
            });


            $scope.newSearch = function() {
                function toDate(d) {
                    d = d.split('.');
                    var date = parseInt(d[0]),
                        month = parseInt(d[1])- 1,
                        year = parseInt(d[2]);
                    return new Date(year, month, date, 0, 0, 0);
                }
                dates = {
                    start: toDate($scope.start_date),
                    end: toDate($scope.end_date)
                };
                $scope.selection = Calendar.get(dates, $scope.city);
            };

        }]);