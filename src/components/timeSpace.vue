<style lang="less" scoped>
.timescale {
  position: absolute;
  top: 80px;
  left: 20px;
  z-index: 10;
  .el-cascader {
    width: 100px;
  }
  .el-cascader-menu{
    min-width: 100px;
  }
  .el-button {
    padding: 10px 10px;
    font-size: 20px;
    border-radius: 50%;
  }
}
.sureBtn {
  float: right;
  position: relative;
  bottom: 7px;
}
.el-popover__title {
  float: left;
}
</style>
<template>
  <div class='timescale'>
    <el-popover
      placement="right-start"
      title="时间尺度"
      width="700"
      trigger="manual"
      v-model="visible"
    >
      <el-button size="mini" class='sureBtn' @click="submitTime">确定</el-button>
      <time-axis @change="timeScaleChange"></time-axis>
      <el-button slot="reference" @click="visible = !visible">
        <i class="el-icon-date"></i>
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
      timeScaleTemp: null
    }
  },
  components: {
    timeAxis
  },
  computed: {
    ...mapGetters(['timeScale'])
  },
  methods: {
    ...mapMutations(['mTimeScale']),
    submitTime () {
      this.mTimeScale(this.timeScaleTemp)
      this.visible = false
      console.log(this.timeScale)
    },
    timeScaleChange (timeScale) {
      this.timeScaleTemp = timeScale
    }
  }
}
</script>
