<template>
  <div class='mapContainer'>
    <space-scale></space-scale>
    <time-space></time-space>
    <div id='map'></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
// import {addHeatLayer} from '../js/layers/heatLayer.js'
import {addStateLayer} from '../js/layers/stateLayer.js'
import {addStationLayer, removeStationLayer} from '../js/layers/stationLayer.js'
import spaceScale from './spaceScale'
import timeSpace from './timeSpace'
import {mapGetters} from 'vuex'
mapboxgl.accessToken = 'pk.eyJ1Ijoid2VpeWloYW8iLCJhIjoiY2l4ZzFrZjN1MDAxdTJ0bXZ4cmV1cjN3diJ9.8bL8EYDwiuQaBkVQuLUD4Q'
let map
export default {
  name: 'Map',
  components: {
    spaceScale,
    timeSpace
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['spaceScale'])
  },
  watch: {
    spaceScale (val) {
      removeStationLayer(map)
      addStationLayer(map, val)
    }
  },
  mounted () {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [105.42593433611171, 33.827886548745695],
      zoom: 2.5
    })
    map.on('load', function () {
      // addHeatLayer(map)
      addStateLayer(map)
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
