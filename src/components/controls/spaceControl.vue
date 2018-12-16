<style lang="less">
.space {
  position: absolute;
  top: 20px;
  right: 300px;
  font-size: 0;
  .ivu-cascader{
    display: inline-block;
    width: 250px;
  }
  .ivu-cascader-rel{
    .ivu-input{
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .btn {
    vertical-align: middle;
    padding: 8px 15px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  ::-webkit-scrollbar{
    width: 5px;
    background-color: #fff;
  }
  ::-webkit-scrollbar-track{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: lightgray;
  }
  ::-webkit-scrollbar-thumb{
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: rgb(255, 205, 50);
  }
}
</style>
<template>
  <div class='space'>
    <div class='cascader'>
      <Cascader
        placeholder='选择区域'
        :data="data"
        filterable
        change-on-select
        trigger="click"
        clearable
        @on-change="selectChange"
      >
      </Cascader>
      <el-button class='btn' icon="el-icon-search" @click='submitSpace' type="warning"></el-button>
    </div>
  </div>
</template>

<script>
import getSpaceMenu from '../../js/api/getSpaceMenu.js'
import {addStateLayer, removeStateLayer} from '../../js/layers/stateLayer.js'
import {mapGetters, mapMutations} from 'vuex'
export default {
  async created () {
    this.data = await getSpaceMenu()
  },
  data () {
    return {
      data: [],
      dataMap: {},
      visible: false,
      selectItem: []
    }
  },
  watch: {
    spaceScaleArr (arr) {
      removeStateLayer(this.map)
      addStateLayer(this.map, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1])
    }
  },
  computed: {
    ...mapGetters(['spaceScaleArr', 'map', 'spaceScale'])
  },
  methods: {
    ...mapMutations(['mSpaceScaleArr', 'mSpaceScale']),
    removeSuffix () {
      document.querySelector('.el-input__suffix').remove()
    },
    selectChange (val) {
      this.selectItem = val
    },
    submitSpace () {
      this.visible = false
      this.mSpaceScaleArr(this.selectItem)
      if (this.selectItem[0] === 'all' || this.selectItem.length === 0) {
        this.mSpaceScaleArr(['all'])
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
