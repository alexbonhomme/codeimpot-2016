(function () {
    'use strict';

    angular
    .module('codeimpot.home', [
        'codeimpot.api'
    ])
    .controller('HomeController', ['API', function (API) {
        var vm = this;

        API.reforms().$promise.then(function (data) {
            vm.reforms = data;
        });
    }]);
}());
