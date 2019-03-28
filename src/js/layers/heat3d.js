import axios from 'axios'
import getStation from '../api/getStation'
import {MapboxLayer} from '@deck.gl/mapbox'
import * as d3 from 'd3'
import {HexagonCellLayer} from '@deck.gl/layers'
export async function addHeat3dLayer (map, spaceScale, spaceScaleArr, type) {
  let fc = await axios.get('http://localhost:8080/api/realtime')
  fc = fc.data
  let fcObj = {}
  fc.forEach(item => {
    fcObj[item.station_code] = item
  })
  getStation(cb, spaceScaleArr, spaceScale)
  function cb (res) {
    // let tempArrForExtent = []
    let dataArr = []
    res.data.features.forEach(item => {
      item.properties[type] = fcObj[item.properties.stationId][type.toLowerCase().replace('.', '_')]
      // tempArrForExtent.push(fcObj[item.properties.stationId][type.toLowerCase().replace('.', '_')])
      dataArr.push({
        position: [parseFloat(item.geometry.coordinates[0]), parseFloat(item.geometry.coordinates[1])],
        elevation: item.properties[type]
      })
    })
    console.log(dataArr)
    const myDeckLayer = new MapboxLayer({
      id: 'hexagon-cell-layer',
      data: dataArr,
      type: HexagonCellLayer,
      radius: 10000,
      angle: 0,
      extruded: true,
      getCentroid: d => d.position,
      getColor: d => {
        let color = d3.scaleThreshold().domain([50, 100, 150, 200, 300]).range([[0, 228, 0], [255, 255, 0], [255, 126, 0], [255, 0, 0], [153, 0, 76], [126, 0, 35]])
        return color(d.elevation)
      },
      getElevation: d => d.elevation * 5000,
      onClick: (e) => {
        console.log(e)
      }
    })
    map.addLayer(myDeckLayer)
    console.log(map.getLayer('hexagon-cell-layer'), res.data.features, fc)
    // const myScatterplotLayer = new MapboxLayer({
    //   id: 'my-scatterplot',
    //   data: res.data.features,
    //   // id: 'my-scatterplot',
    //   type: ScatterplotLayer,
    //   // data: [
    //   //     {position: [-74.5, 40], size: 100}
    //   // ],
    //   getPosition: d => {
    //     // console.log(d)
    //     return d.geometry.coordinates
    //   },
    //   getRadius: d => d.properties[type],
    //   getFillColor: [255, 0, 0]
    // })
    // // add to mapbox
    // console.log(myScatterplotLayer, res.data)
    // map.addLayer(myScatterplotLayer)
    // console.log(map.getLayer('my-scatterplot'))
    // let linearScale = d3.scaleLinear().domain(d3.extent(tempArrForExtent)).range([0, 1])
  }
}

export function removeHeat3dLayer (map) {
  if (map.getLayer('air-heat3d')) {
    map.removeLayer('air-heat')
    map.removeLayer('air-heat3d')
    map.removeLayer('air-point')
    map.removeSource('airResource3d')
  }
}
