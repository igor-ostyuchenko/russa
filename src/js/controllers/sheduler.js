angular.module('fbApp')
    .controller('shedulerCtrl', ['$scope', 'initView', '$timeout', 'db', '$state', 'langService', '$rootScope', 'City', 'Route', 'Navigator', '$stateParams', 'PlanningService',
        function($scope, initView, $timeout, db, $state, langService, $rootScope, City, Route, Navigator, $stateParams, PlanningService) {
            $timeout(initView.render);
            $(".burger-menu").removeClass('active');


            $scope.city = City.getCurrent();
            $scope.lang = langService.getLanguage();

            if ($stateParams.addItem != null) {
                $scope.addMode = true;

            }


            //PlanningService.test();

            $scope.sections = PlanningService.list();

            Log('Loaded sections:', $scope.sections);

            var screenHeight = $(window).height();
            $scope.getSelectionHeight = function() {
                return screenHeight - ($("#sheduler .title").height() + $("#sheduler .filters").height() + 15);
            };

            $scope.getImageHeight = function() {
                return screenHeight * 0.4;
            };



            $scope.saveSection = function (section, noSave) {
                if (!section.name || section.name.trim() == "") {
                    section.name = {
                        ru: "Новый раздел " + ($scope.sections.length),
                        en: "New section " + ($scope.sections.length)
                    }[$scope.lang];
                }

                section.editMode = false;
                if (noSave) {
                    return;
                }


                PlanningService.saveParts($scope.sections);
            };

            $scope.applySectionModify = function (section) {
                if ($scope.addMode) {
                    console.info('ADD MODE');
                    section.data.push({
                        type: $stateParams.type,
                        data: $stateParams.addItem
                    });
                    $scope.addMode = false;
                }
                $scope.saveSection(section);
            };

            $scope.removeSection = function (section) {
                if (confirm({
                        ru: "Удалить выбранный раздел?",
                        en: "Remove selected section?"
                    }[$scope.lang])) {
                    var index = $scope.sections.indexOf(section);
                    if (index != -1) {
                        section.removed = true;
                        $timeout(function() {
                            $scope.sections.splice(index, 1);
                            PlanningService.saveParts($scope.sections);
                        }, 300);
                    }
                }
            };

            $scope.setEditable = function(section) {
                for (var i = 0; i < $scope.sections.length; i++) {
                    $scope.saveSection($scope.sections[i]);
                }
                section.editMode = true;
            };

            $scope.goToSection = function (section) {
                if (!section.editMode) {
                    if ($scope.addMode) {
                        $scope.applySectionModify(section);
                        return;
                    }

                    $rootScope.sheduler_section = section;
                    $rootScope.sheduler_sections = $scope.sections;
                    $state.go('sheduler_section', {section: section, sections: $scope.sections});
                }
            };

            $scope.addSection = function() {
                var newSec = {
                    name: "",
                    data: [],
                    editMode: false
                };
                $scope.sections.push(newSec);
                $timeout(function() {
                    $scope.setEditable(newSec);
                }, 100);
            };

            $scope.addToList = function (section) {
                $scope.applySectionModify(section);
            };

        }]);