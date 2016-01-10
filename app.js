/**
 * Created by vadimdez on 09/01/16.
 */
(function () {
  var colorScale;
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  d3.json(url, function (data) {
    drawChart(data);
  });

  function drawChart(data) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var margins = {
      top: 5,
      right: -15,
      bottom: 0,
      left: 55
    };
    var containerWidth = 1200;
    var containerHeight = 180;
    var width = containerWidth - margins.left - margins.right;
    var height = containerHeight - margins.top - margins.bottom;
    var $chart = d3.select('.chart')
      .attr('height', height)
      .attr('width', width)
      .append('g')
      .attr('transform', 'translate(' + margins.left + ',' + margins.top +')');

    var $tooltip = d3.select('.tooltip');

    // x scale
    var minYear = d3.min(data.monthlyVariance, getYear);
    var maxYear = d3.max(data.monthlyVariance, getYear);
    var xScale = d3.scale.linear()
      .range([5, width - 60])
      .domain([minYear, maxYear]);

    // x axis
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .tickFormat(function (d) {
        return d;
      });

    $chart.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + (height - 40) + ')')
      .call(xAxis);

    // y scale
    function getMonth(array) {
      return array.month;
    }
    var yScale = d3.scale.linear()
      .range([0, 120]) // 120 = 10px height * 12 month
      .domain([d3.min(data.monthlyVariance, getMonth), d3.max(data.monthlyVariance, getMonth)]);

    // y axis
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .tickFormat(function (d) {
        return monthNames[d - 1];
      });

    $chart.append('g')
      .attr('class', 'axis y-axis')
      .attr('transform', 'translate(10,5)')
      .call(yAxis);

    setColorScale(data);

    var pointWidth = width / (maxYear - minYear);

    // add data
    var $point = $chart.selectAll('.point')
      .data(data.monthlyVariance);

    // append points
    $point.enter()
      .append('rect')
      .attr('class', 'point')
      .attr('width', pointWidth)
      .attr('height', 11)
      .style('fill', function (d) {
        return colorScale(data.baseTemperature + d.variance);
      })
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
        // set tooltip
        $tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', event.pageY + 'px');

        $tooltip.select('.year')
          .text(d.year);
        $tooltip.select('.month')
          .text(monthNames[d.month - 1]);
        $tooltip.select('.temperature .value')
          .text((data.baseTemperature + d.variance).toFixed(3));
        $tooltip.select('.temperature_variance .value')
          .text(d.variance);

        return d3.select(this).classed('active', true);
      })
      .on('mouseleave', function () {
        d3.select(this).classed('active', false);
        return $tooltip.classed('active', false);
      });

    drawColorsChart(height);
  }

  function getYear(array) {
    return array.year;
  }

  function setColorScale(data) {
    function getTemperature(array) {
      return data.baseTemperature + array.variance;
    }

    var minTemperature = d3.min(data.monthlyVariance, getTemperature);
    //if (minTemperature > 0) {
    //  minTemperature = 0;
    //}

    colorScale = d3.scale.quantile()
      .domain([minTemperature, d3.max(data.monthlyVariance, getTemperature)])
      .range(["#081d58", "#253494", "#225ea8", "#1d91c0", "#41b6c4", "#7fcdbb", "#c7e9b4", "#edf8b1", "#ffffd9", "#f8d6b1", "#f8c2b1", "#fc7878", "#ff3636"]);
  }

  function drawColorsChart(height) {
    var colorsData = colorScale.quantiles();
    var widthColorBlock = 40;
    var $colorsLegend = d3.select('.colors-legend')
      .attr('x', 200)
      .attr('y', height + 20)
      .attr('width', colorsData.length * widthColorBlock)
      .attr('height', 30);

    var $colors = $colorsLegend.selectAll('.color')
      .data(colorsData);

    var $colorGroup = $colors.enter()
      .append('g')
      .attr('class', 'color')
      .attr('width', widthColorBlock)
      .attr('transform', function (d, i) {
        return 'translate(' + i * widthColorBlock + ',0)';
      });

    // add colored rect
    $colorGroup
      .append('rect')
      .attr('width', widthColorBlock)
      .attr('height', 10)
      .attr('fill', function (d) {
        return colorScale(d);
      });

    // add text
    $colorGroup
      .append('text')
      .attr('x', 3)
      .attr('y', 20)
      .text(function (d) {
        return '≥ ' + d.toFixed(2);
      });
  }
}());