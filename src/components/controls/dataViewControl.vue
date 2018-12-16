<template>
  <div class="dataview">
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
}
.ivu-table td, .ivu-table th {
  height: 25px!important;
}
</style>
