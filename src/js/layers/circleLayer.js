import bbox from '@turf/bbox'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import Circle from '../libs/circle'
import * as turf from '@turf/turf'
import getCircleData from '../api/getCircleData.js'
export async function addCircleLayer (map, spaceScale, space, timeScale, timeScaleArr, type) {
  let time
  if (timeScale === 'year') {
    time = timeScaleArr[0].substring(0, 4)
  } else if (timeScale === 'month') {
    time = timeScaleArr[0].substring(0, 6)
  } else if (timeScale === 'day') {
    time = timeScaleArr[0].substring(0, 8)
  } else {
    time = timeScaleArr[0]
  }
  let url
  if (spaceScale === 'all' || !spaceScale) {
    url = 'http://localhost:8080/static/china.geojson'
  } else {
    url = `http://localhost:8080/api/quhua/${spaceScale}/${space}`
  }
  let circleData = await getCircleData(type, timeScale, time, spaceScale, space)
  axios.get(url).then(res => {
    map.fitBounds(bbox(res.data), {
      padding: {
        top: 50,
        bottom: 50,
        left: 200,
        right: 50
      }
    })
    if (map.getLayer('circle') || map.getSource('circleResource')) {
      map.removeLayer('circle')
      map.removeSource('circleResource')
    }
    map.addSource('circleResource', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': res.data.features
      }
    })
    map.addLayer({
      'id': 'circle',
      'type': 'fill',
      'source': 'circleResource',
      'layout': {},
      'paint': {
        // 'fill-color': '#DDDDDD',
        'fill-opacity': 0.5,
        'fill-outline-color': '#89901e'
      }
    })
    let posData = res.data.features.map(feature => {
      let geo = turf.centroid(toGeojson(feature))
      return {
        name: feature.properties.name,
        pos: geo.geometry.coordinates,
        data: circleData[feature.properties.name]
      }
    })
    posData = posData.filter(item => {
      return item.data !== undefined
    })
    var canvas = map.getCanvasContainer()
    canvas.querySelector('.circleContainer') && canvas.querySelector('.circleContainer').remove()
    posData.forEach(data => {
      let g = new Circle(canvas, data.data, {type, spaceScale, timeScale, time, space: data.name})
      map.on('viewreset', update)
      map.on('move', update)
      map.on('moveend', update)
      function update () {
        let pos = project(data.pos)
        g.updatePos(pos.x, pos.y)
      }
      g.updateRadius(map.getZoom())
      map.on('zoom', (e) => {
        g.updateRadius(map.getZoom(), spaceScale)
      })
    })
    function project (d) {
      return map.project(new mapboxgl.LngLat(+d[0], +d[1]))
    }
  })
}

export function removeCircleLayer (map) {
  if (map.getLayer('circle')) {
    map.removeLayer('circle')
    map.removeSource('circleResource')
    var canvas = map.getCanvasContainer()
    canvas.querySelector('.circleContainer') && canvas.querySelector('.circleContainer').remove()
  }
}
function toGeojson (feature) {
  let geojson = {
    'type': 'FeatureCollection',
    'features': [feature]
  }
  return geojson
}
