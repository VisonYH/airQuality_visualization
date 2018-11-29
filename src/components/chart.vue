<style scoped>
.chartContainer {
  /* background-color: antiquewhite; */
  height: 500px;
  width: 550px;
  margin-top: 10px;
  border: 1px solid #ebeef5;
  border-radius: 5px;
}
</style>

<template>
  <div class="chartContainer" id="chartContainer">
  </div>
</template>

<script>
import mapChart from '../js/charts/map'
export default {
  name: 'chart',
  data () {
    return {
    }
  },
  props: {
    chartData: {
      type: Array
    }
  },
  mounted () {
    console.log('chartData', this.chartData)
  },
  watch: {
    chartData (newData, oldData) {
      mapChart(newData, document.getElementById('chartContainer'))
    }
  }
}
</script>
