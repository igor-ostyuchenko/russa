angular.module('fbApp').factory('Sheduler', ['db', '$rootScope', function(db, $rootScope) {

    function setEvent(options) {
        options = options || {};
        var startDate = options.startDate || new Date();
        var endDate = options.endDate || new Date();
        var title = options.title || "Unnamed event";
        var location = options.location || "";
        var notes = options.text || "No information about event";
        var success = options.success || function(message) { Log("Success Event_Create: ", (message)); };
        var error = options.error || function(message) { Log("Error Event_Create: ", message); };
        window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
    };

    function checkEvent(options) {
        options = options || {};
        var startDate = options.startDate || null;
        var endDate = options.endDate || null;
        var title = options.title || "Unnamed event";
        var location = options.location || "";
        var notes = options.text || "No information about event";
        var success = options.success || function(message) { Log("Success Event_Find: ", (message)); };
        var error = options.error || function(message) { Log("Error Event_Find: ", message); };
        window.plugins.calendar.findEvent(title,location,notes,startDate,endDate,success,error);
    };


    function removeEvent(options) {
        options = options || {};
        var startDate = options.startDate || new Date();
        var endDate = options.endDate || new Date();
        var title = options.title || "Unnamed event";
        var location = options.location || "";
        var notes = options.text || "No information about event";
        var success = options.success || function(message) { Log("Success Event_Find: ", (message)); };
        var error = options.error || function(message) { Log("Error Event_Find: ", message); };
        window.plugins.calendar.deleteEvent(title,location,notes,startDate,endDate,success,error);
    }

    return {
        setEvent: setEvent,
        checkEvent: checkEvent,
        removeEvent: removeEvent
    }
}]);