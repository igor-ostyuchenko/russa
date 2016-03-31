angular.module('fbApp').factory('initView', ['$rootScope', function($rootScope) {
   return {
      render: function() {
         $(".view").trigger('create');
         $rootScope.randomNum = Math.floor(100*Math.random());
      }
   };
}]);