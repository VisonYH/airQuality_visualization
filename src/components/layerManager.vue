<style lang="less">
.layerM{
  position: absolute;
  top: 10px;
  z-index: 1000;
  .btn{
    position: absolute;
    top: 120px;
    left: 10px;
    z-index: 10;
    .el-button {
      padding: 10px 10px;
      font-size: 20px;
      border-radius: 50%;
    }
  }
}
.layerPop{
  .el-popover__title{
    display: inline-block;
    font-size: 16px;
  }
  .el-radio-group {
    margin-top: 10px;
    display: block;
    label{
      display: block;
      margin: 10px 0;
    }
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
  <div class='layerM'>
    <div class="btn">
      <el-popover
        placement="bottom"
        popper-class="layerPop"
        title="图层管理"
        trigger="click">
        <el-button title="确认" size="mini" @click="sureLayer" icon="el-icon-check" circle></el-button>
        <el-radio-group v-model="currentLayer">
          <el-radio label="年轮图">年轮图</el-radio>
          <el-radio label="热力图">热力图</el-radio>
          <el-radio label="环图">环图</el-radio>
          <el-radio label="站点">站点</el-radio>
        </el-radio-group>
        <el-button slot="reference" class='arrow'>
          <i class="el-icon-tickets" ref="iconClass"></i>
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
// import { Notification } from 'element-ui'
import {addCircleLayer, removeCircleLayer} from '../js/layers/circleLayer.js'
import {addHeatLayer, removeHeatLayer} from '../js/layers/heatLayer.js'
import {addStationLayer, removeStationLayer} from '../js/layers/stationLayer.js'
import {addYearLayer, removeYearLayer} from '../js/layers/yearsCircleLayer.js'
export default {
  data () {
    return {
      currentLayer: '热力图'
    }
  },
  computed: {
    ...mapGetters(['map', 'spaceScale', 'spaceScaleArr', 'catType', 'timeScale', 'timeScaleArr'])
  },
  watch: {
    spaceScaleArr (newArr) {
      this.sureLayer()
    }
  },
  methods: {
    async sureLayer () {
      if (this.currentLayer === '站点') {
        this.removeOtherLayer()
        addStationLayer(this.map, this.spaceScaleArr, this.spaceScale)
      } else if (this.currentLayer === '热力图') {
        this.removeOtherLayer()
        let scale = this.spaceScale ? this.spaceScale : 'all'
        let address = this.spaceScaleArr ? this.spaceScaleArr : 'all'
        let catType = this.catType ? this.catType : 'AQI'
        addHeatLayer(this.map, scale, address, catType)
      } else if (this.currentLayer === '环图') {
        this.removeOtherLayer()
        addCircleLayer(this.map, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1], this.timeScale, this.timeScaleArr, this.catType)
      } else if (this.currentLayer === '年轮图') {
        this.removeOtherLayer()
        addYearLayer(this.map, scale, address)
      }
    },
    removeOtherLayer () {
      removeHeatLayer(this.map)
      removeStationLayer(this.map)
      removeCircleLayer(this.map)
    }
  }
}
</script>
