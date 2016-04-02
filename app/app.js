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

    .constant('API_BASE', 'http://api.openfisca.fr/api/1')

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
            templateUrl: "components/results/results.view.html",
            controller: "ResultsController",
            controllerAs: "ResultsCtrl"
        })
        .state('analyses1', {
            url: "/analyses1",
            templateUrl: "components/analyses/analyses1.view.html"
        })
        .state('analyses2', {
            url: "/analyses2",
            templateUrl: "components/analyses/analyses2.view.html"
        });
    }])

    .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.goBack = function () {
            window.history.back();
        };
    }]);
}());
