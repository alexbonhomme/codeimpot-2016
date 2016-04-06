(function () {
    angular
    .module('codeimpot.results')
    .controller('ResultsController', ['ResultsService', function(ResultsService){
        var vm = this;

        var data = ResultsService.get();

        if (data) {
            var len = data[0].irpp["2015"].length;
            var res1 = Math.abs(data[0].irpp["2015"][len / 2 - 1]);
            var res2 = Math.abs(data[0].irpp["2015"][len / 2]);

            vm.impo = (res1 + res2) / 2;
        }
    }]);
}());