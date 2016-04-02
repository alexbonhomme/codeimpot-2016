(function () {

    /**
     * D3 drawing function
     * @param  {[type]} d3
     * @param  {[type]} $element
     * @param  {Array} data
     */
    function chart(d3, $element, data) {

          var margin = {top: 100, right: 80, bottom: 30, left: 30};
          var width = 800 - margin.left - margin.right;
          var height = 650 - margin.top - margin.bottom;

          var margin_first_text = 100;
          var margin_last_text = 60;

          var width_graph = width - margin_first_text - margin_last_text;

          var svg = d3.select($element.find('#vis')[0])
          .append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          var xScale = d3.scale.linear().range([0, width_graph]);
          var colorScale = d3.scale.category10();
          var color_ref = "red";

          var x = d3.scale.linear()
          .domain([0, 100])
          .range([0, width])
          .clamp(true);




          var div_tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);




            var x0 = 0;

            data.forEach(function(d) {
              d.name = d.nom;
              d.value = +d.Impots;
              d.value0 = x0;
              x0 = x0 + d.value;


            });



        var sum_values = d3.sum(data, function(d){return d.value});

        xScale.domain([0, sum_values]);





        var RefType = svg.append("g")
        .attr('class', 'type')
        .attr("transform", function(d, i){return "translate(0 ,0)";});

        RefType
        .append('rect')
        .attr('height', 40)
        .attr("width", function(d){return xScale(sum_values);})
        .attr('fill', color_ref)
        .attr("x", margin_first_text);

        RefType
        .append('text')
        .attr("class", "name_text")
        .attr("y", 25)
        .text("Référence");


        RefType
        .append('text')
        .attr("class", "name_text")
        .attr("y", 25)
        .attr("x", margin_first_text + width_graph)
        .text(sum_values + " €")
        .attr("fill", color_ref);


        RefType.select('rect')
        .on('mouseover', function() {
          var this_left_val = margin_first_text + width_graph - xScale(sum_values) + xScale(sum_values)/2;
          var this_top_val = margin.top + 50;
          div_tooltip.html('<p> Référence</p>' + '<p>' + sum_values + ' euros </p> ').style('left', this_left_val + 'px').style('top', this_top_val  + 'px').style('height', 50 + 'px').style('opacity', 0.9);
        })
        .on('mouseout', function(d) {
          div_tooltip.style('opacity', 0);
        });

        var Types_ = svg.selectAll('types')
        .data(data);

        var Types = Types_.enter()
        .append("g")
        .attr('class', 'type')
        .attr("transform", function(d, i){return "translate(0 ," + parseInt(i*43 + 50) + ")";});


        Types
        .append('rect')
        .attr('height', 40)
        .attr("width", function(d){return xScale(d.value);})
        .attr('fill', function(d){return colorScale(d.typologie);})
        .attr("x", function(d){return margin_first_text + width_graph - xScale(d.value0) - xScale(d.value);});

        Types
        .append('text')
        .attr("class", "name_text")
        .attr("y", 25)
        .text(function(d){return d.name;})
        .attr("fill", function(d){return colorScale(d.typologie)});


        Types
        .append('text')
        .attr("class", "name_text")
        .attr("y", 25)
        .attr("x", margin_first_text + width_graph)
        .text(function(d){if (d.typologie == "deduction"){var minus_sign = "-"}else{var minus_sign = ""} ; return minus_sign + d.value + " €";})
        .attr("fill", function(d){return colorScale(d.typologie)});


        Types.select('rect')
        .on('mouseover', function(d, i) {

          var this_left_val = margin_first_text + width_graph - xScale(d.value0) - xScale(d.value)/2;
          var this_top_val = margin.top + i*43 + 100;
          div_tooltip.html('<p>' + d.name + '</p>' + '<p>' + d.value + ' euros </p> ').style('left', this_left_val + 'px').style('top', this_top_val  + 'px').style('height', 50 + 'px').style('opacity', 0.9);
        })
        .on('mouseout', function(d) {
          div_tooltip.style('opacity', 0);
        });



    }

    angular
        .module('codeimpot.results')
        .directive('barChart', ['d3Service', function (d3Service) {
            return {
                restrict: 'EA',
                scope: {},
                templateUrl: 'components/results/barchart.template.html',
                link: function(scope, element, attrs) {
                    d3Service.d3().then(function (d3) {
                        var data = [{
                            "Situation": "Situation de r\u00e9f\u00e9rence",
                            "Montant net": 19255,
                            "Impots": 6544,
                            "Type impact": "Foyer fiscal",
                            "nom": "Mariage",
                            "typologie": "deduction"
                          }, {
                            "Situation": "Enfants",
                            "Montant net": 12711,
                            "Impots": 3020,
                            "Type impact": "Foyer fiscal",
                            "nom": "enfants",
                            "typologie": "deduction"
                          }, {
                            "Situation": "D\u00e9duction des frais professionnels",
                            "Montant net": 9691,
                            "Impots": 2400,
                            "Type impact": "Abattement",
                            "nom": "Frais pro",
                            "typologie": "deduction"
                          }, {
                            "Situation": "Aux oeuvres reconnues d'utilit\u00e9 publique ou fiscalement assimil\u00e9es en mati\u00e8re de dons, aux oeuvres d'int\u00e9r\u00eat g\u00e9n\u00e9ral 7UF",
                            "Montant net": 7291,
                            "Impots": 1320,
                            "Type impact": "R\u00e9duction d'imp\u00f4t",
                            "nom": "Dons",
                            "typologie": "deduction"
                          }, {
                            "Situation": "Mat\u00e9riaux d\u2019isolation thermique des parois vitr\u00e9es (fen\u00eatres, portes-fen\u00eatres\u2026)  7AM",
                            "Montant net": 5971,
                            "Impots": 2400,
                            "Type impact": "Cr\u00e9dit d'imp\u00f4t",
                            "nom": "Isolation",
                            "typologie": "deduction"
                          }, {
                            "Situation": "Frais de garde des enfants de moins de 6 ans au 1\/1\/2015 7GA",
                            "Montant net": 3571,
                            "Impots": 1150,
                            "Type impact": "Cr\u00e9dit d'imp\u00f4t",
                            "nom": "Garde enfants",
                            "typologie": "deduction"
                          }, {
                            "Situation": "Situation r\u00e9elle",
                            "Montant net": 2421,
                            "Impots": 2421,
                            "Type impact": "Reste \u00e0 payer",
                            "nom": "A payer",
                            "typologie": "reel"
                          }];

                        chart(d3, element, data);
                    });
                }
            };
        }]);
}());