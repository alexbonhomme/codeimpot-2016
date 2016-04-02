(function () {
    angular
    .module('codeimpot.results')
    .controller('ResultsController', ['ResultsService', function(ResultsService){
        var vm = this;

        var data = ResultsService.get();

        if (data) {
            vm.impo = Math.abs(data[0].irpp["2015"][0]);
        }
    }]);
}());