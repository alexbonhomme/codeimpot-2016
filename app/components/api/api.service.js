(function () {
    angular
    .module('codeimpot.api', [])
    .service('API', ['$resource', 'API_BASE', function($resource, API_BASE) {

        return $resource(API_BASE + '/calculate', null, {

            /**
             * @see: http://doc.openfisca.fr/openfisca-web-api/endpoints.html#calculate
             */
            calculate: {
                method: 'POST',
            },

            /**
             * @see: http://doc.openfisca.fr/openfisca-web-api/endpoints.html#entities
             */
            entities: {
                method: 'GET',
                url: API_BASE + '/entities'
            },

            /**
             * @see: http://doc.openfisca.fr/openfisca-web-api/endpoints.html#graph
             */
            graph: {
                method: 'GET',
                url: API_BASE + '/graph'
            },

            /**
             * @see: http://doc.openfisca.fr/openfisca-web-api/endpoints.html#parameters
             */
            parameters: {
                method: 'GET',
                url: API_BASE + '/parameters'
            },

            /**
             * @see: http://doc.openfisca.fr/openfisca-web-api/endpoints.html#reforms
             */
            reforms: {
                method: 'GET',
                url: API_BASE + '/reforms'
            },

            /**
             * @see: http://doc.openfisca.fr/openfisca-web-api/endpoints.html#simulate
             */
            simulate: {
                method: 'POST',
                url: API_BASE + '/simulate'
            },

            /**
             * @see: http://doc.openfisca.fr/openfisca-web-api/endpoints.html#variables
             */
            variables: {
                method: 'GET',
                url: API_BASE + '/variables'
            }
        });
    }]);
}());