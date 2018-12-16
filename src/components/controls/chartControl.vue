<style lang="less">
.chartContent{
  .select-group{
    margin: 5px 0 0 5px;
  }
}
.circleContainer{
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  bottom: 0;
}
canvas {
  display: block;
  width: 100%!important;
}
</style>
<template>
  <div class='chartContent'>
    <div class="select-group">
      <Select size="small" style="width:100px;margin-right:10px" clearable :placeholder="placeholderArr[0]" v-model='selectedConfigXVar'>
        <Option
          v-for="item in configXVar"
          :key="item"
          :label="item"
          :disabled="(item === 'time' && timeDisabled) || (item === 'space' && spaceDisabled)"
          :value="item">
        </Option>
      </Select>
      <Select size="small" style="width:100px;margin-right:10px" clearable :placeholder="placeholderArr[1]" v-model='selectedConfigChart'>
        <Option
          v-for="item in configChart"
          :key="item"
          :label="item"
          :disabled="(item === 'time' && timeDisabled) || (item === 'space' && spaceDisabled)"
          :value="item">
        </Option>
      </Select>
      <el-button title="确认配置" type="warning" class="submitConfigBtn" size="mini" @click="finishConfig" icon="el-icon-check" circle></el-button>
    </div>
    <div class="chartContainer">
      <chart></chart>
    </div>
  </div>
</template>

<script>
import chart from '../chart'
import getChartData from '../../js/api/getChartData.js'
import {mapGetters, mapMutations} from 'vuex'
import { Notification } from 'element-ui'
export default {
  name: 'Tables',
  components: {
    chart
  },
  data () {
    return {
      placeholderArr: ['自变量', '图表类型'],
      configXVar: ['time', 'space'],
      configChart: [],
      selectedConfigXVar: '',
      selectedConfigChart: '',
      timeDisabled: false,
      spaceDisabled: false
    }
  },
  computed: {
    ...mapGetters(['map', 'spaceScale', 'timeScale', 'timeScaleArr', 'spaceScaleArr', 'chartCat', 'catType', 'chartData', 'xVar'])
  },
  watch: {
    selectedConfigXVar (newV) {
      this.mXVar(newV)
      this.selectedConfigChart = ''
      if (newV === 'time') {
        this.configChart = ['rose', 'line']
      } else if (newV === 'space') {
        this.configChart = ['map']
      }
    },
    selectedConfigChart (newV) {
      this.mChartCat(newV)
    },
    timeScale (newScale, old) {
      if (newScale === 'hour') {
        this.timeDisabled = true
      } else {
        this.timeDisabled = false
      }
    },
    spaceScale (newScale, old) {
      if (newScale === 'station') {
        this.spaceDisabled = true
      } else {
        this.spaceDisabled = false
      }
    }
  },
  methods: {
    ...mapMutations(['mChartCat', 'mCatType', 'mChartData', 'mXVar']),
    showTable (e) {
      this.$refs.iconClass.className = 'el-icon-arrow-up'
    },
    hideTable (e) {
      this.$refs.iconClass.className = 'el-icon-arrow-down'
    },
    async finishConfig () {
      if (this.spaceScaleArr.length === 0 || this.xVar === '' || this.chartCat === '') {
        const h = this.$createElement
        Notification({
          title: '提示',
          type: 'warning',
          message: h('p', {style: 'color: teal'}, '请先配置图表属性')
        })
        return
      }
      let time
      if (this.timeScale === 'year') {
        time = this.timeScaleArr[0].substring(0, 4)
      } else if (this.timeScale === 'month') {
        time = this.timeScaleArr[0].substring(0, 6)
      } else if (this.timeScale === 'day') {
        time = this.timeScaleArr[0].substring(0, 8)
      } else {
        time = this.timeScaleArr[0]
      }
      let chartData = await getChartData(this.catType, this.timeScale, time, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1], this.xVar)
      this.mChartData(chartData)
      if (chartData && chartData.length === 0) {
        const h = this.$createElement
        Notification({
          title: '提示',
          type: 'info',
          message: h('p', {style: 'color: teal'}, '暂无数据')
        })
      }
    }
  }
}
</script>
