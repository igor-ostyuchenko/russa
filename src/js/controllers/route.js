angular.module('fbApp')
    .controller('routeCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'Route', 'Navigator', '$stateParams', 'Favorites',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, Route, Navigator, $stateParams, Favorites) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');


            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();
            $scope.Route = $stateParams.object || Route.get();
            $scope.Route.inFavorites = Favorites.check($scope.Route, 'route');
            $scope.linkedContent = Route.getLinkedContent($scope.Route);
            Log("This object linked content: ", $scope.linkedContent);

            // TODO: Remove next lines when api will be ready
            // $scope.Object.description.ru = "разводной мост через реку Неву (Большую Неву) в Санкт-Петербурге. Соединяет центральную часть города (Адмиралтейский остров) и Васильевский остров.<br/>Находится на оси Дворцового проезда и Биржевой площади. Длина моста — 250 м[1] (по другим данным, 255 м[3]), ширина — 27,7 м. Состоит из пяти пролетов. Разведённый двукрылый центральный пролёт Дворцового моста — один из символов города.<h3>История моста</h3><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/The_Palace_bridge_in_the_19th_century.jpg/250px-The_Palace_bridge_in_the_19th_century.jpg'/><br/><p>В 1853 году Николай I удовлетворил просьбу представителей купечества о перемещении Исаакиевского плашкоутного моста к Зимнему дворцу для прямой и постоянной связи с Биржей и другими учреждениями Торгового порта. Проект установки моста на новой трассе разработал инженер И. К. Герард. К реализации был принят вариант моста с деревянными береговыми опорами и такими же перилами. На мосту были установлены чугунные художественного литья торшеры с фонарями, представляющие собой стержни с развитыми базами на пьедесталах, увенчанные фонарями в виде усечённых шестигранных пирамид[5]. Пролетные строения представляли собой подкосные конструкции. В состав нового моста вошли 3 плашкоута из старого Исаакиевского[4]. На осуществление проекта ушло более трёх лет. Перемещение Исаакиевского моста было завершено лишь 10 декабря 1856 года[6]. В периоды ледохода и ледостава мост разводился.</p>";


            $scope.Route.loaded = true;

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
                return screenHeight - $("#objects .title").height();
            };

            $scope.getImageHeight = function() {
                return screenHeight * 0.4;
            };

            $scope.windowWidth = window.innerWidth;

            // TODO: ng-repeat to carousel, when api will be ready
            $scope.$on('RouteRenderFinished', function() {
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
                    case 'tw': window.open('https://twitter.com/share?url=' + window.shareParams.link('route', $scope.Route.id)+ '&text=' + $scope.Route.name[$scope.lang], '_system'); break;
                    case 'fb': window.open('https://www.facebook.com/sharer/sharer.php?u=' + window.shareParams.link('route', $scope.Route.id), '_system'); break;
                    case 'gp': window.open('https://plus.google.com/share?url=' + window.shareParams.link('route', $scope.Route.id), '_system'); break;
                    case 'tb': window.open('http://www.tumblr.com/share/link?url=' + window.shareParams.link('route', $scope.Route.id), '_system'); break;

                    default: window.plugins.socialsharing.share($scope.Route.description[$scope.lang] || window.shareParams.text, $scope.Route.img.url, window.shareParams.link);break;;
                }
            };

            //$scope.loadAudio = function(audio) {
            //    //TODO: normal loading
            //    window.open(audio.file[$scope.lang].url, '_system');
            //};

            $scope.showMap = function(Route) {
                if (navigator.connection && navigator.connection.type == 'none') {
                    alert({
                        ru:"Просмотр онлайн-карты недоступен в оффлайн-режиме. Установите подключени к сети интернет и повторите попытку",
                        en:"Online map is unavailable in offline mode. Connect to the network and try again"
                    }[$scope.lang]);
                    return;
                }
                $state.go('map', {
                    object: Route,
                    type: 'route'
                });
            };

            $scope.goToTag = function(item, type) {
                Navigator.gotToLinked({
                    object: item,
                    type: type,
                    currentObj: $scope.Route,
                    currentType: 'route'
                });
                //if (type == 'object') {
                //    Log('Navigating to object ', item);
                //    Route.goToObject(item, $scope.Route);
                //}
            };

            $scope.toFavorites = function(obj) {
                Favorites.set(obj, 'route', obj.inFavorites);
                Log('added to Favorites', obj);
                obj.inFavorites = !obj.inFavorites;
            };

            $scope.toPlans = function(obj) {
                $state.go('sheduler', {
                    addItem: obj,
                    type: 'route'
                });
            };


//////////////////////////// FULLSCREEN IMAGE SHOW ////////////////////////////////////////

            $scope.fullScreenImage = angular.copy($scope.Route.images && $scope.Route.images.length > 0 ? $scope.Route.images : [$scope.Route.img])[0];
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
                $rootScope.getImageByUrl($scope.Route.img.url, '.selection');
                $scope.Route.images.forEach(function(img) {
                    $rootScope.getImageByUrl(img.url, '.selection');
                });
            });
            setTimeout(reloadPageImages, 10);
        }]);