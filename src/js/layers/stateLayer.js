import bbox from '@turf/bbox'
import axios from 'axios'
export function addStateLayer (map, spaceScale, address) {
  let url
  // console.log(spaceScale, address)
  if (spaceScale === 'all' || !spaceScale) {
    url = 'http://localhost:8080/static/china.geojson'
  } else {
    url = `http://localhost:8080/api/quhua/${spaceScale}/${address}`
  }
  axios.get(url).then(res => {
    map.fitBounds(bbox(res.data), {
      padding: {
        top: 50,
        bottom: 50,
        left: 200,
        right: 50
      }
    })
    map.addSource('stateResource', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': res.data.features
      }
    })
    map.addLayer({
      'id': 'state',
      'type': 'fill',
      'source': 'stateResource',
      'layout': {},
      'paint': {
        // 'fill-color': '#DDDDDD',
        'fill-opacity': 1,
        'fill-outline-color': 'rgba(255, 205, 50, 0.5)'
      }
    })
  })
}

export function removeStateLayer (map) {
  map.removeLayer('state')
  map.removeSource('stateResource')
}
