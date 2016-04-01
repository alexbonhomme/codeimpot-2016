(function () {

    'use strict';

    angular
    .module('codeimpot', [
        'ngRoute',
        'ngAnimate',
        'ngMaterial',

        'codeimpot.home'
    ])

    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        // routes
        $routeProvider
        .when("/", {
            templateUrl: "components/home/home.view.html",
            controller: "HomeController as HomeCtrl"
        })
        .otherwise({
            redirectTo: '/'
        });
    }]);
}());
