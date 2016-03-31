angular.module('fbApp').factory('Navigator',['$state', '$rootScope', 'db', function($state, $rootScope, db) {

    var currentReturnType = null,
        currentReturnObject = null;
    /**
     * Navigates to linked object and set the return way
     * @param params {obj, type, currentObj, currentType}
     */
    function gotToLinked(params) {
        if (params.object && params.type) {
            //Objects.setCurrent(obj);
            currentReturnType = params.currentType;
            currentReturnObject = params.currentObj;
            $state.go(params.type, {object: params.object, returnObject: params.currentObj});
            Log('Navigating to ', params);
        }
    };

    function gotToLinkedById(id, city_id, type) {
        var data = db.getKey('cityData', city_id)[type+'s'].filter(function(item) {
            return item.id == id;
        })[0];
        gotToLinked({
            object: data,
            type: type
        });
    };


    function goBack(data) {
        Log("STATE: ", $state.current);
        Log('PREV STATE: ',$rootScope.prevState );
        if (['object', 'route', 'audio', 'event'].indexOf($state.current.name)!= -1) {
            if (currentReturnObject != null) {
                Log('To ' + currentReturnType, currentReturnObject);
                $state.go(currentReturnType, {object: currentReturnObject});
                currentReturnObject = null;
                currentReturnType = null;
            } else {
                data.callback();
            }
        }
        else if ($state.current.name == 'appeals') {
            if ($rootScope.prevState) {
                Log('Going back to', $rootScope.prevState.state);
                $state.go($rootScope.prevState.state, $rootScope.prevState.params);
            } else {
                Log("Going back simple");
                $state.go('editors_choice');
            }
        }
        else if ($state.current.data.prevState) {
            $state.go($state.current.data.prevState);
        }
        else {
            data.callback();
        }
    }

    $rootScope.$on('backbutton-pressed', function(event, data) {
        goBack(data);
    });

    return {
        gotToLinked: gotToLinked,
        gotToLinkedById: gotToLinkedById
    }
}]);