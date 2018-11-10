export function addHeatLayer (map) {
  map.addSource('airResource', {
    type: 'geojson',
    data: 'http://localhost:8080/static/test.geojson'
  })
  map.addLayer(
    {
      id: 'air-heat',
      type: 'heatmap',
      source: 'airResource',
      maxzoom: 9,
      paint: {
        // Increase the heatmap weight based on frequency and property magnitude
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'pm2_5'],
          0,
          0,
          500,
          1
        ],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          1,
          9,
          3
        ],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(33,102,172,0)',
          0.2,
          'rgb(103,169,207)',
          0.4,
          'rgb(209,229,240)',
          0.6,
          'rgb(253,219,199)',
          0.8,
          'rgb(239,138,98)',
          1,
          'rgb(178,24,43)'
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          2,
          9,
          20
        ],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
      }
    },
    'waterway-label'
  )
  map.addLayer(
    {
      id: 'air-point',
      type: 'circle',
      source: 'airResource',
      minzoom: 7,
      paint: {
        // Size circle radius by earthquake magnitude and zoom level
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7,
          ['interpolate', ['linear'], ['get', 'pm2_5'], 0, 1, 500, 4],
          16,
          ['interpolate', ['linear'], ['get', 'pm2_5'], 0, 5, 500, 50]
        ],
        // Color circle by earthquake magnitude
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'pm2_5'],
          100,
          'rgba(33,102,172,0)',
          180,
          'rgb(103,169,207)',
          260,
          'rgb(209,229,240)',
          320,
          'rgb(253,219,199)',
          380,
          'rgb(239,138,98)',
          500,
          'rgb(178,24,43)'
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        // Transition from heatmap to circle layer by zoom level
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1]
      }
    },
    'waterway-label'
  )
}

export function removeHeatLayer (map) {
  map.removeSource('airResource')
  map.removeLayer('air-heat')
  map.removeLayer('air-point')
}
