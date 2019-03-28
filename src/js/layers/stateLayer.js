import bbox from '@turf/bbox'
import axios from 'axios'
export function addStateLayer (map, spaceScale, address) {
  let url
  // let hoveredStateId = null
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
      },
      'generateId': true
    })
    map.addLayer({
      'id': 'state',
      'type': 'fill',
      'source': 'stateResource',
      'layout': {},
      'paint': {
        // 'fill-color': '#DDDDDD',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0.5
        ],
        'fill-outline-color': 'rgba(255, 205, 50, 0.5)'
      }
    })
    // map.on('mousemove', 'state', (e) => {
    //   if (e.features.length > 0) {
    //     if (hoveredStateId) {
    //       map.setFeatureState({source: 'stateResource', id: hoveredStateId}, { hover: false })
    //     }
    //     hoveredStateId = e.features[0].id
    //     map.setFeatureState({source: 'stateResource', id: hoveredStateId}, { hover: true })
    //   }
    // })
    // map.on('mouseleave', 'state', () => {
    //   if (hoveredStateId) {
    //     map.setFeatureState({source: 'stateResource', id: hoveredStateId}, { hover: false })
    //   }
    //   hoveredStateId = null
    // })
  })
}

export function removeStateLayer (map) {
  if (map.getLayer('state')) {
    map.removeLayer('state')
    map.removeSource('stateResource')
  }
}
