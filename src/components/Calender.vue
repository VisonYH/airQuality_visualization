<style lang='less'>
.calender{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgb(255,255,255);
  z-index: 10000;
  #chart{
    width: 800px;
    margin: 0 auto;
  }
  .background {
    fill: #eee;
  }
  line {
    stroke: #fff;
  }
  text.active {
    fill: red;
  }
  .day {
    fill: #fff;
    stroke: #ccc;
  }
  .month {
    fill: none;
    stroke: #fff;
    stroke-width: 4px;
  }
  .year-title {
    font-size: 1.5em;
  }
  .RdYlGn .q0-11{fill:rgb(0, 228, 0)}
  .RdYlGn .q1-11{fill:rgb(255, 255, 0)}
  .RdYlGn .q2-11{fill:rgb(255, 126, 0)}
  .RdYlGn .q3-11{fill:rgb(255, 0, 0)}
  .RdYlGn .q4-11{fill:rgb(153, 0, 76)}
  .RdYlGn .q5-11{fill:rgb(126, 0, 35)}
  #tooltip {
    background:#cf9236;
    // border: 2px solid rgb(7, 17, 27);
    padding: 10px;
    color: rgb(0, 0, 0);
  }
}
</style>

<template>
  <div class='calender'>
    <div id='chart'></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import axios from 'axios'
import $ from 'jquery'
export default {
  name: 'Calender',
  props: {
  },
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
  },
  mounted () {
    var width = 960
    var height = 750
    var cellSize = 25
    var noMonthsInARow = Math.floor(width / (cellSize * 7 + 50))
    var shiftUp = cellSize * 3

    var day = d3.timeFormat('%w') // day of the week
    // var dayOfMonth = d3.timeFormat('%e') // day of the month
    // var day_of_year = d3.timeFormat('%j')
    var week = d3.timeFormat('%U') // week number of the year
    var month = d3.timeFormat('%m') // month number
    var year = d3.timeFormat('%Y')
    var percent = d3.format('.1%')
    var format = d3.timeFormat('%Y%m%d')

    // var color1 = d3.scaleQuantize().domain([-0.05, 0.05]).range(d3.range(11).map(function (d) { return 'q' + d + '-11' }))

    var color = d3.scaleThreshold().domain([50, 100, 150, 200, 300]).range(d3.range(6).map(function (d) { return 'q' + d + '-11' }))

    var svg = d3.select('#chart').selectAll('svg').data(d3.range(2015, 2018)).enter().append('svg').attr('width', width).attr('height', height).attr('class', 'RdYlGn').append('g')
    var rect = svg.selectAll('.day').data(function (d) {
      return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1))
    }).enter().append('rect').attr('class', 'day').attr('width', cellSize).attr('height', cellSize).attr('x', function (d) {
      var monthPadding = 1.2 * cellSize * 7 * ((month(d) - 1) % (noMonthsInARow))
      return day(d) * cellSize + monthPadding
    }).attr('y', function (d) {
      var weekDiff = week(d) - week(new Date(year(d), month(d) - 1, 1))
      var rowLevel = Math.ceil(month(d) / (noMonthsInARow))
      return (weekDiff * cellSize) + rowLevel * cellSize * 8 - cellSize / 2 - shiftUp
    }).datum(format)

    svg.selectAll('.month-title').data(function (d) {
      return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1))
    })
      .enter().append('text').text(monthTitle).attr('x', function (d, i) {
        var monthPadding = 1.2 * cellSize * 7 * ((month(d) - 1) % (noMonthsInARow))
        return monthPadding
      }).attr('y', function (d, i) {
        var weekDiff = week(d) - week(new Date(year(d), month(d) - 1, 1))
        var rowLevel = Math.ceil(month(d) / (noMonthsInARow))
        return (weekDiff * cellSize) + rowLevel * cellSize * 8 - cellSize - shiftUp
      }).attr('class', 'month-title').attr('d', monthTitle)

    svg.selectAll('.year-title').data(function (d) {
      return d3.timeYears(new Date(d, 0, 1), new Date(d + 1, 0, 1))
    }).enter().append('text').text(yearTitle).attr('x', function (d, i) { return width / 2 - 100 }).attr('y', function (d, i) { return cellSize * 5.5 - shiftUp }).attr('class', 'year-title').attr('d', yearTitle)

    var tooltip = d3.select('body').append('div').attr('id', 'tooltip').style('position', 'absolute').style('z-index', '500000').style('visibility', 'hidden').text('a simple tooltip')
    axios.get('http://localhost:8080/api/calender').then((res) => {
      let data = res.data
      rect.filter(function (d) { return d in data }).attr('class', function (d) {
        return 'day ' + color(data[d])
      }).select('title').text(function (d) { return d + ': ' + percent(data[d]) })

      //  Tooltip
      rect.on('mouseover', mouseover)
      rect.on('mouseout', mouseout)
      function mouseover (d) {
        tooltip.style('visibility', 'visible')
        var percentData = (data[d] !== undefined) ? parseInt(data[d]) : 0
        var purchaseText = d + ': ' + percentData
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9)
        tooltip.html(purchaseText)
          .style('left', (d3.event.pageX) + 30 + 'px')
          .style('top', (d3.event.pageY) + 'px')
      }
      function mouseout (d) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0)
        var $tooltip = $('#tooltip')
        $tooltip.empty()
      }
    })
    // function dayTitle (t0) {
    //   return t0.toString().split(' ')[2]
    // }
    function monthTitle (t0) {
      return t0.toLocaleString('en-us', { month: 'long' })
    }
    function yearTitle (t0) {
      return t0.toString().split(' ')[3]
    }
  }
}
</script>
