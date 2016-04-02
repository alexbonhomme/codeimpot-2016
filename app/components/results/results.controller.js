(function () {
    angular
    .module('codeimpot.results')
    .controller('ResultsController', ['ResultsService', function(ResultsService){
        var vm = this;

        var data = ResultsService.get();

        if (data) {
            vm.impo = data[0].menages[0].impo["2014"];
        }
    }]);
}());