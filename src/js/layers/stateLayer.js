export function addStateLayer (map, spaceScale, address) {
  let url
  console.log(spaceScale, address)
  if (spaceScale === 'all' || !spaceScale) {
    url = 'http://localhost:8080/static/china.geojson'
  } else {
    url = `http://localhost:8080/api/quhua/${spaceScale}/${address}`
  }
  map.addSource('stateResource', {
    type: 'geojson',
    data: url
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
  map.removeLayer('state')
  map.removeSource('stateResource')
}
