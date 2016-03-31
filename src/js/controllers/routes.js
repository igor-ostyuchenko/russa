angular.module('fbApp')
    .controller('routesCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'Routes', 'Favorites',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, Routes, Favorites) {
            $timeout( initView.render);
            $(".burger-menu").removeClass('active');

            $scope.$on('backbutton-pressed', function(event, data) {
                data.callback();
            });

            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();
            $scope.selected = null;

            $scope.selection = Routes.list($scope.city);
            $scope.filtered = $scope.selection;


            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - $("#routes .title").height();
            };
            $scope.windowWidth = window.innerWidth;

            $scope.setActive = function(item) {
                $scope.selection.forEach(function(obj) {
                    obj.active = false;
                });
                item.active = true;

                $timeout(function() {
                    Routes.setCurrent(item);
                    $state.go('route', {object: item});
                }, 500);
            };

            $scope.checkFavorite = function(item) {
                return Favorites.check(item, 'route');
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
            //////////////////////////////// ENTITY FILTERS /////////////////////////////////////
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
            $scope.pureSelTagsList =[];
            $scope.selection.forEach(function(obj) {
                obj.tags.forEach(function(tag) {
                    if (selectionTags.indexOf(appTags[tag]) == -1) {
                        selectionTags.push(appTags[tag]);
                        $scope.pureSelTagsList.push(tag);
                    }
                });
            });
            $scope.entityFilter = {
                categoryList: selectionTags,
                order: {
                    likes: false,
                    byLength: false
                },
                actualTags: []
            };

            $scope.updateEntFilter = function(orderStr) {
                $scope.filtered = [];
                if (orderStr) {
                    var vall = $scope.entityFilter.order[orderStr];
                    Object.keys($scope.entityFilter.order).forEach(function(key) {
                        $scope.entityFilter.order[key] = false;
                    });
                    $scope.entityFilter.order[orderStr] = !vall;
                }

                // Сортировка
                function sortData() {
                    $timeout(function(){
                        var critera = '';
                        Object.keys($scope.entityFilter.order).forEach(function(key) {
                            if ($scope.entityFilter.order[key]) {
                                critera = key;
                            }
                        });

                        $scope.filtered.sort(function(a, b) {
                            if (critera == 'likes') {
                                return - parseFloat(a.likes) + parseFloat(b.likes);
                            } else if (critera == 'byLength') {
                                return - parseFloat(a.length) + parseFloat(b.length);
                            }
                            return 0;
                        });
                    },0);
                }

                // Показываем все
                if ($scope.entityFilter.categoryList[0].checked) {
                    $scope.filtered = $scope.selection;

                } else {
                    // Фильтруем по категориям (tags)

                    $scope.entityFilter.actualTags = [];

                    $scope.entityFilter.actualTags = [];
                    Object.keys($scope.entityFilter.categoryList).forEach(function(key) {
                        if  ($scope.entityFilter.categoryList[key].checked) {
                            $scope.entityFilter.actualTags.push($scope.entityFilter.categoryList[key].id);
                        }
                    });

                    $scope.selection.forEach(function(item) {
                        var localTags = item.tags.filter(function(tag) {
                            return  $scope.entityFilter.actualTags.indexOf(tag) != -1;
                        });
                        if (localTags.length > 0){
                            $scope.filtered.push(item);
                        }
                    });

                }
                sortData();




            };

//////////////////////////////////////////////////////////////////////////////////////
            $scope.$on('reloadImages', function() {
                Log("reload catched!");
                $scope.selection.forEach(function(item) {
                    var img = item.img;
                    $rootScope.getImageByUrl(img.url, '.selection');
                    item.images.forEach(function(img) {
                        $rootScope.getImageByUrl(img.url, '.selection');
                    });
                });
            });
            setTimeout(reloadPageImages, 10);
        }]);