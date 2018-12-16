import axios from 'axios'
import getStation from '../api/getStation'
import * as d3 from 'd3'
export async function addHeatLayer (map, spaceScale, spaceScaleArr, type) {
  let fc = await axios.get('http://localhost:8080/api/realtime')
  fc = fc.data
  let fcObj = {}
  fc.forEach(item => {
    fcObj[item.station_code] = item
  })
  getStation(cb, spaceScaleArr, spaceScale)
  function cb (res) {
    let tempArrForExtent = []
    res.data.features.forEach(item => {
      item.properties[type] = fcObj[item.properties.stationId][type.toLowerCase().replace('.', '_')]
      tempArrForExtent.push(fcObj[item.properties.stationId][type.toLowerCase().replace('.', '_')])
    })
    let linearScale = d3.scaleLinear().domain(d3.extent(tempArrForExtent)).range([0, 1])
    map.addSource('airResource', {
      type: 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': res.data.features
      }
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
            ['get', type],
            linearScale.invert(0),
            0,
            linearScale.invert(1),
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
            5,
            9,
            30
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
            ['interpolate', ['linear'], ['get', type], linearScale.invert(0), 1, linearScale.invert(1), 5],
            16,
            ['interpolate', ['linear'], ['get', type], linearScale.invert(0), 11, linearScale.invert(1), 80]
          ],
          // Color circle by earthquake magnitude
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', type],
            linearScale.invert(0.2),
            'rgba(33,102,172,0)',
            linearScale.invert(0.35),
            'rgb(103,169,207)',
            linearScale.invert(0.45),
            'rgb(209,229,240)',
            linearScale.invert(0.6),
            'rgb(253,219,199)',
            linearScale.invert(0.8),
            'rgb(239,138,98)',
            linearScale.invert(1),
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
}

export function removeHeatLayer (map) {
  if (map.getLayer('air-heat')) {
    map.removeLayer('air-heat')
    map.removeLayer('air-point')
    map.removeSource('airResource')
  }
}
