<template>
  <div class="dataview">
    <div class="dataview-head">
      <div class="title">当前数据表</div>
      <div class="btn">
        <el-button circle size='mini' icon="el-icon-download"/>
      </div>
    </div>
    <Table v-if="chartData" :columns="fields" stripe :data="chartData" width='300'></Table>
    <p v-if="!chartData" style="width: 200px">暂无数据</p>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters(['chartData', 'xVar']),
    fields () {
      return [
        {
          title: this.xVar === 'time' ? 'date' : 'address',
          key: this.xVar === 'time' ? 'date' : 'address'
        }, {
          title: 'value',
          key: 'value',
          sortable: true
        }
      ]
    }
  }
}
</script>
<style lang="less">
.dataview{
  padding: 5px;
  .dataview-head{
    display: flex;
    height: 35px;
    align-items: center;
    .title{
      flex: 1;
      font-size: 18px;
      font-weight: 700;
      text-align: right;
    }
    .btn{
      flex: 0 0 100px;
      margin-left: 20px;
    }
  }
}
.ivu-table td, .ivu-table th {
  height: 25px!important;
}
</style>
