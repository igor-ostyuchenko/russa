angular.module('fbApp').factory('Calendar', ['db', '$rootScope', 'Event', function(db, $rootScope, Event){
    return {
        get: function(dates, city) {
            var result = [],
                events = db.getKey('cityData', city.id).events;
            for (var i = 0; i < events.length; i++) {
                var e = events[i];
                if (e.dt_start*1000 >= dates.start && e.dt_start*1000 <= dates.end ) {
                    result.push(Event.get(e));
                }
            }
            Log('Filtered events:', result);
            return result;
        }
    };
}]);