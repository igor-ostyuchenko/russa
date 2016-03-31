angular.module('fbApp')
    .controller('appealsCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'Route',
        'Navigator', '$stateParams', 'Appeals', '$sessionStorage', '$http',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, Route, Navigator, $stateParams, Appeals, $sessionStorage, $http) {
            $timeout(initView.render);
            $(".burger-menu").removeClass('active');

            var data = Appeals.loadMessages();
            $scope.categoryes = data.categories;
            $scope.messages = data.list;

            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();


            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - ($("#appeals .title").height());
            };
            $scope.getNewWTop = function() {
                return screenHeight * 0.4;
            };
            $scope.windowWidth = window.innerWidth;

            $scope.categoryes = [];
            $scope.messages = [];
            $scope.status = [{
                en: "Registered",
                ru: "Зарегистрирован",
                css: "reg"
            },{
                en: "Processing",
                ru: "В работе",
                css: "work"
            }, {
                en: "Closed",
                ru: "Получен ответ",
                css: "closed"
            }
            ];

            $scope.$on('MsgListLoaded', function() {
                $scope.categoryes = $sessionStorage.categoryList;
                $scope.messages = $sessionStorage.msgList;
            });


            $scope.newAppeal = {
                subject: '',
                text: '',
                files:[{a:1}]
            };

            $scope.setActive = function(item) {
                $state.go('appeal', {appeal: item});
            };

            $scope.logOut = function() {
                $sessionStorage.user = false;
                $http.get(window.apiServer + 'auth/logout/');
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };

            $scope.showForm = function() {
                $scope.user = angular.copy($sessionStorage.user);
                $scope.newAppeal.show = true;
                $scope.newAppeal.fio_error = false;
                $scope.newAppeal.text_error = false;
                $scope.newAppeal.category = 1;
                $scope.newAppeal.files = [{a:1}];
            };

            $scope.sendNew = function() {
                if (!$scope.user.fio || $scope.user.fio == '') {
                    $scope.newAppeal.fio_error = true;
                    return;
                }
                $scope.newAppeal.fio_error = false;

                if (!$scope.newAppeal.text || $scope.newAppeal.text == '') {
                    $scope.newAppeal.text_error = true;
                    return;
                }
                $scope.newAppeal.text_error = false;

                $scope.newAppeal.sending = true;
                Appeals.send($scope.user.fio, $scope.newAppeal.subject, $scope.newAppeal.text, $scope.newAppeal.feed, $scope.newAppeal.category, function() {
                    $scope.newAppeal.sending = false;
                    $scope.newAppeal.show = false;
                    $timeout(function() {
                        $scope.newAppeal.subject = '';
                        $scope.newAppeal.text = '';
                        $scope.newAppeal.feed = true;
                        $scope.newAppeal.category = 1;
                        $scope.newAppeal.files = [{a:1}];
                    }, 500);
                    Appeals.loadMessages();
                    setTimeout(function() {
                        $scope.$apply();
                    }, 0);
                });

            };

            $scope.itemSelected = false;
            $scope.goToAppeal = function(appeal) {
                for (var i = 0; i < $scope.messages.length; i++) {
                    if ($scope.messages[i] != appeal) {
                        $scope.messages[i].active = false;
                    }
                }

                $timeout(function(){
                    $(".selection .message:not(.active) .info").stop().hide(300);
                },50);

                $scope.itemSelected = true;
                if (!appeal.active) {
                    $timeout(function () {
                        $(".selection .message.active .info").stop().show(300);
                    }, 50);
                }
                appeal.active = true;
            };


            $scope.getRating = function(msg) {
                return msg.rating;
            };

            $scope.rateChange = function(msg, rate) {
                Appeals.rate(msg, rate);
                msg.rating = rate;
            };

            $scope.fileChanged = function(file) {
                var index = $scope.newAppeal.files.indexOf(file);
                if (index == $scope.newAppeal.files.length - 1 ) {
                    $scope.newAppeal.files.push({a:1});
                }
            };

        }])
    .filter('msgDate', function() {
        return function(input) {
            var d = new Date(input * 1000),
                date = d.getDate(),
                month = d.getMonth() + 1,
                year = d.getFullYear();

            return (date < 10 ? '0' + date: date) + '.' + (month < 10 ? '0' + month: month) + '.' + year;
        }
    })
    .directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    scope.$apply(function () {
                        scope.fileread = changeEvent.target.files[0];
                        Log("files", changeEvent.target);
                    });
                });
                scope.$watch(scope.fileread, function(files) {
                    $(element).val(files);
                });
            }
        }
    }]);