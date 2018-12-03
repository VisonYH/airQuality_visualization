<style lang="less">
.tables{
  position: absolute;
  top: 0;
  z-index: 1000;
  .btn{
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    .el-button {
      padding: 10px 10px;
      font-size: 20px;
      border-radius: 50%;
    }
  }
}
.el-popover{
  .el-popover__title{
    display: inline-block;
    font-weight: 700;
    font-size: 20px;
    margin: 0 20px 0 0;
  }
  .scale{
    display: inline-block;
    margin-left: 10px;
  }
  .submitConfigBtn {
    margin-left: 10px;
    padding: 5px 5px;
    font-size: 16px;
    border-radius: 50%;
  }
  .select-group {
    .el-select--mini {
      margin-right: 10px;
    }
    .el-input__inner{
      width: 100px;
    }
  }
}
.select-popover{
  .el-select-dropdown__item {
    font-size: 12px;
    height: 25px;
    line-height: 25px;
  }
}
</style>

<template>
  <div class='tables'>
    <div class="btn">
      <el-popover
        @show="showTable"
        @hide="hideTable"
        placement="bottom"
        title="图表配置项"
        width="550"
        trigger="click">
        <space-scale class="spaceScale" title="空间比例尺"></space-scale>
        <time-space class="timeScale" title="时间比例尺"></time-space>
        <el-button title="确认配置" class="submitConfigBtn" size="mini" @click="finishConfig" icon="el-icon-check" circle></el-button>
        <hr>
        <div class="select-group">
          <el-select size='mini' popper-class='select-popover' v-model="selectedConfig[index]" clearable :placeholder="placeholderArr[index]" v-for="(config, index) in configArr" :key="index">
            <el-option
              v-for="item in config"
              :key="item"
              :label="item"
              :disabled="(item === 'time' && timeDisabled) || (item === 'space' && spaceDisabled)"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <chart :chartData='chartData' :type='selectedConfig[2]'></chart>
        <el-button slot="reference" class='arrow'>
          <i class="el-icon-arrow-down" ref="iconClass"></i>
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import spaceScale from './spaceScale'
import timeSpace from './timeScale'
import chart from './chart'
import getChartData from '../js/api/getChartData.js'
import {addStationLayer, removeStationLayer} from '../js/layers/stationLayer.js'
import {addStateLayer, removeStateLayer} from '../js/layers/stateLayer.js'
import {mapGetters} from 'vuex'
import { Notification } from 'element-ui'
export default {
  name: 'Tables',
  props: {
    map: null
  },
  components: {
    spaceScale,
    timeSpace,
    chart
  },
  data () {
    return {
      placeholderArr: ['数据类型', '图表类型', '自变量', '因变量'],
      configArr: [['AQI', 'PM2.5', 'PM10'], ['pie'], ['time', 'space']],
      selectedConfig: ['', '', ''],
      chartData: null,
      timeDisabled: false,
      spaceDisabled: false
    }
  },
  computed: {
    ...mapGetters(['spaceScale', 'timeScale', 'timeScaleArr', 'spaceScaleArr'])
  },
  watch: {
    spaceScaleArr (arr) {
      removeStationLayer(this.map)
      removeStateLayer(this.map)
      addStateLayer(this.map, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1])
      addStationLayer(this.map, arr, this.spaceScale)
    },
    selectedConfig (newV, oldV) {
      console.log('newV', newV)
    },
    timeScale (newScale, old) {
      if (newScale === 'hour') {
        this.timeDisabled = true
      } else {
        this.timeDisabled = false
      }
    },
    spaceScale (newScale, old) {
      console.log('newSpaceSCale', newScale)
      if (newScale === 'station') {
        this.spaceDisabled = true
      } else {
        this.spaceDisabled = false
      }
    }
  },
  mounted () {
  },
  methods: {
    showTable (e) {
      this.$refs.iconClass.className = 'el-icon-arrow-up'
    },
    hideTable (e) {
      this.$refs.iconClass.className = 'el-icon-arrow-down'
    },
    async finishConfig () {
      if (this.timeScaleArr.length === 0 || this.spaceScaleArr.length === 0 || this.selectedConfig[0] === '' || this.selectedConfig[1] === 0 || this.selectedConfig[2] === 0) {
        console.log(this.timeScaleArr, this.spaceScaleArr, this.selectedConfig)
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
      this.chartData = await getChartData(this.selectedConfig[0], this.timeScale, time, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1], this.selectedConfig[2])
      if (this.chartData.length === 0) {
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
