angular.module('fbApp').factory('Events', ['db', '$rootScope', 'Event', function(db, $rootScope, Event){
    return {
        list: function(city) {
            var events = $rootScope.selectedRedaction.data.events;
            for (var i = 0; i < events.length; i++) {
                events[i] = Event.get(events[i]);
            }
            return events;
        },
        setCurrent: function(obj) {
            //db.getOrCreateSection('objects').set('current', obj).save();
            $rootScope.selectedEvent = obj;
        },
        getCurrent: function() {
            return $rootScope.selectedEvent;
        }
    };
}]);