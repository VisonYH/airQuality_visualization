<template>
  <div id="app">
    <router-view/>
    <left-panel></left-panel>
    <space-scale></space-scale>
    <layer-manager></layer-manager>
    <time-scale></time-scale>
    <!-- <Panels :map='map'></Panels> -->
    <cat-type></cat-type>
  </div>
</template>

<script>
// import Panels from './components/panels'
import catType from './components/controls/typeControl'
import SpaceScale from './components/controls/spaceControl'
import TimeScale from './components/controls/timeControl'
import LayerManager from './components/controls/layerControl'
import LeftPanel from './components/leftPanel'
import {mapGetters} from 'vuex'
export default {
  name: 'App',
  components: {
    // Panels,
    LayerManager,
    catType,
    SpaceScale,
    TimeScale,
    LeftPanel
  },
  computed: {
    ...mapGetters(['map'])
  }
}
</script>

<style lang='less' scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
</style>
