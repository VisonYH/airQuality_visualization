<style lang="less">
.circleContainer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.tables{
  position: absolute;
  top: 600px;
  z-index: 1000;
  .btn{
    position: absolute;
    top: 80px;
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
        <div class="chartContainer">
          <chart :type='selectedConfig[0]'></chart>
        </div>
        <el-button slot="reference" class='arrow'>
          <i class="el-icon-arrow-down" ref="iconClass"></i>
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import chart from './chart'
import getChartData from '../js/api/getChartData.js'
import {addStateLayer, removeStateLayer} from '../js/layers/stateLayer.js'
import {mapGetters, mapMutations} from 'vuex'
import { Notification } from 'element-ui'
export default {
  name: 'Tables',
  props: {
    map: null
  },
  components: {
    chart
  },
  data () {
    return {
      placeholderArr: ['自变量', '图表类型'],
      configArr: [['time', 'space'], ['rose', 'line', 'map', 'bubble']],
      selectedConfig: ['', ''],
      timeDisabled: false,
      spaceDisabled: false
    }
  },
  computed: {
    ...mapGetters(['spaceScale', 'timeScale', 'timeScaleArr', 'spaceScaleArr', 'chartCat', 'catType', 'chartData'])
  },
  watch: {
    spaceScaleArr (arr) {
      removeStateLayer(this.map)
      addStateLayer(this.map, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1])
    },
    selectedConfig (newV, oldV) {
      this.mChartCat(newV[1])
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
    ...mapMutations(['mChartCat', 'mCatType', 'mChartData']),
    showTable (e) {
      this.$refs.iconClass.className = 'el-icon-arrow-up'
    },
    hideTable (e) {
      this.$refs.iconClass.className = 'el-icon-arrow-down'
    },
    async finishConfig () {
      if (this.timeScaleArr.length === 0 || this.spaceScaleArr.length === 0 || this.catType === '' || this.selectedConfig[0] === '' || this.selectedConfig[1] === '') {
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
      let chartData = await getChartData(this.catType, this.timeScale, time, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1], this.selectedConfig[0])
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
