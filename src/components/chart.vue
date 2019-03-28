<style scoped>
.chart {
  height: 500px;
  width: 490px;
  margin: 10px auto;
  border: 1px solid #ebeef5;
  border-radius: 5px;
}
</style>

<template>
  <div class="chart" id="chartContainer">
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import mapChart from '../js/charts/map'
import lineChart from '../js/charts/line'
import bubbleChart from '../js/charts/bubble'
import roseChart from '../js/charts/rose'
export default {
  name: 'chart',
  computed: {
    ...mapGetters(['timeScale', 'spaceScale', 'spaceScaleArr', 'timeScaleArr', 'chartCat', 'chartData', 'chart', 'xVar'])
  },
  methods: {
    ...mapMutations(['mChart'])
  },
  watch: {
    async chartData (newData, oldData) {
      if (this.chart) {
        this.chart.destroy()
      }
      if (this.xVar === 'time') {
        if (this.chartCat === 'rose') {
          this.mChart(roseChart(newData, document.getElementById('chartContainer')))
        } else if (this.chartCat === 'line') {
          this.mChart(lineChart(newData, document.getElementById('chartContainer'), this.timeScale))
        }
      } else if (this.xVar === 'space') {
        let chartContainer = document.getElementById('chartContainer')
        if (this.spaceScale === 'city' || this.spaceScaleArr[0] === '上海市' || this.spaceScaleArr[0] === '天津市' || this.spaceScaleArr[0] === '北京市' || this.spaceScaleArr[0] === '重庆市') {
          let chart = await bubbleChart(newData, chartContainer, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1])
          this.mChart(chart)
        } else {
          let chart = await mapChart(newData, chartContainer, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1])
          this.mChart(chart)
        }
      }
    }
  }
}
</script>
