(function() {
	'use strict';

	angular
		.module('codeimpot.home')
		.controller('HomeController', ['API', '$state', 'ResultsService', function(API, $state, ResultsService) {
			var vm = this;

			vm.isLoading = false;

			vm.userData = {
				statmarit: 2
			};

			vm.scenario = {
				"output_format": "variables",
				"scenarios": [{
					"period": {
						"start": 2015,
						"unit": "year"
					},

					"axes": [{
						"count": 400,
						"max": 60000,
						"min": 0,
						"name": "salaire_imposable"
					}],
					"test_case": {
						"individus": [{
							"id": "Personne Principale",
							"salaire_imposable": 0,
							"statmarit": 2
						}, {
							"id": "Personne Conjoint",
							"salaire_imposable": 0,
							"statmarit": 2
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
				}],
				'variables': ['irpp', 'rni', 'nbptr']
			};

			vm.calculRepartitionChargeEnfant = function() {
				var scenar = vm.scenario.scenarios[0].test_case;

				//Check
				if (!vm.userData.gardeEnfants || !vm.userData.gardeEnfants) {
					return;
				}

				switch (vm.userData.enfants) {
					case 1:
						scenar.foyers_fiscaux[0].f7ga = vm.userData.gardeEnfants;
						break;
					case 2:
						scenar.foyers_fiscaux[0].f7ga = Math.round(vm.userData.gardeEnfants / 2);
						scenar.foyers_fiscaux[0].f7gb = Math.round(vm.userData.gardeEnfants / 2);
						break;
					default:
						scenar.foyers_fiscaux[0].f7ga = Math.round(vm.userData.gardeEnfants / 3);
						scenar.foyers_fiscaux[0].f7gb = Math.round(vm.userData.gardeEnfants / 3);
						scenar.foyers_fiscaux[0].f7gc = Math.round(vm.userData.gardeEnfants / 3);
						break;
				}
			};

			vm.generateScenario = function() {
				var scenar = vm.scenario.scenarios[0].test_case,
					id_enfant;

				// MAJ Situation
				if (vm.userData.statmarit == 1) {
					scenar.individus[0].statmarit = 1;
					scenar.individus[1].statmarit = 1;
				}

				// MAJ Revenus
				scenar.individus[0].salaire_imposable = vm.userData.salaire1 || 0;
				scenar.individus[1].salaire_imposable = vm.userData.salaire2 || 0;

				vm.scenario.scenarios[0].axes[0].max =vm.userData.salaire1 * 2 || 1;

				// MAJ Charges
				scenar.foyers_fiscaux[0].f7uf = vm.userData.donsOeuvres || 0; //dons oeuvres
				scenar.foyers_fiscaux[0].f7wj = vm.userData.depensesEquipements || 0; //Dépenses d'équipements pour les personnes handicapées
				vm.calculRepartitionChargeEnfant();

				// Génère le nombre d'enfants
				for (var i = 0; i < vm.userData.enfants || 0; i++) {
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
				return JSON.stringify(vm.generateScenario());
			};

			vm.callAPI = function() {
				vm.isLoading = true;

				API.calculate(vm.getScenario()).$promise.then(function(data) {
					ResultsService.set(data.value);

					$state.go('results');
					console.log(vm.scenario.scenarios[0].test_case);

					vm.isLoading = false;
				});
			};

		}]);
}());