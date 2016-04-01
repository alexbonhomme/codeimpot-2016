(function () {

    'use strict';

    angular
    .module('codeimpot', [
        'ui.router',
        'ngAnimate',
        'ngMaterial',

        'codeimpot.home'
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
        });
    }]);
}());
