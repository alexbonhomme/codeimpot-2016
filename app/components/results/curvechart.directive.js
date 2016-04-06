(function () {

    /**
     * D3 drawing function
     * @param  {[type]} d3
     * @param  {[type]} $element
     * @param  {[type]} data_perso
     * @param  {[type]} data_line
     * @param  {[type]} x_depart
     */
     function chart(d3, $element, data_perso, data_line, x_depart, data_tranches) {




      var margin = {top: 50, right: 80, bottom: 30, left: 100};
      var width = 800 - margin.left - margin.right;
      var height = 650 - margin.top - margin.bottom;

      var margin_first_text = 0;
      var margin_last_text = 0;

      var width_graph = width - margin_first_text - margin_last_text;

      var svg = d3.select("#vis")
      .append("svg")
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var colorScale = d3.scale.category10();

      var colorScaleTranches = d3.scale.ordinal()
      .domain(["1","2","3","4","5"])
      .range(['#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c']);

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
      .tickFormat(d3.format("0f"))
      . tickValues([-4000, 0, 5000, 10000, 15000, 20000]);

      var line = d3.svg.line()
      .x(function(d) { return x(d.Revenus); })
      .y(function(d) { return y(d.Impots); });



      data_line.forEach(function(d, i){
        d.Revenus = i*400;
        d.Impots = -(+d.irpp);

      });

      max_val_revenus = d3.max(data_line, function(d) {return d.Revenus; });


      data_tranches = data_tranches.filter(function(d){ return d.start_value < max_val_revenus; });


      data_tranches.forEach(function(d){
        if (d.end_value >= max_val_revenus){d.end_value = max_val_revenus}
      });




      var bisectRevenu = d3.bisector(function(d) { return d.Revenus; }).left;
      var bisectTranches= d3.bisector(function(d) { return d.start_value; }).left;

      var calculateYbisect = function(previous_point, x_depart){

        if (previous_point  <= 0)
          {previous_point = 1;}

        var prevp = data_line[previous_point-1];
        var nextp = data_line[previous_point];
        var diff_dep = x_depart - prevp.Revenus;
        var diff_point = nextp.Revenus - prevp.Revenus;
        var ratio = diff_dep / diff_point;
        var new_y = prevp.Impots + (nextp.Impots - prevp.Impots)*ratio;


        return new_y;
      };

      var div_tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);





      x.domain(d3.extent(data_line, function(d) { return d.Revenus; }));
      y.domain(d3.extent(data_line, function(d) { return d.Impots; }));



      svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .style("text-anchor", "end")
      .text("Revenus")
      .attr("x", x(d3.max(data_line, function(d) { return d.Revenus; })) - 5)
      .attr("y", -10);


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

      var my_position = svg.append("g")
      .attr('transform', "translate(" + x(x_depart) + "," + y(calculateYbisect(bisectRevenu(data_line, x_depart), x_depart)) + ")")
      .attr("class", "my_position")
      ;

      my_position.append("circle")
      .attr("r", 10)
      .attr("cx", 0)
      .attr("cy", 0);

      my_position.append("text")
      .attr("x", -65)
      .attr("y", -38)
      .text("Votre imposition")
      ;

      svg.append("svg:defs")
      .append("svg:marker")
      .attr("id", "arrow")  
      .attr("refX", 2)
      .attr("refY", 6)
      .attr("markerWidth", 13)
      .attr("markerHeight", 13)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M2,2 L2,11 L10,6 L2,2")
      ;



      my_position.append("path")
      .attr("d", linkArc(-8, -0.5,-35, -22 ))
      .attr("class", "linked_arc")
      .style("marker-end", "url(#arrow)");


      svg.append("line")
      .attr("x1", x(0))
      .attr("y1", y(0))
      .attr("x2", x(d3.max(data_line, function(d) { return d.Revenus; })))
      .attr("y2", y(0))
      .attr("stroke", "black");

      svg_for_rect = svg.append("g")
      .attr('class', "tranches_rect")
      .selectAll('rect')
      .data(data_tranches);


      svg_rect_g_ = svg_for_rect
      .enter()
      .append("g")
      .attr("transform", function(c) { return "translate(" + x(c.start_value) + "," + y(d3.max(data_line, function(d) { return d.Impots; })) + ")"})
      ;



      svg_rect_g_
      .append("rect")
      .attr('class', 'rect_tranche')
      .attr("width", function(d) { return x(d.end_value) - x(d.start_value)})
      .attr('height', y(d3.min(data_line, function(d) { return d.Impots; })))
      .attr('opacity', 0.3)
      .attr("fill", function(d){ return colorScaleTranches(d.name)})
      .attr('rx', 7)
      .attr('ry', 7)
      ;

      svg_rect_g_
      .append('text')
      .text(function(d){ return "Tranche " + d.name})
      .attr("x", 2)
      .attr("y", 70);


      function linkArc(source_x, target_x, source_y, target_y) {
        var dx = target_x - source_x,
        dy = target_y - source_y,
        dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + source_x + "," + source_y + "A" + dr + "," + dr + " 0 0,1 " + target_x + "," + target_y;
      }


      var x_brush = d3.scale.linear()
      .domain(d3.extent(data_line, function(d) { return d.Revenus; }))
      .range([0, width])
      .clamp(true);

      var svg_slider = d3.select("#slider")
      .append("svg")
      .attr('width', width + margin.left + margin.right)
      .attr('height', 50)
      .style('margin-left', margin.left - 10);



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










      var brush = d3.svg.brush()
      .x(x_brush)
      .extent([40000, 40000])
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
  value_2 = Math.round(calculateYbisect(bisectRevenu(data_line, value_), value_));

  d3.select("#revenu_imposable").html("Revenu Imposable : <span>" + value_ + "€</span>");


  my_position
  .attr('transform', "translate(" + x(value_) + "," + y(calculateYbisect(bisectRevenu(data_line, value_), value_)) + ")")
  ;

  if (value_2 <0)
    {var si_negatif = " <span id='state_refund'>(    l'Etat rembourse "+ -value_2 + "€)</span>"}
  else {var si_negatif = ""}

    d3.select("#block1 #ir_by_year").html("Impot sur le revenu : <span>" + value_2 + "€</span>" + si_negatif);

  d3.select("#block1 #bymonth").html("Soit <span>" + Math.round(value_2/12) + "</span>€ /mois");

  d3.select("#block2 #ir_rate").html("Taux d'imposition moyen : <span>" + (Math.round(10000*value_2/value_))/100 + "%" + "</span>");

  var this_tranche = +bisectTranches(data_tranches, value_);

  d3.select("#block2 #tranche").html("Tranche : <span>" + this_tranche + "</span>");

  d3.selectAll("rect.rect_tranche").classed("rect_tranche_selected", false);
  d3.selectAll("rect.rect_tranche").filter(function(d,i) {return i == this_tranche -1 }).classed("rect_tranche_selected", true);

}


slider
.call(brush.event)
.transition()
.duration(0)
.call(brush.extent([x_depart, x_depart]))
.call(brush.event);


}

