angular.module('fbApp').factory('ShedulerSection', ['db', '$rootScope', '$state', 'PlanningService', function(db, $rootScope, $state, PlanningService){
    var parts = [];
    var index = 0;
    return {
        associate: function(Section, Sections) {
            parts = Sections;
            index = parts.indexOf(Section);
        },
        save: function(Section) {
            parts[index] = Section;
            PlanningService.saveParts(parts);
        }
    };
}]);