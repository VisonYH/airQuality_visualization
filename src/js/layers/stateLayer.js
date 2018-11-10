export function addStateLayer (map) {
  map.addSource('stateResource', {
    type: 'geojson',
    data: 'http://localhost:8080/static/china.geojson'
  })
  map.addLayer({
    'id': 'state',
    'type': 'fill',
    'source': 'stateResource',
    'layout': {},
    'paint': {
      'fill-opacity': 0.2,
      'fill-outline-color': 'red'
    }
  })
}

export function removeStateLayer (map) {
  map.removeSource('stateResource')
  map.removeLayer('state')
}
