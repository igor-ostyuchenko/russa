angular.module('fbApp').factory('Event', ['db', '$rootScope', '$filter', function(db, $rootScope, $filter){
    return {
        get: function(obj) {
            var event = obj || $rootScope.selectedEvent;
            
            var dates = {
                start: new Date(event.dt_start*1000),
                end: new Date(event.dt_stop*1000)
            };
            event.dates =  dates;
            event.past = event.dates.end < new Date();

            function doubleDigit(d) {
              return d.toString().length > 1 ? d : '0' + d;
            };

            event.dateStr = [
                dates.start.getDate(), ' ',
                $filter('monthString')(dates.start.getMonth(), true),
                ' - ',
                dates.end.getDate(), ' ',
                $filter('monthString')(dates.end.getMonth(), true), ' ',
                doubleDigit(dates.start.getHours()), ':', doubleDigit(dates.start.getMinutes()), '-',
                    doubleDigit(dates.end.getHours()), ':', doubleDigit(dates.end.getMinutes())
            ].join('');

            return event;
        },
        getLinkedContent: function(Event) {
            var cityData = db.getKey('cityData', Event.city_id),
                Audios = cityData.audios.filter(function(item) {
                    return Event.audios.indexOf(item.id) != -1;
                }),
                Events = cityData.events.filter(function(item) {
                    return Event.events.indexOf(item.id) != -1;
                }),
                Routes = cityData.routes.filter(function(item) {
                    return Event.routes.indexOf(item.id) != -1;
                }),
                Objects = cityData.objects.filter(function(item) {
                    return Event.objects.indexOf(item.id) != -1;
                });
            return {
                audios: Audios,
                events: Events,
                routes: Routes,
                objects: Objects
            };
        }
    };
}]);