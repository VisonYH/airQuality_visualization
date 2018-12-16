import getCountryData from '../api/getCountryData'
import G2 from '@antv/g2'
import { DataSet } from '@antv/data-set'

export default async function (newData, dom, spaceScale, address) {
  let geojsonData = (await getCountryData(spaceScale, address)).data
  var chart = new G2.Chart({
    container: dom,
    forceFit: true,
    padding: [55, 20]
  })
  chart.tooltip({
    showTitle: false
  })
  // 同步度量
  chart.scale({
    longitude: {
      sync: true
    },
    latitude: {
      sync: true
    }
  })
  chart.axis(false)
  // 绘制世界地图背景
  var ds = new DataSet()
  var worldMap = ds.createView('back').source(geojsonData, {
    type: 'GeoJSON'
  })
  var worldMapView = chart.view()
  worldMapView.source(worldMap)
  worldMapView.tooltip(false)
  worldMapView.polygon().position('longitude*latitude').style({
    fill: '#DDDDDD',
    stroke: '#b1b1b1',
    lineWidth: 0.5,
    fillOpacity: 0.85
  })
  // newData = toGeojson(newData)
  var airView = chart.view()
  newData.forEach(item => {
    item.latitude = parseFloat(item.lat)
    item.longitude = parseFloat(item.lon)
  })
  console.log(newData)
  airView.source(newData)
  airView.point().position('longitude*latitude').color('value').shape('circle').style({
    stroke: '#eee',
    lineWidth: 1
  }).size('value', [3, 10]).tooltip('address*value*latitude*longitude')
  chart.legend({
    position: 'bottom-right', // 设置图例的显示位置
    offsetY: -20
  })
  chart.render()
  return chart
}
