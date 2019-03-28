import * as d3 from 'd3'
import Circos from 'circos'
import axios from 'axios'
export default class HeatCirlce {
  constructor (dom, type, space) {
    console.log(`http://localhost:3000/calender?type=${type}`)
    axios.get(`http://localhost:3000/calender?type=${type}&space=${space}`).then((data) => {
      let obj = {}
      data = data.data
      console.log('data', data)
      for (let item in data) {
        let reg = /^(\d{4})\d+/
        let year = reg.exec(item)[1]
        if (obj['y' + year] === undefined) {
          obj['y' + year] = []
        }
        let end = item[6] + item[7]
        obj['y' + year].push({
          start: parseInt(end) - 1,
          end: parseInt(end),
          block_id: item[4] + item[5],
          value: data[item]
        })
      }
      this.drawCircos(dom, obj)
    })
  }
  drawCircos (dom, data) {
    var width = 300
    var circosHeatmap = new Circos({
      container: dom,
      width: width,
      height: width
    })
    let months = [
      { 'len': 31, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Jan', 'id': '01' },
      { 'len': 28, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Feb', 'id': '02' },
      { 'len': 31, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Mar', 'id': '03' },
      { 'len': 30, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Apr', 'id': '04' },
      { 'len': 31, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'May', 'id': '05' },
      { 'len': 30, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Jun', 'id': '06' },
      { 'len': 31, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Jul', 'id': '07' },
      { 'len': 31, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Aug', 'id': '08' },
      { 'len': 30, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Sep', 'id': '09' },
      { 'len': 31, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Oct', 'id': '10' },
      { 'len': 30, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Nov', 'id': '11' },
      { 'len': 31, 'color': 'rgba(0, 0, 0, 0.7)', 'label': 'Dec', 'id': '12' }
    ]
    circosHeatmap
      .layout(
        months, {
          innerRadius: width / 2 - 20,
          outerRadius: width / 2,
          cornerRadius: 3,
          ticks: {display: false},
          labels: {
            position: 'center',
            display: true,
            size: 12,
            color: '#fff',
            radialOffset: 6
          }
        }
      )
      .heatmap('y2017ssss', data['y2017'], {
        innerRadius: 0.8,
        outerRadius: 0.98,
        logScale: false,
        color: function (datum, index) {
          let color = d3.scaleThreshold().domain([50, 100, 150, 200, 300]).range(['rgb(0, 228, 0)', 'rgb(255, 255, 0)', 'rgb(255, 126, 0)', 'rgb(255, 0, 0)', 'rgb(153, 0, 76)', 'rgb(126, 0, 35)'])
          return color(datum.value)
        },
        events: {
          // 'mouseover.demo': function (d, i, nodes, event) {
          //   console.log('electricalConsumption', d, i, nodes, event)
          // }
        }
      })
      .heatmap('y2016czxczx', data['y2016'], {
        innerRadius: 0.6,
        outerRadius: 0.79,
        logScale: false,
        color: function (datum, index) {
          let color = d3.scaleThreshold().domain([50, 100, 150, 200, 300]).range(['rgb(0, 228, 0)', 'rgb(255, 255, 0)', 'rgb(255, 126, 0)', 'rgb(255, 0, 0)', 'rgb(153, 0, 76)', 'rgb(126, 0, 35)'])
          return color(datum.value)
        },
        events: {
          // 'mouseover.demo': function (d, i, nodes, event) {
          //   console.log('electricalConsumption', d, i, nodes, event)
          // }
        }
      })
      .heatmap('y2015czxc', data['y2015'], {
        innerRadius: 0.4,
        outerRadius: 0.59,
        logScale: false,
        color: function (datum, index) {
          let color = d3.scaleThreshold().domain([50, 100, 150, 200, 300]).range(['rgb(0, 228, 0)', 'rgb(255, 255, 0)', 'rgb(255, 126, 0)', 'rgb(255, 0, 0)', 'rgb(153, 0, 76)', 'rgb(126, 0, 35)'])
          return color(datum.value)
        },
        events: {
          // 'mouseover.demo': function (d, i, nodes, event) {
          //   console.log('electricalConsumption', d, i, nodes, event)
          // }
        }
      })
      .render()
  }
}
