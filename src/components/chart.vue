<style scoped>
.chartContainer {
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
import { mapGetters } from 'vuex'
import mapChart from '../js/charts/map'
import lineChart from '../js/charts/line'
import bubbleChart from '../js/charts/bubble'
export default {
  name: 'chart',
  data () {
    return {
      chart: null
    }
  },
  props: {
    chartData: {
      type: Array
    },
    type: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['timeScale', 'spaceScale', 'spaceScaleArr'])
  },
  watch: {
    async chartData (newData, oldData) {
      if (this.chart) {
        this.chart.destroy()
      }
      if (this.type === 'time') {
        this.chart = lineChart(newData, document.getElementById('chartContainer'), this.timeScale)
      } else if (this.type === 'space') {
        if (this.spaceScale === 'city') {
          this.chart = await bubbleChart(newData, document.getElementById('chartContainer'), this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1])
        } else {
          this.chart = await mapChart(newData, document.getElementById('chartContainer'), this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1])
        }
      }
    }
  }
}
</script>
