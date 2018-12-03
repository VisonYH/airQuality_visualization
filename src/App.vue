<template>
  <div id="app">
    <router-view/>
    <Panels :map='map'></Panels>
  </div>
</template>

<script>
import Panels from './components/panels'
import {mapGetters} from 'vuex'
export default {
  name: 'App',
  components: {
    Panels
  },
  computed: {
    ...mapGetters(['map'])
  }
}
</script>

<style>
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
