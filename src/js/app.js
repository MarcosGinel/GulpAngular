angular.module("holaMundoAngular", ['ngRoute'])
       .config(['$routeProvider', function($routeProvider) {
         $routeProvider
          .when('/', {
            templateUrl: "views/vista.html",
            controller: "VistaController"
          });
       }])
