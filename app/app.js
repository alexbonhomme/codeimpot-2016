(function () {

    'use strict';

    angular
    .module('codeimpot', [
        'ui.router',
        'ngAnimate',
        'anim-in-out',
        'ngResource',
        'ngMaterial',

        'codeimpot.home',
        'codeimpot.results'
    ])

    .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise("/");

        // routes
        $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "components/home/home.view.html",
            controller: "HomeController",
            controllerAs: "HomeCtrl"
        })
        .state('results', {
            url: "/results",
            templateUrl: "components/results/results.view.html"
        });
    }])

    .constant('API_BASE', 'http://api.openfisca.fr/api/1')
    ;
}());
