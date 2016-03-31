angular.module('fbApp')
    .controller('mapCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'Map', '$stateParams', 'LocalResolver', 'Search',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, Map, $stateParams, LocalResolver, Search) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');

            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();

            if (navigator.connection && navigator.connection.type == 'none') {
                alert({
                    ru:"Просмотр онлайн-карты недоступен в оффлайн-режиме. Установите подключени к сети интернет и повторите попытку",
                    en:"Online map is unavailable in offline mode. Connect to the network and try again"
                }[$scope.lang]);
                backBtnPressed();
                return;
            }

            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#map .title").height();
            };

            $scope.getImageHeight = function() {
                return screenHeight - $("#map .title").height();
            };

            $scope.getFilterTop = function() {
                return $("#map .title").height() + 15;
            };
            $scope.showMapFilter = false;

            $scope.maxLength = function(str) {
                if (str) {
                    return str.length > 16 ? str.slice(0,15)+'...' : str;
                }
                else return false;
            };


//            $timeout(function() {
            $scope.$on('mapInit', function() {

                $scope.showMapFilter = false;

                if ($stateParams.type == null && $stateParams.coords == null && $stateParams.title == null && $stateParams.object == null) {
                    $scope.Map = Map.showAll($scope.city, addFilters);
                    $scope.showMapFilter = true;
                    return;
                }

                if ($stateParams.type == null) {
                    $scope.Map = Map.showObject($stateParams);
                } else
                if ($stateParams.type == 'route') {
                    $scope.Map = Map.showRoute($stateParams.object);
                } else
                if ($stateParams.type == 'event') {
                    $scope.Map = Map.showEvent($stateParams.object);
                }


            });
            //          });


            $scope.newSearch = function(string) {
                var bounds =  new google.maps.LatLngBounds();
                var count = 0;
                $scope.Map.mapObject.markers.forEach(function(marker) {
                    //if (marker.title.toUpperCase().indexOf(string.toUpperCase()) != -1) {
                    if (Search.checkEntity(marker.linkedEntity, string)) {
                        marker.setMap($scope.Map.mapObject);
                        bounds.extend(marker.getPosition());
                        count++;
                    } else {
                        marker.setMap(null);
                    }
                });
                if (count > 0) {
                    $scope.Map.mapObject.fitBounds(bounds);
                } else {
                    //for(var i = 0; i<$scope.Map.mapObject.markers.length; i++) {
                    //    $scope.Map.mapObject.markers[i].setMap($scope.Map.mapObject);
                    //}
                }

            };


            $scope.takeScreenshot = function() {
                var date = new Date();
                var title = $scope.Map.name[$scope.lang] + " " + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
                title = prompt({
                    ru:"Введите название для изображения",
                    en:"Enter new image name"
                }[$scope.lang], title);
                if (title == null) {
                    return;
                }
                if (LocalResolver.ScreenshotsCache[title]) {
                    title = prompt({
                        ru:"Изображение с таким именем уже существует. Введите новое имя или нажмите ОК, чтобы перезаписать существующее изображение",
                        en:"You already have image with such name. Enter new name or press OK to overwrite it"
                    }[$scope.lang], title);
                    if (title == null) {
                        return;
                    }

                }

                navigator.screenshot.save(function(error,res){
                    if(error){
                        console.error(error);
                    }else{
                        LocalResolver.ScreenshotsCache[title] = res.filePath;
                        LocalResolver.saveCache();
                    }
                },'jpg',90);
            };

            function addFilters() {
                //////////////////////////////// ENTITY FILTERS /////////////////////////////////////
                var entityes = $scope.Map.mapObject.markers;
                var appTags = db.getKey('tags', 'list');
                var selectionTags = [{
                    id: -1,
                    order: 0,
                    name: {
                        ru: "Все",
                        en: "All"
                    },
                    checked: true
                }];
                $scope.pureSelTagsList = [];
                // Вычленяем имеюзиеся категории
                entityes.forEach(function (o) {
                    var obj = o.linkedEntity;
                    obj.tags.forEach(function (tag) {
                        if (selectionTags.indexOf(appTags[tag]) == -1) {
                            selectionTags.push(appTags[tag]);
                            $scope.pureSelTagsList.push(tag);
                        }
                    });
                });
                $scope.entityFilter = {
                    categoryList: selectionTags,
                    order: {
                        objects: true,
                        events: true
                    },
                    actualTags: [],
                    type: 'all'
                };
                $scope.isMap = true;

                $scope.updateEntFilter = function () {
                    $scope.filtered = [];

                    // Показываем все
                    if ($scope.entityFilter.categoryList[0].checked) {
                        // Тут надо вывести все метки
                        entityes.forEach(function (item) {
                            if ($scope.entityFilter.order[item.linkedType]) {
                                item.setMap($scope.Map.mapObject);
                            } else {
                                item.setMap(null);
                            }
                        });
                    } else {
                        // Фильтруем по категориям (tags)

                        $scope.entityFilter.actualTags = [];

                        $scope.entityFilter.actualTags = [];
                        Object.keys($scope.entityFilter.categoryList).forEach(function (key) {
                            if ($scope.entityFilter.categoryList[key].checked) {
                                $scope.entityFilter.actualTags.push($scope.entityFilter.categoryList[key].id);
                            }
                        });

                        entityes.forEach(function (item) {
                            // Сначала скрываем все
                            item.setMap(null);
                            ///////
                            var localTags = item.linkedEntity.tags.filter(function (tag) {
                                return $scope.entityFilter.actualTags.indexOf(tag) != -1;
                            });
                            if (localTags.length > 0) {
                                $scope.filtered.push(item);
                            }
                        });

                        // Попавшим в filtered - выставляем видимость
                        $scope.filtered.forEach(function (item) {
                            if ($scope.entityFilter.order[item.linkedType]) {
                                item.setMap($scope.Map.mapObject);
                            }
                        });

                    }


                };

            //////////////////////////////////////////////////////////////////////////////////////
            }
        }]);