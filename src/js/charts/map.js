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
    fill: '#fff',
    stroke: '#ccc',
    lineWidth: 1
  })
  if (spaceScale !== 'city' && spaceScale !== 'station') {
    var userDv = ds.createView().source(newData).transform({
      geoDataView: worldMap,
      field: 'address',
      type: 'geo.region',
      as: ['longitude', 'latitude']
    })
    var userView = chart.view()
    userView.source(userDv, {
      'value': {
        alias: 'PM2.5平均浓度值(微克/立方米)'
      },
      'address': {
        alias: '区域'
      }
    })
    userView.polygon()
      .position('longitude*latitude')
      .color('value', ['#2fc25b', '#f3072f'])
      .opacity('value')
      .tooltip('address*value')
      .animate({
        leave: {
          animation: 'fadeOut'
        }
      })
  }
  chart.legend({
    position: 'bottom-right', // 设置图例的显示位置
    offsetY: -20
  })
  chart.render()
  return chart
}
