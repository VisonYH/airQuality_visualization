<style lang="less" scoped>
.time {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 1);
  z-index: 1000;
}
.btnContainer{
  position: absolute;
  right: 12px;
  top: 10px;
}
</style>
<template>
  <div class='time' ref="timeContainer">
    <span class="btnContainer"><el-button size="mini" type="warning" class='sureBtn' @click="submitTime" icon="el-icon-check" circle></el-button></span>
    <time-axis @change="timeScaleChange"></time-axis>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import timeAxis from '../timeAxis'
export default {
  created () {
  },
  data () {
    return {
      timeScaleArrTemp: ['2015010100', '2016010100'],
      timeScaleTemp: 'year'
    }
  },
  components: {
    timeAxis
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['timeScaleArr'])
  },
  methods: {
    ...mapMutations(['mTimeScaleArr', 'mTimeScale']),
    submitTime () {
      this.mTimeScaleArr(this.timeScaleArrTemp)
      this.mTimeScale(this.timeScaleTemp)
    },
    timeScaleChange (newV) {
      this.timeScaleArrTemp = newV.timeInterval
      this.timeScaleTemp = newV.scale
    }
  }
}
</script>
