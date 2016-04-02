(function() {
	'use strict';

	angular
		.module('codeimpot.home', [
			'codeimpot.api'
		])
		.controller('HomeController', ['API', function(API) {
			var vm = this;

			vm.userData = {
				statmarit: 2
			};

			vm.scenario = {
				"scenarios": [{
					"period": {
						"start": 2014,
						"unit": "year"
					},
					"test_case": {
						"individus": [{
							"id": "Personne Principale",
							"salaire_de_base": {
								"2014": 50000
							},
							"statmarit": vm.userData.statmarit
						}, {
							"id": "Personne Conjoint",
							"salaire_de_base": {
								"2014": 35000
							}
						}],
						"familles": [{
							"id": "Famille 1",
							"parents": ["Personne Principale", "Personne Conjoint"],
							"enfants": []
						}],
						"foyers_fiscaux": [{
							"id": "Déclaration d'impôt 1",
							"declarants": ["Personne Principale", "Personne Conjoint"],
							"personnes_a_charge": []
						}],
						"menages": [{
							"id": "Logement principal 1",
							"personne_de_reference": "Personne Principale",
							"conjoint": "Personne Conjoint",
							"enfants": []
						}]
					}
				}]
			};

			vm.generateScenario = function() {
				var scenar = vm.scenario.scenarios[0].test_case,
					id_enfant;

				//Génère le nombre d'enfants
				for (var i = 0; i < 2; i++) {
					id_enfant = i.toString();

					scenar.individus.push({
						"id": id_enfant
					});
					scenar.familles[0].enfants.push(id_enfant);
					scenar.foyers_fiscaux[0].personnes_a_charge.push(id_enfant);
					scenar.menages[0].enfants.push(id_enfant);
				}

				return vm.scenario;
			};

			vm.getScenario = function() {
				vm.generateScenario();
				return JSON.stringify(vm.scenario);
			}

			API.simulate(vm.getScenario()).$promise.then(function(data) {
				vm.results = data;
				console.log(vm.scenario);
			});
		}]);
}());