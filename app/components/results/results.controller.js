(function () {
    angular
    .module('codeimpot.results')
    .controller('ResultsController', ['ResultsService', function(ResultsService){
        var vm = this;

        var data = ResultsService.get();

        if (data) {
            var len = data[0].irpp["2015"].length;

            vm.impo = Math.abs(data[0].irpp["2015"][len / 2]);
        }
    }]);
}());