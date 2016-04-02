(function () {

    /**
     * D3 drawing function
     * @param  {[type]} d3
     * @param  {[type]} $element
     * @param  {[type]} data_perso
     * @param  {[type]} data_line
     * @param  {[type]} x_depart
     */
    function chart(d3, $element, data_perso, data_line, x_depart) {


        var margin = {top: 100, right: 80, bottom: 30, left: 100};
        var width = 800 - margin.left - margin.right;
        var height = 650 - margin.top - margin.bottom;

        var margin_first_text = 0;
        var margin_last_text = 0;

        var width_graph = width - margin_first_text - margin_last_text;

        var svg = d3.select($element.find("#vis")[0])
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



        var colorScale = d3.scale.category10();

        var x = d3.scale.linear()
        .range([0, width]);

        var y = d3.scale.linear()
        .range([height, 0]);

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.format("0f"));

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("0f"));

        var line = d3.svg.line()
        .x(function(d) { return x(d.Revenus); })
        .y(function(d) { return y(d.Impots); });

        var bisectRevenu = d3.bisector(function(d) { return d.Revenus; }).left;

        var calculateYbisect = function(previous_point, x_depart){

        var prevp = data_line[previous_point-1];
        var nextp = data_line[previous_point ];
        var diff_dep = x_depart - prevp.Revenus;
        var diff_point = nextp.Revenus - prevp.Revenus;
        var ratio = diff_dep / diff_point;
        var new_y = prevp.Impots + (nextp.Impots - prevp.Impots)*ratio;


        return new_y;
        };

        var div_tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);



        data_line.forEach(function(d){
        d.Revenus = +d.Revenus;
        d.Impots = +d.Impots;

        });

        x.domain(d3.extent(data_line, function(d) { return d.Revenus; }));
        y.domain(d3.extent(data_line, function(d) { return d.Impots; }));



        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);


        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Impots");

        svg.append("path")
          .datum(data_line)
          .attr("class", "line")
          .attr("d", function(d){return line(d)});



        svg.append("circle")
        .attr("r", 10)
        .attr("cx", x(x_depart))
        .attr("cy", y(calculateYbisect(bisectRevenu(data_line, x_depart), x_depart)));

        var x_brush = d3.scale.linear()
        .domain(d3.extent(data_line, function(d) { return d.Revenus; }))
        .range([0, width])
        .clamp(true);

        var svg_slider = d3.select($element.find("#slider")[0])
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', 50);



        svg_slider.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(10,20)")
        .call(d3.svg.axis()
        .scale(x_brush)
        .orient("bottom")
        .tickFormat(function(d) { return d; })
        .tickSize(0)
        .tickPadding(12))
        .select(".domain")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "halo");





        // slider
        //     .call(brush.event)
        //   .transition() // gratuitous intro!
        //     .duration(750)
        //     .call(brush.extent([70, 70]))
        //     .call(brush.event);





        var brush = d3.svg.brush()
        .x(x_brush)
        .extent([0, 0])
        .on("brush", brushed);

        var slider = svg_slider.append("g")
        .attr("transform", "translate(10,20)")
        .attr("height", 15)
        .attr("class", "slider")
        .call(brush);


        slider.selectAll(".extent,.resize")
        .remove();

        slider.select(".background")
        .attr("height", height);

        var handle = slider.append("circle")
        .attr("class", "handle")

        .attr("r", 9);





        function brushed() {
        var value = brush.extent()[0];

        if (d3.event.sourceEvent) { // not a programmatic event
        value = x_brush.invert(d3.mouse(this)[0]);
        brush.extent([value, value]);
        }

        handle.attr("cx", x_brush(value));

        var value_ = x_depart;

        value_ = Math.round(value);

        d3.select($element.find("#revenu_imposable")[0]).text(value_);

        svg.select("circle")
        .attr("cx", x(value_))
        .attr("cy", y(calculateYbisect(bisectRevenu(data_line, value_), value_)));


        }

    }

    angular
        .module('codeimpot.results')
        .directive('curveChart', ['d3Service', function (d3Service) {
            return {
                restrict: 'EA',
                scope: {},
                templateUrl: 'components/results/curvechart.template.html',
                link: function(scope, element, attrs) {
                    d3Service.d3().then(function (d3) {
                        var data_perso = [
                          {"impot":2421, "taux":3.36, "tranche":3, "taux_marginal":"30%"},
                          {"impot":2632, "taux":3.66, "tranche":4, "taux_marginal":"41%"}
                          ];

                        var x_depart = 40500;

                        var data_line = [{
                          "Revenus": 0,
                          "Impots": 0
                        }, {
                          "Revenus": 10000,
                          "Impots": 0
                        }, {
                          "Revenus": 20000,
                          "Impots": 0
                        }, {
                          "Revenus": 30000,
                          "Impots": 1000
                        }, {
                          "Revenus": 40000,
                          "Impots": 2000
                        }, {
                          "Revenus": 50000,
                          "Impots": 4000
                        }, {
                          "Revenus": 60000,
                          "Impots": 7000
                        }, {
                          "Revenus": 70000,
                          "Impots": 11000
                        }, {
                          "Revenus": 80000,
                          "Impots": 14000
                        }, {
                          "Revenus": 90000,
                          "Impots": 18000
                        }];

                        chart(d3, element, data_perso, data_line, x_depart);
                    });
                }
            };
        }]);
}());