angular
.module('codeimpot.results')
.directive('curveChart', ['d3Service', 'ResultsService', function (d3Service, ResultsService) {
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

        var data_results = ResultsService.get();

        var x_depart = 82555;

        var nombre_parts = 3;
        var data_tranches_0 = [9700,26791, 71826, 152108];


        var data_tranches  =[
        {"name":"1", "start_value":0, "end_value":data_tranches_0[0]*nombre_parts},
        {"name":"2", "start_value":data_tranches_0[0]*nombre_parts, "end_value":data_tranches_0[1]*nombre_parts},
        {"name":"3", "start_value":data_tranches_0[1]*nombre_parts, "end_value":data_tranches_0[2]*nombre_parts},
        {"name":"4", "start_value":data_tranches_0[2]*nombre_parts, "end_value":data_tranches_0[3]*nombre_parts},
        {"name":"5", "start_value":data_tranches_0[3]*nombre_parts}
        ];



        var data_line = 
        [{"irpp":4300.0,"nbptr":3.0,"rni":0.0},{"irpp":4300.0,"nbptr":3.0,"rni":0.0},{"irpp":4300.0,"nbptr":3.0,"rni":376.0050048828},{"irpp":4300.0,"nbptr":3.0,"rni":777.0075683594},{"irpp":4300.0,"nbptr":3.0,"rni":1178.0100097656},{"irpp":4300.0,"nbptr":3.0,"rni":1579.0125732422},{"irpp":4300.0,"nbptr":3.0,"rni":1980.0151367188},{"irpp":4300.0,"nbptr":3.0,"rni":2381.017578125},{"irpp":4300.0,"nbptr":3.0,"rni":2782.0200195312},{"irpp":4300.0,"nbptr":3.0,"rni":3183.0224609375},{"irpp":4300.0,"nbptr":3.0,"rni":3584.0251464844},{"irpp":4300.0,"nbptr":3.0,"rni":3970.02734375},{"irpp":4300.0,"nbptr":3.0,"rni":4331.0302734375},{"irpp":4300.0,"nbptr":3.0,"rni":4692.0327148438},{"irpp":4300.0,"nbptr":3.0,"rni":5053.03515625},{"irpp":4300.0,"nbptr":3.0,"rni":5413.0375976562},{"irpp":4300.0,"nbptr":3.0,"rni":5774.0400390625},{"irpp":4300.0,"nbptr":3.0,"rni":6135.0424804688},{"irpp":4300.0,"nbptr":3.0,"rni":6496.044921875},{"irpp":4300.0,"nbptr":3.0,"rni":6857.0478515625},{"irpp":4300.0,"nbptr":3.0,"rni":7218.0502929688},{"irpp":4300.0,"nbptr":3.0,"rni":7579.052734375},{"irpp":4300.0,"nbptr":3.0,"rni":7940.0546875},{"irpp":4300.0,"nbptr":3.0,"rni":8301.0576171875},{"irpp":4300.0,"nbptr":3.0,"rni":8662.060546875},{"irpp":4300.0,"nbptr":3.0,"rni":9022.0625},{"irpp":4300.0,"nbptr":3.0,"rni":9383.0654296875},{"irpp":4300.0,"nbptr":3.0,"rni":9744.0673828125},{"irpp":4300.0,"nbptr":3.0,"rni":10105.0703125},{"irpp":4300.0,"nbptr":3.0,"rni":10466.072265625},{"irpp":4300.0,"nbptr":3.0,"rni":10827.0751953125},{"irpp":4300.0,"nbptr":3.0,"rni":11188.078125},{"irpp":4300.0,"nbptr":3.0,"rni":11549.080078125},{"irpp":4300.0,"nbptr":3.0,"rni":11910.0830078125},{"irpp":4300.0,"nbptr":3.0,"rni":12271.0849609375},{"irpp":4300.0,"nbptr":3.0,"rni":12631.087890625},{"irpp":4300.0,"nbptr":3.0,"rni":12992.08984375},{"irpp":4300.0,"nbptr":3.0,"rni":13353.0927734375},{"irpp":4300.0,"nbptr":3.0,"rni":13714.095703125},{"irpp":4300.0,"nbptr":3.0,"rni":14075.09765625},{"irpp":4300.0,"nbptr":3.0,"rni":14436.1005859375},{"irpp":4300.0,"nbptr":3.0,"rni":14797.103515625},{"irpp":4300.0,"nbptr":3.0,"rni":15158.10546875},{"irpp":4300.0,"nbptr":3.0,"rni":15519.107421875},{"irpp":4300.0,"nbptr":3.0,"rni":15880.109375},{"irpp":4300.0,"nbptr":3.0,"rni":16240.11328125},{"irpp":4300.0,"nbptr":3.0,"rni":16601.115234375},{"irpp":4300.0,"nbptr":3.0,"rni":16962.1171875},{"irpp":4300.0,"nbptr":3.0,"rni":17323.12109375},{"irpp":4300.0,"nbptr":3.0,"rni":17684.123046875},{"irpp":4300.0,"nbptr":3.0,"rni":18045.125},{"irpp":4300.0,"nbptr":3.0,"rni":18406.126953125},{"irpp":4300.0,"nbptr":3.0,"rni":18767.130859375},{"irpp":4300.0,"nbptr":3.0,"rni":19128.1328125},{"irpp":4300.0,"nbptr":3.0,"rni":19489.134765625},{"irpp":4300.0,"nbptr":3.0,"rni":19849.138671875},{"irpp":4300.0,"nbptr":3.0,"rni":20210.140625},{"irpp":4300.0,"nbptr":3.0,"rni":20571.142578125},{"irpp":4300.0,"nbptr":3.0,"rni":20932.14453125},{"irpp":4300.0,"nbptr":3.0,"rni":21293.1484375},{"irpp":4300.0,"nbptr":3.0,"rni":21654.150390625},{"irpp":4300.0,"nbptr":3.0,"rni":22015.15234375},{"irpp":4300.0,"nbptr":3.0,"rni":22376.15625},{"irpp":4300.0,"nbptr":3.0,"rni":22737.158203125},{"irpp":4300.0,"nbptr":3.0,"rni":23098.16015625},{"irpp":4300.0,"nbptr":3.0,"rni":23458.162109375},{"irpp":4300.0,"nbptr":3.0,"rni":23819.166015625},{"irpp":4300.0,"nbptr":3.0,"rni":24180.16796875},{"irpp":4300.0,"nbptr":3.0,"rni":24541.169921875},{"irpp":4300.0,"nbptr":3.0,"rni":24902.173828125},{"irpp":4300.0,"nbptr":3.0,"rni":25263.17578125},{"irpp":4300.0,"nbptr":3.0,"rni":25624.177734375},{"irpp":4300.0,"nbptr":3.0,"rni":25985.1796875},{"irpp":4300.0,"nbptr":3.0,"rni":26346.18359375},{"irpp":4300.0,"nbptr":3.0,"rni":26707.185546875},{"irpp":4300.0,"nbptr":3.0,"rni":27067.1875},{"irpp":4300.0,"nbptr":3.0,"rni":27428.19140625},{"irpp":4300.0,"nbptr":3.0,"rni":27789.193359375},{"irpp":4300.0,"nbptr":3.0,"rni":28150.1953125},{"irpp":4300.0,"nbptr":3.0,"rni":28511.197265625},{"irpp":4300.0,"nbptr":3.0,"rni":28872.201171875},{"irpp":4300.0,"nbptr":3.0,"rni":29233.203125},{"irpp":4300.0,"nbptr":3.0,"rni":29594.20703125},{"irpp":4300.0,"nbptr":3.0,"rni":29955.20703125},{"irpp":4300.0,"nbptr":3.0,"rni":30316.2109375},{"irpp":4300.0,"nbptr":3.0,"rni":30676.21484375},{"irpp":4300.0,"nbptr":3.0,"rni":31037.21484375},{"irpp":4300.0,"nbptr":3.0,"rni":31398.21875},{"irpp":4300.0,"nbptr":3.0,"rni":31759.21875},{"irpp":4300.0,"nbptr":3.0,"rni":32120.22265625},{"irpp":4300.0,"nbptr":3.0,"rni":32481.2265625},{"irpp":4300.0,"nbptr":3.0,"rni":32842.2265625},{"irpp":4300.0,"nbptr":3.0,"rni":33203.23046875},{"irpp":4300.0,"nbptr":3.0,"rni":33564.234375},{"irpp":4300.0,"nbptr":3.0,"rni":33925.234375},{"irpp":4300.0,"nbptr":3.0,"rni":34285.23828125},{"irpp":4300.0,"nbptr":3.0,"rni":34646.2421875},{"irpp":4300.0,"nbptr":3.0,"rni":35007.2421875},{"irpp":4300.0,"nbptr":3.0,"rni":35368.24609375},{"irpp":4300.0,"nbptr":3.0,"rni":35729.25},{"irpp":4300.0,"nbptr":3.0,"rni":36090.25},{"irpp":4300.0,"nbptr":3.0,"rni":36451.25390625},{"irpp":4300.0,"nbptr":3.0,"rni":36812.25390625},{"irpp":4300.0,"nbptr":3.0,"rni":37173.2578125},{"irpp":4300.0,"nbptr":3.0,"rni":37534.26171875},{"irpp":4300.0,"nbptr":3.0,"rni":37894.26171875},{"irpp":4300.0,"nbptr":3.0,"rni":38255.265625},{"irpp":4300.0,"nbptr":3.0,"rni":38616.26953125},{"irpp":4300.0,"nbptr":3.0,"rni":38977.26953125},{"irpp":4300.0,"nbptr":3.0,"rni":39338.2734375},{"irpp":4300.0,"nbptr":3.0,"rni":39699.27734375},{"irpp":4300.0,"nbptr":3.0,"rni":40060.27734375},{"irpp":4300.0,"nbptr":3.0,"rni":40421.28125},{"irpp":4300.0,"nbptr":3.0,"rni":40782.28515625},{"irpp":4300.0,"nbptr":3.0,"rni":41143.28515625},{"irpp":4300.0,"nbptr":3.0,"rni":41503.2890625},{"irpp":4300.0,"nbptr":3.0,"rni":41864.2890625},{"irpp":4274.3032226562,"nbptr":3.0,"rni":42225.29296875},{"irpp":4185.8569335938,"nbptr":3.0,"rni":42586.296875},{"irpp":4097.412109375,"nbptr":3.0,"rni":42947.296875},{"irpp":4008.9660644531,"nbptr":3.0,"rni":43308.30078125},{"irpp":3920.5205078125,"nbptr":3.0,"rni":43669.3046875},{"irpp":3832.0751953125,"nbptr":3.0,"rni":44030.3046875},{"irpp":3743.6298828125,"nbptr":3.0,"rni":44391.30859375},{"irpp":3655.18359375,"nbptr":3.0,"rni":44752.3125},{"irpp":3566.9836425781,"nbptr":3.0,"rni":45112.3125},{"irpp":3478.5373535156,"nbptr":3.0,"rni":45473.31640625},{"irpp":3390.0927734375,"nbptr":3.0,"rni":45834.31640625},{"irpp":3301.6462402344,"nbptr":3.0,"rni":46195.3203125},{"irpp":3213.2006835938,"nbptr":3.0,"rni":46556.32421875},{"irpp":3125.5744628906,"nbptr":3.0,"rni":46917.32421875},{"irpp":3075.0341796875,"nbptr":3.0,"rni":47278.328125},{"irpp":3024.4934082031,"nbptr":3.0,"rni":47639.33203125},{"irpp":2973.9536132812,"nbptr":3.0,"rni":48000.33203125},{"irpp":2923.4130859375,"nbptr":3.0,"rni":48361.3359375},{"irpp":2873.0124511719,"nbptr":3.0,"rni":48721.33984375},{"irpp":2822.4721679688,"nbptr":3.0,"rni":49082.33984375},{"irpp":2771.931640625,"nbptr":3.0,"rni":49443.34375},{"irpp":2721.3913574219,"nbptr":3.0,"rni":49804.34765625},{"irpp":2670.8510742188,"nbptr":3.0,"rni":50165.34765625},{"irpp":2620.3107910156,"nbptr":3.0,"rni":50526.3515625},{"irpp":2569.7705078125,"nbptr":3.0,"rni":50887.3515625},{"irpp":2519.2302246094,"nbptr":3.0,"rni":51248.35546875},{"irpp":2468.6899414062,"nbptr":3.0,"rni":51609.359375},{"irpp":2418.1496582031,"nbptr":3.0,"rni":51970.359375},{"irpp":2367.7487792969,"nbptr":3.0,"rni":52330.36328125},{"irpp":2317.2084960938,"nbptr":3.0,"rni":52691.3671875},{"irpp":2266.6682128906,"nbptr":3.0,"rni":53052.3671875},{"irpp":2216.1279296875,"nbptr":3.0,"rni":53413.37109375},{"irpp":2165.587890625,"nbptr":3.0,"rni":53774.375},{"irpp":2115.0476074219,"nbptr":3.0,"rni":54135.375},{"irpp":2064.5073242188,"nbptr":3.0,"rni":54496.37890625},{"irpp":2013.9660644531,"nbptr":3.0,"rni":54857.3828125},{"irpp":1963.4267578125,"nbptr":3.0,"rni":55218.3828125},{"irpp":1912.8854980469,"nbptr":3.0,"rni":55579.38671875},{"irpp":1862.4855957031,"nbptr":3.0,"rni":55939.38671875},{"irpp":1811.9453125,"nbptr":3.0,"rni":56300.390625},{"irpp":1761.4050292969,"nbptr":3.0,"rni":56661.39453125},{"irpp":1710.8647460938,"nbptr":3.0,"rni":57022.39453125},{"irpp":1660.3244628906,"nbptr":3.0,"rni":57383.3984375},{"irpp":1609.7834472656,"nbptr":3.0,"rni":57744.40234375},{"irpp":1559.2438964844,"nbptr":3.0,"rni":58105.40234375},{"irpp":1508.7026367188,"nbptr":3.0,"rni":58466.40625},{"irpp":1458.1625976562,"nbptr":3.0,"rni":58827.41015625},{"irpp":1407.6220703125,"nbptr":3.0,"rni":59188.4140625},{"irpp":1357.2221679688,"nbptr":3.0,"rni":59548.4140625},{"irpp":1306.6821289062,"nbptr":3.0,"rni":59909.4140625},{"irpp":1256.1411132812,"nbptr":3.0,"rni":60270.421875},{"irpp":1205.6005859375,"nbptr":3.0,"rni":60631.421875},{"irpp":1155.0610351562,"nbptr":3.0,"rni":60992.421875},{"irpp":1104.5200195312,"nbptr":3.0,"rni":61353.4296875},{"irpp":1053.9799804688,"nbptr":3.0,"rni":61714.4296875},{"irpp":1003.439453125,"nbptr":3.0,"rni":62075.4296875},{"irpp":952.8999023438,"nbptr":3.0,"rni":62436.4296875},{"irpp":902.3588867188,"nbptr":3.0,"rni":62797.4375},{"irpp":851.958984375,"nbptr":3.0,"rni":63157.4375},{"irpp":801.4189453125,"nbptr":3.0,"rni":63518.4375},{"irpp":750.8774414062,"nbptr":3.0,"rni":63879.4453125},{"irpp":652.986328125,"nbptr":3.0,"rni":64240.4453125},{"irpp":544.6865234375,"nbptr":3.0,"rni":64601.4453125},{"irpp":436.3837890625,"nbptr":3.0,"rni":64962.453125},{"irpp":328.083984375,"nbptr":3.0,"rni":65323.453125},{"irpp":219.7841796875,"nbptr":3.0,"rni":65684.453125},{"irpp":111.4814453125,"nbptr":3.0,"rni":66045.4609375},{"irpp":3.181640625,"nbptr":3.0,"rni":66406.4609375},{"irpp":-104.818359375,"nbptr":3.0,"rni":66766.4609375},{"irpp":-213.12109375,"nbptr":3.0,"rni":67127.46875},{"irpp":-321.4208984375,"nbptr":3.0,"rni":67488.46875},{"irpp":-429.720703125,"nbptr":3.0,"rni":67849.46875},{"irpp":-538.0234375,"nbptr":3.0,"rni":68210.4765625},{"irpp":-646.3232421875,"nbptr":3.0,"rni":68571.4765625},{"irpp":-754.623046875,"nbptr":3.0,"rni":68932.4765625},{"irpp":-862.92578125,"nbptr":3.0,"rni":69293.484375},{"irpp":-971.2255859375,"nbptr":3.0,"rni":69654.484375},{"irpp":-1079.525390625,"nbptr":3.0,"rni":70015.484375},{"irpp":-1187.52734375,"nbptr":3.0,"rni":70375.4921875},{"irpp":-1295.828125,"nbptr":3.0,"rni":70736.4921875},{"irpp":-1404.1279296875,"nbptr":3.0,"rni":71097.4921875},{"irpp":-1512.4296875,"nbptr":3.0,"rni":71458.5},{"irpp":-1620.73046875,"nbptr":3.0,"rni":71819.5},{"irpp":-1729.0302734375,"nbptr":3.0,"rni":72180.5},{"irpp":-1837.330078125,"nbptr":3.0,"rni":72541.5},{"irpp":-1945.6328125,"nbptr":3.0,"rni":72902.5078125},{"irpp":-2053.9326171875,"nbptr":3.0,"rni":73263.5078125},{"irpp":-2162.232421875,"nbptr":3.0,"rni":73624.5078125},{"irpp":-2270.234375,"nbptr":3.0,"rni":73984.515625},{"irpp":-2378.53515625,"nbptr":3.0,"rni":74345.515625},{"irpp":-2486.8349609375,"nbptr":3.0,"rni":74706.515625},{"irpp":-2595.13671875,"nbptr":3.0,"rni":75067.5234375},{"irpp":-2703.4375,"nbptr":3.0,"rni":75428.5234375},{"irpp":-2811.7373046875,"nbptr":3.0,"rni":75789.5234375},{"irpp":-2920.0390625,"nbptr":3.0,"rni":76150.53125},{"irpp":-3028.33984375,"nbptr":3.0,"rni":76511.53125},{"irpp":-3136.6396484375,"nbptr":3.0,"rni":76872.53125},{"irpp":-3244.94140625,"nbptr":3.0,"rni":77233.5390625},{"irpp":-3352.94140625,"nbptr":3.0,"rni":77593.5390625},{"irpp":-3461.2421875,"nbptr":3.0,"rni":77954.5390625},{"irpp":-3569.5439453125,"nbptr":3.0,"rni":78315.546875},{"irpp":-3677.84375,"nbptr":3.0,"rni":78676.546875},{"irpp":-3786.14453125,"nbptr":3.0,"rni":79037.546875},{"irpp":-3894.4462890625,"nbptr":3.0,"rni":79398.5546875},{"irpp":-4002.74609375,"nbptr":3.0,"rni":79759.5546875},{"irpp":-4111.046875,"nbptr":3.0,"rni":80120.5546875},{"irpp":-4219.3486328125,"nbptr":3.0,"rni":80481.5625},{"irpp":-4327.6484375,"nbptr":3.0,"rni":80842.5625},{"irpp":-4435.6484375,"nbptr":3.0,"rni":81202.5625},{"irpp":-4543.951171875,"nbptr":3.0,"rni":81563.5703125},{"irpp":-4652.2509765625,"nbptr":3.0,"rni":81924.5703125},{"irpp":-4760.55078125,"nbptr":3.0,"rni":82285.5703125},{"irpp":-4868.8515625,"nbptr":3.0,"rni":82646.5703125},{"irpp":-4977.1533203125,"nbptr":3.0,"rni":83007.578125},{"irpp":-5085.453125,"nbptr":3.0,"rni":83368.578125},{"irpp":-5193.75390625,"nbptr":3.0,"rni":83729.578125},{"irpp":-5302.0556640625,"nbptr":3.0,"rni":84090.5859375},{"irpp":-5410.35546875,"nbptr":3.0,"rni":84451.5859375},{"irpp":-5518.35546875,"nbptr":3.0,"rni":84811.5859375},{"irpp":-5626.658203125,"nbptr":3.0,"rni":85172.59375},{"irpp":-5734.9580078125,"nbptr":3.0,"rni":85533.59375},{"irpp":-5843.2578125,"nbptr":3.0,"rni":85894.59375},{"irpp":-5951.560546875,"nbptr":3.0,"rni":86255.6015625},{"irpp":-6059.8603515625,"nbptr":3.0,"rni":86616.6015625},{"irpp":-6168.16015625,"nbptr":3.0,"rni":86977.6015625},{"irpp":-6276.462890625,"nbptr":3.0,"rni":87338.609375},{"irpp":-6384.7626953125,"nbptr":3.0,"rni":87699.609375},{"irpp":-6493.0625,"nbptr":3.0,"rni":88060.609375},{"irpp":-6601.0654296875,"nbptr":3.0,"rni":88420.6171875},{"irpp":-6709.365234375,"nbptr":3.0,"rni":88781.6171875},{"irpp":-6817.6650390625,"nbptr":3.0,"rni":89142.6171875},{"irpp":-6925.9677734375,"nbptr":3.0,"rni":89503.625},{"irpp":-7034.267578125,"nbptr":3.0,"rni":89864.625},{"irpp":-7142.5673828125,"nbptr":3.0,"rni":90225.625},{"irpp":-7250.8701171875,"nbptr":3.0,"rni":90586.6328125},{"irpp":-7359.169921875,"nbptr":3.0,"rni":90947.6328125},{"irpp":-7467.4697265625,"nbptr":3.0,"rni":91308.6328125},{"irpp":-7575.76953125,"nbptr":3.0,"rni":91669.6328125},{"irpp":-7683.7724609375,"nbptr":3.0,"rni":92029.640625},{"irpp":-7792.072265625,"nbptr":3.0,"rni":92390.640625},{"irpp":-7900.373046875,"nbptr":3.0,"rni":92751.640625},{"irpp":-8008.673828125,"nbptr":3.0,"rni":93112.6484375},{"irpp":-8116.974609375,"nbptr":3.0,"rni":93473.6484375},{"irpp":-8225.275390625,"nbptr":3.0,"rni":93834.6484375},{"irpp":-8333.576171875,"nbptr":3.0,"rni":94195.65625},{"irpp":-8441.876953125,"nbptr":3.0,"rni":94556.65625},{"irpp":-8550.177734375,"nbptr":3.0,"rni":94917.65625},{"irpp":-8658.478515625,"nbptr":3.0,"rni":95278.6640625},{"irpp":-8766.478515625,"nbptr":3.0,"rni":95638.6640625},{"irpp":-8874.779296875,"nbptr":3.0,"rni":95999.6640625},{"irpp":-8983.08203125,"nbptr":3.0,"rni":96360.671875},{"irpp":-9091.380859375,"nbptr":3.0,"rni":96721.671875},{"irpp":-9199.681640625,"nbptr":3.0,"rni":97082.671875},{"irpp":-9307.984375,"nbptr":3.0,"rni":97443.6796875},{"irpp":-9416.283203125,"nbptr":3.0,"rni":97804.6796875},{"irpp":-9524.583984375,"nbptr":3.0,"rni":98165.6796875},{"irpp":-9632.88671875,"nbptr":3.0,"rni":98526.6875},{"irpp":-9741.185546875,"nbptr":3.0,"rni":98887.6875},{"irpp":-9849.185546875,"nbptr":3.0,"rni":99247.6875},{"irpp":-9957.48828125,"nbptr":3.0,"rni":99608.6953125},{"irpp":-10065.7890625,"nbptr":3.0,"rni":99969.6953125},{"irpp":-10174.087890625,"nbptr":3.0,"rni":100330.6953125},{"irpp":-10282.390625,"nbptr":3.0,"rni":100691.703125},{"irpp":-10390.69140625,"nbptr":3.0,"rni":101052.703125},{"irpp":-10498.990234375,"nbptr":3.0,"rni":101413.703125},{"irpp":-10607.291015625,"nbptr":3.0,"rni":101774.703125},{"irpp":-10715.59375,"nbptr":3.0,"rni":102135.7109375},{"irpp":-10823.892578125,"nbptr":3.0,"rni":102496.7109375},{"irpp":-10931.892578125,"nbptr":3.0,"rni":102856.7109375},{"irpp":-11040.1953125,"nbptr":3.0,"rni":103217.71875},{"irpp":-11148.49609375,"nbptr":3.0,"rni":103578.71875},{"irpp":-11256.794921875,"nbptr":3.0,"rni":103939.71875},{"irpp":-11365.09765625,"nbptr":3.0,"rni":104300.7265625},{"irpp":-11473.3984375,"nbptr":3.0,"rni":104661.7265625},{"irpp":-11581.697265625,"nbptr":3.0,"rni":105022.7265625},{"irpp":-11690.0,"nbptr":3.0,"rni":105383.734375},{"irpp":-11798.30078125,"nbptr":3.0,"rni":105744.734375},{"irpp":-11906.599609375,"nbptr":3.0,"rni":106105.734375},{"irpp":-12014.603515625,"nbptr":3.0,"rni":106465.7421875},{"irpp":-12122.90234375,"nbptr":3.0,"rni":106826.7421875},{"irpp":-12231.203125,"nbptr":3.0,"rni":107187.7421875},{"irpp":-12339.505859375,"nbptr":3.0,"rni":107548.75},{"irpp":-12447.8046875,"nbptr":3.0,"rni":107909.75},{"irpp":-12556.10546875,"nbptr":3.0,"rni":108270.75},{"irpp":-12664.408203125,"nbptr":3.0,"rni":108631.7578125},{"irpp":-12772.70703125,"nbptr":3.0,"rni":108992.7578125},{"irpp":-12881.0078125,"nbptr":3.0,"rni":109353.7578125},{"irpp":-12995.310546875,"nbptr":3.0,"rni":109734.765625},{"irpp":-13115.609375,"nbptr":3.0,"rni":110135.765625},{"irpp":-13235.91015625,"nbptr":3.0,"rni":110536.765625},{"irpp":-13356.208984375,"nbptr":3.0,"rni":110937.765625},{"irpp":-13476.51171875,"nbptr":3.0,"rni":111338.7734375},{"irpp":-13596.8125,"nbptr":3.0,"rni":111739.7734375},{"irpp":-13717.111328125,"nbptr":3.0,"rni":112140.7734375},{"irpp":-13837.4140625,"nbptr":3.0,"rni":112541.78125},{"irpp":-13957.71484375,"nbptr":3.0,"rni":112942.78125},{"irpp":-14078.013671875,"nbptr":3.0,"rni":113343.78125},{"irpp":-14198.31640625,"nbptr":3.0,"rni":113744.7890625},{"irpp":-14318.6171875,"nbptr":3.0,"rni":114145.7890625},{"irpp":-14438.916015625,"nbptr":3.0,"rni":114546.7890625},{"irpp":-14559.21875,"nbptr":3.0,"rni":114947.796875},{"irpp":-14679.51953125,"nbptr":3.0,"rni":115348.796875},{"irpp":-14799.818359375,"nbptr":3.0,"rni":115749.796875},{"irpp":-14920.12109375,"nbptr":3.0,"rni":116150.8046875},{"irpp":-15040.421875,"nbptr":3.0,"rni":116551.8046875},{"irpp":-15160.720703125,"nbptr":3.0,"rni":116952.8046875},{"irpp":-15281.0234375,"nbptr":3.0,"rni":117353.8125},{"irpp":-15401.32421875,"nbptr":3.0,"rni":117754.8125},{"irpp":-15521.623046875,"nbptr":3.0,"rni":118155.8125},{"irpp":-15641.92578125,"nbptr":3.0,"rni":118556.8203125},{"irpp":-15762.224609375,"nbptr":3.0,"rni":118957.8125},{"irpp":-15882.529296875,"nbptr":3.0,"rni":119358.828125},{"irpp":-16002.828125,"nbptr":3.0,"rni":119759.828125},{"irpp":-16123.12890625,"nbptr":3.0,"rni":120160.828125},{"irpp":-16243.427734375,"nbptr":3.0,"rni":120561.828125},{"irpp":-16363.728515625,"nbptr":3.0,"rni":120962.828125},{"irpp":-16484.029296875,"nbptr":3.0,"rni":121363.828125},{"irpp":-16604.333984375,"nbptr":3.0,"rni":121764.84375},{"irpp":-16724.6328125,"nbptr":3.0,"rni":122165.84375},{"irpp":-16844.93359375,"nbptr":3.0,"rni":122566.84375},{"irpp":-16965.232421875,"nbptr":3.0,"rni":122967.84375},{"irpp":-17085.533203125,"nbptr":3.0,"rni":123368.84375},{"irpp":-17205.833984375,"nbptr":3.0,"rni":123769.84375},{"irpp":-17326.138671875,"nbptr":3.0,"rni":124170.859375},{"irpp":-17446.4375,"nbptr":3.0,"rni":124571.859375},{"irpp":-17566.73828125,"nbptr":3.0,"rni":124972.859375},{"irpp":-17687.037109375,"nbptr":3.0,"rni":125373.859375},{"irpp":-17807.337890625,"nbptr":3.0,"rni":125774.859375},{"irpp":-17927.638671875,"nbptr":3.0,"rni":126175.859375},{"irpp":-18047.9375,"nbptr":3.0,"rni":126576.859375},{"irpp":-18168.2421875,"nbptr":3.0,"rni":126977.875},{"irpp":-18288.54296875,"nbptr":3.0,"rni":127378.875},{"irpp":-18408.841796875,"nbptr":3.0,"rni":127779.875},{"irpp":-18529.142578125,"nbptr":3.0,"rni":128180.875},{"irpp":-18649.443359375,"nbptr":3.0,"rni":128581.875},{"irpp":-18769.7421875,"nbptr":3.0,"rni":128982.875},{"irpp":-18890.046875,"nbptr":3.0,"rni":129383.890625},{"irpp":-19010.34765625,"nbptr":3.0,"rni":129784.890625},{"irpp":-19130.646484375,"nbptr":3.0,"rni":130185.890625},{"irpp":-19250.947265625,"nbptr":3.0,"rni":130586.890625},{"irpp":-19371.248046875,"nbptr":3.0,"rni":130987.890625},{"irpp":-19491.546875,"nbptr":3.0,"rni":131388.890625},{"irpp":-19611.8515625,"nbptr":3.0,"rni":131789.90625},{"irpp":-19732.15234375,"nbptr":3.0,"rni":132190.90625},{"irpp":-19852.451171875,"nbptr":3.0,"rni":132591.90625},{"irpp":-19972.751953125,"nbptr":3.0,"rni":132992.90625},{"irpp":-20093.052734375,"nbptr":3.0,"rni":133393.90625},{"irpp":-20213.3515625,"nbptr":3.0,"rni":133794.90625},{"irpp":-20333.65625,"nbptr":3.0,"rni":134195.921875},{"irpp":-20453.95703125,"nbptr":3.0,"rni":134596.921875},{"irpp":-20574.255859375,"nbptr":3.0,"rni":134997.921875},{"irpp":-20694.556640625,"nbptr":3.0,"rni":135398.921875},{"irpp":-20814.857421875,"nbptr":3.0,"rni":135799.921875},{"irpp":-20935.15625,"nbptr":3.0,"rni":136200.921875},{"irpp":-21055.4609375,"nbptr":3.0,"rni":136601.9375},{"irpp":-21175.76171875,"nbptr":3.0,"rni":137002.9375},{"irpp":-21296.060546875,"nbptr":3.0,"rni":137403.9375},{"irpp":-21416.361328125,"nbptr":3.0,"rni":137804.9375},{"irpp":-21536.662109375,"nbptr":3.0,"rni":138205.9375},{"irpp":-21656.9609375,"nbptr":3.0,"rni":138606.9375},{"irpp":-21777.26171875,"nbptr":3.0,"rni":139007.9375},{"irpp":-21897.56640625,"nbptr":3.0,"rni":139408.953125},{"irpp":-22017.865234375,"nbptr":3.0,"rni":139809.953125},{"irpp":-22138.166015625,"nbptr":3.0,"rni":140210.953125},{"irpp":-22258.466796875,"nbptr":3.0,"rni":140611.953125},{"irpp":-22378.765625,"nbptr":3.0,"rni":141012.953125},{"irpp":-22499.06640625,"nbptr":3.0,"rni":141413.953125},{"irpp":-22619.37109375,"nbptr":3.0,"rni":141814.96875},{"irpp":-22739.669921875,"nbptr":3.0,"rni":142215.96875},{"irpp":-22859.970703125,"nbptr":3.0,"rni":142616.96875},{"irpp":-22980.271484375,"nbptr":3.0,"rni":143017.96875},{"irpp":-23100.5703125,"nbptr":3.0,"rni":143418.96875},{"irpp":-23239.34765625,"nbptr":3.0,"rni":143819.96875},{"irpp":-23403.763671875,"nbptr":3.0,"rni":144220.984375},{"irpp":-23568.173828125,"nbptr":3.0,"rni":144621.984375},{"irpp":-23732.583984375,"nbptr":3.0,"rni":145022.984375},{"irpp":-23896.994140625,"nbptr":3.0,"rni":145423.984375},{"irpp":-24061.404296875,"nbptr":3.0,"rni":145824.984375},{"irpp":-24225.8125,"nbptr":3.0,"rni":146225.984375},{"irpp":-24390.23046875,"nbptr":3.0,"rni":146627.0},{"irpp":-24554.640625,"nbptr":3.0,"rni":147028.0},{"irpp":-24719.05078125,"nbptr":3.0,"rni":147429.0},{"irpp":-24883.4609375,"nbptr":3.0,"rni":147830.0}];

        chart(d3, element, data_perso, data_line, x_depart, data_tranches);
      });
}
};
}]);
}());