<style lang="less" scoped>
.scale {
  z-index: 10;
  .el-cascader {
    width: 100px;
  }
  .el-cascader-menu{
    min-width: 100px;
  }
  .el-button {
    padding: 5px 5px;
    font-size: 16px;
    border-radius: 50%;
  }
}
.sureBtn {
  float: right;
  position: relative;
  right: 30px;
}
</style>
<template>
  <div class='scale'>
    <el-popover
      placement="right-start"
      title="时间尺度"
      width="700"
      trigger="click"
      v-model="visible"
    >
      <el-button size="mini" class='sureBtn' @click="submitTime" icon="el-icon-check" circle></el-button>
      <time-axis @change="timeScaleChange"></time-axis>
      <el-button slot="reference" @click="visible = true">
        <i class="el-icon-time"></i>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
// import axios from 'axios'
import {mapGetters, mapMutations} from 'vuex'
import timeAxis from './timeAxis'
export default {
  created () {
  },
  data () {
    return {
      visible: false,
      timeScaleArrTemp: ['2015010100', '2016010100'],
      timeScaleTemp: 'year'
    }
  },
  components: {
    timeAxis
  },
  computed: {
    ...mapGetters(['timeScaleArr'])
  },
  methods: {
    ...mapMutations(['mTimeScaleArr', 'mTimeScale']),
    submitTime () {
      this.mTimeScaleArr(this.timeScaleArrTemp)
      this.mTimeScale(this.timeScaleTemp)
      this.visible = false
    },
    timeScaleChange (newV) {
      this.timeScaleArrTemp = newV.timeInterval
      this.timeScaleTemp = newV.scale
    }
  }
}
</script>
