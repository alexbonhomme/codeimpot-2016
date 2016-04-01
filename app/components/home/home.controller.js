(function () {
    'use strict';

    angular
    .module('codeimpot.home', [
        'codeimpot.api'
    ])
    .controller('HomeController', ['API', function (API) {
        var vm = this;

        API.simulate({
            // TODO
        }).$promise.then(function (data) {
            vm.results = data;
        });
    }]);
}());
