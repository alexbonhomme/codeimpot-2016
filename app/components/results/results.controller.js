(function () {
    angular
    .module('codeimpot.results')
    .controller('ResultsController', ['ResultsService', function(ResultsService){
        console.log(ResultsService.get());
    }]);
}());