<template>
  <div class="leftPanel">
    <div class="tabs" @click="selectTab">
      <div class="chart tab" :class="{activeItem: activeItem === 'chart'}" label='chart'>统计图表</div>
      <div class="data tab" :class="{activeItem: activeItem === 'data'}" label='data'>数据视图</div>
    </div>
    <div class="content" :style="{display: activeItem === null ? 'none' : 'block'}">
      <span><el-button type="warning" class="close" size="mini" @click="close" icon="el-icon-circle-close" circle></el-button></span>
      <chart-control v-show='activeItem==="chart"'></chart-control>
      <dataview-control v-if='activeItem==="data"'></dataview-control>
    </div>
  </div>
</template>

<script>
import chartControl from './controls/chartControl'
import dataviewControl from './controls/dataViewControl'
export default {
  data () {
    return {
      activeItem: null
    }
  },
  components: {
    chartControl,
    dataviewControl
  },
  methods: {
    selectTab (e) {
      let label = e.target.getAttribute('label')
      this.activeItem = this.activeItem === label ? null : label
    },
    close () {
      this.activeItem = null
    }
  }
}
</script>

<style lang='less'>
.leftPanel{
  position: absolute;
  top: 20px;
  left: 0;
  width: 400px;
  .content{
    .close{
      position: absolute;
      right: -3px;
      top: -3px;
      z-index: 2000;
    }
    span .is-circle {
      padding: 1px!important;
    }
    position: absolute;
    top: 40px;
    left: 0;
    background: #dcdee2;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: all .3s ease-in-out;
  }
  .tabs{
    position: absolute;
    top: 0px;
    left: 0;
    font-size: 0;
    border-bottom: 1px solid #dcdee2;
    background: rgb(0, 0, 0);
    border-top-right-radius: 5px;
    .tab{
      display: inline-block;
      height: 100%;
      padding: 5px 16px;
      font-size: 14px;
      margin-right: 16px;
      box-sizing: border-box;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      text-decoration: none;
      position: relative;
      transform: translate(0, 1px);
      transition: color .3s ease-in-out;
      border-bottom: 2px solid rgba(255, 205, 50, 0);
    }
    .tab:hover {
      color: rgb(255, 205, 50);
    }
    .activeItem{
      border-bottom: 2px solid rgb(255, 205, 50);
      transition: color .3s ease-in-out;
      color: rgb(255, 205, 50);
    }
  }
}
.el-select-dropdown__item {
    font-size: 12px;
    padding: 0 16px;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 25px;
    line-height: 25px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
}
.el-popper[x-placement^=bottom] {
    margin-top: 5px;
}
</style>
