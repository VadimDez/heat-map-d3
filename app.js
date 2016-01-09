/**
 * Created by vadimdez on 09/01/16.
 */
(function () {
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  d3.json(url, function (data) {
    drawChart(data.monthlyVariance);
  });

  function drawChart(data) {
    var width = 960;
    var height = 500;
    var $chart = d3.select('.chart')
      .attr('height', height)
      .attr('width', width);
    var $tooltip = d3.select('.tooltip');

    // x scale
    function getYear(array) {
      return array.year;
    }
    var xScale = d3.scale.linear()
      .range([0, width])
      .domain([d3.min(data, getYear), d3.max(data, getYear)]);

    // y scale
    function getMonth(array) {
      return array.month;
    }
    var yScale = d3.scale.linear()
      .range([0, height])
      .domain([d3.min(data, getMonth), d3.max(data, getMonth)]);

    // add data
    var $point = $chart.selectAll('.point')
      .data(data);

    // append points
    $point.enter()
      .append('rect')
      .attr('class', 'point')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', function (d) {
        return xScale(d.year);
      })
      .attr('y', function (d) {
        return yScale(d.month);
      })
      .on('mouseover', function () {
        return $tooltip.classed('active', true);
      })
      .on('mousemove', function (d) {
        $tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', event.pageY + 'px')
          .text(JSON.stringify(d));
        return d3.select(this).classed('active', true);
      })
      .on('mouseleave', function () {
        d3.select(this).classed('active', false);
        return $tooltip.classed('active', false);
      });
  }
}());