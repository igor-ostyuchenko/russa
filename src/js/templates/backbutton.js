$scope.$on('backbutton-pressed', function(event, data) {
    console.info(data);
    data.callback();
});