import mapboxgl from 'mapbox-gl'
import getStation from '../api/getStation'
export function addStationLayer (map, scaleArr, scale) {
  getStation(callback, scaleArr, scale)

  function callback (res) {
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
        'circle-color': '#B42222'
      }
    })
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
        .setHTML(city + ': ' + name)
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
