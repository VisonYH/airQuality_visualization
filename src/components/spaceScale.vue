<style lang="less">
.scale {
  position: absolute;
  top: 20px;
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
  <div class='scale'>
    <el-popover
      placement="right-start"
      title="空间尺度"
      width="200"
      trigger="manual"
      v-model="visible"
    >
      <el-button size="mini" class='sureBtn' @click="submitSpace">确定</el-button>
      <div>
        <el-cascader
          :options="data"
          filterable
          change-on-select
          expand-trigger="click"
          clearable
          @change="selectChange"
        ></el-cascader>
      </div>
      <el-button slot="reference" @click="visible = !visible">
        <i class="el-icon-location"></i>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import axios from 'axios'
import {mapGetters, mapMutations} from 'vuex'
export default {
  created () {
    axios.get('http://localhost:8080/api/menu/spaceMenu').then((res) => {
      this.data = res.data
    })
  },
  data () {
    return {
      data: [],
      dataMap: {},
      visible: false,
      selectItem: []
    }
  },
  components: {
  },
  computed: {
    ...mapGetters(['spaceScale'])
  },
  methods: {
    ...mapMutations(['mSpaceScale']),
    selectChange (val) {
      this.selectItem = val
    },
    submitSpace () {
      this.visible = false
      this.mSpaceScale(this.selectItem)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
