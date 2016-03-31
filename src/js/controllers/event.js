angular.module('fbApp')
    .controller('eventCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope',
        'City', 'Event', 'Navigator', '$stateParams', 'Favorites', 'Sheduler',
        function($scope, initView, $timeout, db, $state, langService, $rootScope,
                 City, Event,  Navigator, $stateParams, Favorites, Sheduler)
        {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');



            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();
            $scope.Event = Event.get($stateParams.object);
            $scope.Event.inFavorites = Favorites.check($scope.Event, 'event');
            $scope.linkedContent = Event.getLinkedContent($scope.Event);
            Log("This event: ", $scope.Event);


            $scope.Event.loaded = true;

            $scope.folded = true;
            $scope.showFull = function() {
                $scope.folded = false;
                $timeout(function() {
                    //   if ($scope.folded)
                    //  $(".text.minified").hide();
                }, 300);
            };


            $scope.maxLength = function(str) {
                if (str) {
                    return str.length > 16 ? str.slice(0,15)+'...' : str;
                }
                else return false;
            };

            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#event .title").height();
            };

            $scope.getTimestampTop = function() {
                return $("#event .title").height() + 15;
            };

            $scope.getImageHeight = function() {
                return screenHeight * 0.4;
            };

            $scope.windowWidth = window.innerWidth;

            // TODO: ng-repeat to carousel, when api will be ready
            $scope.$on('EventRenderFinished', function() {
                $timeout(function(){
                    $(".owl-carousel").owlCarousel({
                        items: 1,
                        loop: false,
                        dots: true
                    });
                });
            });

            $scope.shareSocial = function(social) {
                switch (social) {
                    case 'tw': window.open('https://twitter.com/share?url=' + window.shareParams.link('event', $scope.Event.id)+ '&text=' + $scope.Event.name[$scope.lang], '_system'); break;
                    case 'fb': window.open('https://www.facebook.com/sharer/sharer.php?u=' + window.shareParams.link('event', $scope.Event.id), '_system'); break;
                    case 'gp': window.open('https://plus.google.com/share?url=' + window.shareParams.link('event', $scope.Event.id), '_system'); break;
                    case 'tb': window.open('http://www.tumblr.com/share/link?url=' + window.shareParams.link('event', $scope.Event.id), '_system'); break;

                    default: window.plugins.socialsharing.share($scope.Event.description[$scope.lang] || window.shareParams.text, $scope.Event.img.url, window.shareParams.link);break;;
                }
            };

            //$scope.loadAudio = function(audio) {
            //    //TODO: normal loading
            //    window.open(audio.file[$scope.lang].url, '_system');
            //};

            $scope.showMap = function(Event) {
                if (navigator.connection && navigator.connection.type == 'none') {
                    alert({
                        ru:"Просмотр онлайн-карты недоступен в оффлайн-режиме. Установите подключени к сети интернет и повторите попытку",
                        en:"Online map is unavailable in offline mode. Connect to the network and try again"
                    }[$scope.lang]);
                    return;
                }
                $state.go('map', {
                    object: Event,
                    type: 'event'
                });
            };

            $scope.goToTag = function(item, type) {
                Navigator.gotToLinked({
                    object: item,
                    type: type,
                    currentObj: $scope.Event,
                    currentType: 'event'
                });
                //if (type == 'object') {
                //    Log('Navigating to object ', item);
                //    Route.goToObject(item, $scope.Route);
                //}
            };

            $scope.toFavorites = function(obj) {
                Favorites.set(obj, 'event', obj.inFavorites);
                Log('added to Favorites', obj);
                obj.inFavorites = !obj.inFavorites;
            };

            $scope.inSheduler = false;

            $scope.$watch('Event', function () {
                var obj = $scope.Event;
                Sheduler.checkEvent({
                    title: obj.name[$scope.lang],
                    startDate: new Date(obj.dt_start * 1000),
                    endDate: new Date(obj.dt_stop * 1000),
                    text: '',
                    location: obj.maps_xy,
                    success: function (data) {
                        $scope.inSheduler = data.length > 0;
                    }
                });
            });

            $scope.toSheduler = function(obj) {
                Sheduler.checkEvent({
                    title: obj.name[$scope.lang],
                    startDate: new Date(obj.dt_start*1000),
                    endDate: new Date(obj.dt_stop*1000),
                    text: '',
                    location: obj.maps_xy,
                    success: function(data) {
                        Log('Success Find_Event:', data);
                        // if this event not exists in user sheduler
                        if (data.length == 0) {
                            Sheduler.setEvent({
                                title: obj.name[$scope.lang],
                                startDate: new Date(obj.dt_start * 1000),
                                endDate: new Date(obj.dt_stop * 1000),
                                text: '',
                                location: obj.maps_xy,
                                success: function (data) {
                                    Log('Success Create_Event:', data);
                                    alert({
                                        ru: "Событие добавлено в календарь вашего устройства",
                                        en: "Event placed in your device's calendar"
                                    }[$scope.lang]);
                                    $scope.inSheduler = true;
                                }
                            });
                        } else {
                            Sheduler.removeEvent({
                                title: obj.name[$scope.lang],
                                startDate: new Date(obj.dt_start * 1000),
                                endDate: new Date(obj.dt_stop * 1000),
                                text: '',
                                location: obj.maps_xy,
                                success: function (data) {
                                    Log('Success Create_Event:', data);
                                    $scope.inSheduler = false;
                                }
                            });
                        }
                    }
                });
            };

            $scope.toPlans = function(obj) {
                $state.go('sheduler', {
                    addItem: obj,
                    type: 'event'
                });
            };


//////////////////////////// FULLSCREEN IMAGE SHOW ////////////////////////////////////////

            $scope.fullScreenImage = angular.copy($scope.Event.images && $scope.Event.images.length > 0 ? $scope.Event.images : [$scope.Event.img])[0];
            $scope.fullScreenImage.url = $rootScope.ImageCache[$scope.fullScreenImage.url];
            $timeout(function() {
                $(".fullScreenImage img").panzoom({
                    minScale: 1
                });
            });
            $scope.showFullScreen = function(img) {
                $scope.fullScreenImage = angular.copy(img);
                $scope.fullScreenImage.url = $rootScope.ImageCache[img.url];
                $timeout(function() {
                    $(".fullScreenImage").fadeIn(300);
                });
            };
            $scope.closeFullScreen = function(){
                $(".fullScreenImage").fadeOut(300);
            };
///////////////////////////////////////////////////////////////////////////////////////////
            $scope.$on('reloadImages', function() {
                Log("reload catched!");
                $rootScope.getImageByUrl($scope.Event.img.url, '.selection');
                $scope.Event.images.forEach(function(img) {
                    $rootScope.getImageByUrl(img.url, '.selection');
                });
            });
            setTimeout(reloadPageImages, 10);
        }]);