<style lang="less">
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
  bottom: 4px;
  right: 10px;
}
.cascader{
  margin-top: 10px;
}
</style>
<template>
  <div class='scale'>
    <el-popover
      placement="bottom-start"
      title="空间尺度"
      width="200"
      trigger="click"
      v-model="visible"
    >
      <el-button size="mini" class='sureBtn' @click="submitSpace" icon="el-icon-check" circle></el-button>
      <div class='cascader'>
        <el-cascader
          placeholder='选择空间尺度'
          size='mini'
          :options="data"
          filterable
          change-on-select
          expand-trigger="click"
          clearable
          @change="selectChange"
        ></el-cascader>
      </div>
      <el-button slot="reference" @click="visible = true">
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
      console.log(this.data)
      this.data.unshift({
        label: '全国',
        value: 'all'
      })
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
    ...mapGetters(['spaceScaleArr'])
  },
  methods: {
    ...mapMutations(['mSpaceScaleArr', 'mSpaceScale']),
    selectChange (val) {
      this.selectItem = val
    },
    submitSpace () {
      this.visible = false
      this.mSpaceScaleArr(this.selectItem)
      if (this.selectItem[0] === 'all') {
        this.mSpaceScale('all')
      } else {
        if (this.selectItem.length === 1) {
          this.mSpaceScale('province')
        } else if (this.selectItem.length === 2) {
          this.mSpaceScale('city')
        } else if (this.selectItem.length === 3) {
          this.mSpaceScale('station')
        }
      }
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
