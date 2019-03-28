<template>
  <div class='mapContainer'>
    <div id='map'></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import {addStateLayer} from '../js/layers/stateLayer.js'
// import {addHeatLayer} from '../js/layers/heatLayer.js'
import {mapGetters, mapMutations} from 'vuex'
mapboxgl.accessToken = 'pk.eyJ1Ijoid2VpeWloYW8iLCJhIjoiY2l4ZzFrZjN1MDAxdTJ0bXZ4cmV1cjN3diJ9.8bL8EYDwiuQaBkVQuLUD4Q'
export default {
  name: 'Map',
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters(['spaceScale', 'spaceScaleArr', 'catType'])
  },
  methods: {
    ...mapMutations(['mMap'])
  },
  mounted () {
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [105.42593433611171, 33.827886548745695],
      zoom: 2.5
    })
    map.on('load', () => {
      // let scale = this.spaceScale ? this.spaceScale : 'all'
      // let address = this.spaceScaleArr ? this.spaceScaleArr : 'all'
      // let catType = this.catType ? this.catType : 'AQI'
      // addHeatLayer(map, scale, address, catType)
      addStateLayer(map, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1])
    })
    this.mMap(map)
  }
}
</script>

<style lang='less'>
.mapContainer {
  width: 100%;
  height: 100%;
}
#map {
  height: 100%;
  width: 100%;
  position:absolute;
  top:0;
  bottom:0;
  right: 0;
  left: 0;
}
.mapboxgl-popup-content {
    background: #343332;
    color: #fff;
}
.mapboxgl-popup-close-button{
  display: inline-block;
  width: 20px;
}
.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
    border-top-color: #343332;
}
.popContainer{
  svg{
    display: block;
    margin: 0 auto;
  }
}
</style>
