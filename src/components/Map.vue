<template>
  <div class='mapContainer'>
    <div id='map'></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
// import {addHeatLayer} from '../js/layers/heatLayer.js'
import {addStateLayer} from '../js/layers/stateLayer.js'
import {addStationLayer} from '../js/layers/stationLayer.js'
mapboxgl.accessToken = 'pk.eyJ1Ijoid2VpeWloYW8iLCJhIjoiY2l4ZzFrZjN1MDAxdTJ0bXZ4cmV1cjN3diJ9.8bL8EYDwiuQaBkVQuLUD4Q'

export default {
  name: 'Map',
  data () {
    return {}
  },
  mounted () {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [105.42593433611171, 33.827886548745695],
      zoom: 2.5
    })
    map.on('load', function () {
      // addHeatLayer(map)
      addStateLayer(map)
      addStationLayer(map)
    })
  }
}
</script>

<style scoped>
.mapContainer {
  width: 100%;
  height: 100%;
}
#map {
  height: 100%;
}
</style>
