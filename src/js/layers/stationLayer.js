import mapboxgl from 'mapbox-gl'
import getStation from '../api/getStation'
import axios from 'axios'
export function addStationLayer (map, scaleArr, scale, type) {
  getStation(callback, scaleArr, scale)
  type = type.toLowerCase() || 'aqi'
  async function callback (res) {
    let fc = await axios.get('http://localhost:8080/api/realtime')
    fc = fc.data
    let fcObj = {}
    fc.forEach(item => {
      fcObj[item.station_code] = item
    })
    res.data.features.forEach(item => {
      item.properties[type] = fcObj[item.properties.stationId][type.toLowerCase().replace('.', '_')]
    })
    console.log(res.data)
    map.addSource('station', {
      type: 'geojson',
      data: res.data
    })
    map.addLayer({
      'id': 'station',
      'type': 'circle',
      'source': 'station',
      'paint': {
        'circle-radius': 5,
        // 'rgb(0, 228, 0)', 'rgb(255, 255, 0)', 'rgb(255, 126, 0)', 'rgb(255, 0, 0)', 'rgb(153, 0, 76)', 'rgb(126, 0, 35)'
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', type],
          0,
          'rgb(0, 228, 0)',
          50,
          'rgb(255, 255, 0)',
          100,
          'rgb(255, 126, 0)',
          150,
          'rgb(255, 0, 0)',
          200,
          'rgb(153, 0, 76)',
          300,
          'rgb(126, 0, 35)'
        ]
      }
    })
    // console.log(map.getLayer('station'))
    map.on('click', 'station', function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice()
      var name = e.features[0].properties.stationName
      var city = e.features[0].properties.city

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(city + ': ' + name + '<br>' + type.toUpperCase() + ': ' + e.features[0].properties[type])
        .addTo(map)
    })
    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'station', function () {
      map.getCanvas().style.cursor = 'pointer'
    })
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'station', function () {
      map.getCanvas().style.cursor = ''
    })
  }
}

export function removeStationLayer (map) {
  if (map.getLayer('station')) {
    map.removeLayer('station')
    map.removeSource('station')
  }
}
