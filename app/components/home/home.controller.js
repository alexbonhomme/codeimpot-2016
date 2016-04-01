(function () {
    'use strict';

    angular
    .module('codeimpot.home', [])
    .controller('HomeController', [function(){
        var vm = this;

        vm.test = 'Hello world !';
    }]);
}());
