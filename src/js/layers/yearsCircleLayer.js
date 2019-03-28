import bbox from '@turf/bbox'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import HeatCircle from '../libs/heatCircle.js'
export function addYearLayer (map, spaceScale, address, type) {
  let url
  let hoveredStateId = null
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
    map.addSource('yearsResource', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': res.data.features
      },
      'generateId': true
    })
    map.addLayer({
      'id': 'yearsLayer',
      'type': 'fill',
      'source': 'yearsResource',
      'layout': {},
      'paint': {
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0.3
        ],
        'fill-outline-color': 'rgba(255, 205, 50, 0.5)'
      }
    })
    map.on('mousemove', 'yearsLayer', (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId) {
          map.setFeatureState({source: 'yearsResource', id: hoveredStateId}, { hover: false })
        }
        hoveredStateId = e.features[0].id
        map.setFeatureState({source: 'yearsResource', id: hoveredStateId}, { hover: true })
      }
    })
    map.on('mouseleave', 'yearsLayer', () => {
      if (hoveredStateId) {
        map.setFeatureState({source: 'yearsResource', id: hoveredStateId}, { hover: false })
      }
      hoveredStateId = null
    })
    map.on('click', 'yearsLayer', (e) => {
      let space = e.features[0].properties.name
      let domFrag = document.createDocumentFragment()
      let div = document.createElement('div')
      div.className = 'popContainer'
      div.style.width = '350px'
      div.style.height = '350px'
      div.id = 'popContainer'
      domFrag.appendChild(div)
      let title = document.createElement('h3')
      title.style.textAlign = 'center'
      title.style.color = '#fff'
      title.style.lineHeight = '30px'
      title.innerHTML = '近三年监测年轮图'
      div.appendChild(title)
      new mapboxgl.Popup().setLngLat(e.lngLat).setDOMContent(domFrag).addTo(map)
      let heatCircle = new HeatCircle('#popContainer', type, space)
      console.dir(heatCircle)
    })
  })
}

export function removeYearLayer (map) {
  if (map.getLayer('yearsLayer')) {
    map.removeLayer('yearsLayer')
    map.removeSource('yearsResource')
  }
}
