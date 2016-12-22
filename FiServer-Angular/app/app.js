'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.todasLasNotas',
  'myApp.favoritas',
  'myApp.compartidas',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/todasLasNotas'});
}]);
// Enable pusher logging - don't include this in production