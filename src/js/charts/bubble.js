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

// function toGeojson (data) {
//   let geojson = {
//     'type': 'FeatureCollection',
//     'features': []
//   }
//   data.forEach(item => {
//     let {value, address} = item
//     let feature = {
//       'type': 'Feature',
//       'geometry': {
//         'type': 'Point',
//         'coordinates': [item.lon, item.lat]
//       },
//       'properties': {
//         value,
//         address
//       }
//     }
//     geojson.features.push(feature)
//   })
//   return geojson
// }
// import mapboxgl from 'mapbox-gl'
// export async function bubbleChart (newData, dom, spaceScale, address) {
//   let geojsonData = (await getCountryData(spaceScale, address)).data
//   let map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/dark-v9',
//     center: [105.42593433611171, 33.827886548745695],
//     zoom: 2.5
//   })

//   map.addSource('station', {
//     type: 'geojson',
//     data: geojsonData
//   })
//   map.addLayer({
//     'id': 'station',
//     'type': 'circle',
//     'source': 'station',
//     'paint': {
//       'circle-radius': 3,
//       'circle-color': '#B42222'
//     }
//   })
//   map.on('click', 'station', function (e) {
//     var coordinates = e.features[0].geometry.coordinates.slice()
//     var name = e.features[0].properties.stationName
//     var city = e.features[0].properties.city

//     // Ensure that if the map is zoomed out such that multiple
//     // copies of the feature are visible, the popup appears
//     // over the copy being pointed to.
//     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//       coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
//     }
//     new mapboxgl.Popup()
//       .setLngLat(coordinates)
//       .setHTML(city + ': ' + name)
//       .addTo(map)
//   })
//   // Change the cursor to a pointer when the mouse is over the places layer.
//   map.on('mouseenter', 'station', function () {
//     map.getCanvas().style.cursor = 'pointer'
//   })
//   // Change it back to a pointer when it leaves.
//   map.on('mouseleave', 'station', function () {
//     map.getCanvas().style.cursor = ''
//   })
// }
