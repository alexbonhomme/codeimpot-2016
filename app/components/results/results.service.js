(function () {
    angular
    .module('codeimpot.results')
    .service('ResultsService', [function () {
        var cachedData;

        return {
            set: function (data) {
                cachedData = data;
            },
            get: function () {
                return cachedData;
            }
        };
    }]);
}());